import { inngest } from "./client";
import { Sandbox } from "@e2b/code-interpreter";
import {
  createCodingNetwork,
  createFragmentTitleGeneratorAgent,
  createResponseGeneratorAgent,
} from "../ai-agent/agent";
import { prisma } from "@/lib/db";
import { captureThumbnailAndUpload, getTimeWorkedFor } from "./utils";
import { MemoryClient } from "mem0ai";
import { createState, type Message } from "@inngest/agent-kit";
// import { Message } from "@/generated/prisma/client";

// create a mem0 client
const memClient = new MemoryClient({ apiKey: process.env.MEM0_API_KEY! });

export const invokeAiAgent = inngest.createFunction(
  { id: "invoke-ai-agent" },
  { event: "ai-agent/invoke" },
  async ({ event, step }) => {
    // 1: create sandbox and get id
    const sandboxId = await step.run("get-sandbox-id", async () => {
      // create a sandbox
      const sbx = await Sandbox.create("f1moj4g4fa2pm1e2zu4v");

      // return the sandbox id
      return sbx?.sandboxId;
    });

    // 2: get the constant values
    const { prompt } = event.data;
    const { projectId } = event.data;
    const { userId } = event.data;

    // 3: get the previous messages of this project
    const previousMessagesOfProject = await step.run(
      "get-previous-messages",
      async () => {
        const formatedMessages: Message[] = [];

        // get the messages from the DB of this project
        const messages = await prisma.message.findMany({
          where: {
            projectId,
            userId,
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 10,
        });

        for (const msg of messages) {
          formatedMessages.push({
            type: "text",
            role: msg?.role?.toLowerCase() as "assistant" | "user",
            content: msg?.content,
          });
        }

        return formatedMessages.reverse();
      }
    );

    // 4: run ai agent

    // create a state
    const state = createState<{
      summary: string;
      files: {};
    }>(
      {
        summary: "",
        files: {},
      },
      {
        messages: previousMessagesOfProject,
      }
    );

    // create the network with the state and run it
    const fragmentGeneratorAgent = createFragmentTitleGeneratorAgent(); // fragment generator agent
    const responseGeneratorAgent = createResponseGeneratorAgent(); // response generator agent

    const codingNetwork = createCodingNetwork(sandboxId, state);
    const networkResult = await codingNetwork.run(prompt, { state });

    // 5: connect to the created sandbox and get its url
    const sandboxUrl = await step.run("get-sandbox-url", async () => {
      // connect to sandbox
      const sbx = await Sandbox.connect(sandboxId);

      // get the host address for the port
      const host = sbx.getHost(3000);

      // return the sandbox url
      return `http://${host}`;
    });

    // 6: create a new message in the DB
    let title = "Next.js Project";
    const summary = networkResult.state.data?.summary;
    let enhancedSummary = ""
    const files = networkResult.state.data?.files;

    const isError = !summary || Object.keys(files || {}).length === 0;

    // get the fragment title and response from another agents
    if (!isError) {
      // get the fragment title from the agent
      const { output: fragmentOutput } = await fragmentGeneratorAgent.run(
        summary
      );

      if (
        Array.isArray(fragmentOutput) &&
        fragmentOutput.length > 0 &&
        fragmentOutput[0]?.type === "text" &&
        fragmentOutput[0]?.role === "assistant" &&
        fragmentOutput[0]?.content
      ) {
        if (Array.isArray(fragmentOutput[0]?.content)) {
          title = fragmentOutput[0]?.content?.map((m) => m?.text).join("");
        } else {
          title = fragmentOutput[0]?.content;
        }
      }

      // get the enhanced response summary from the agent
      const { output: responseOutput } = await responseGeneratorAgent.run(
        summary
      );

      if (
        Array.isArray(responseOutput) &&
        responseOutput.length > 0 &&
        responseOutput[0]?.type === "text" &&
        responseOutput[0]?.role === "assistant" &&
        responseOutput[0]?.content
      ) {
        if (Array.isArray(responseOutput[0]?.content)) {
          enhancedSummary = responseOutput[0]?.content?.map((m) => m?.text).join("");
        } else {
          enhancedSummary = responseOutput[0]?.content;
        }
      }

      
    }

    await step.run("save-result-in-db", async () => {
      let createdMessage = null;

      if (isError) {
        // create the error message
        createdMessage = await prisma.message.create({
          data: {
            content: summary || "Something went wrong. Please try again later!",
            role: "ASSISTANT",
            type: "ERROR",
            projectId,
            userId,
          },
        });
      } else {
        // get the time worked for
        const timeWorkedFor = await getTimeWorkedFor(projectId);

        // create the result message
        createdMessage = await prisma.message.create({
          data: {
            content: enhancedSummary.length > 0 ? enhancedSummary : summary,
            role: "ASSISTANT",
            type: "RESULT",
            projectId,
            userId,

            fragment: {
              create: {
                title,
                sandboxUrl,
                sandboxFiles: files,
                creditsSpent: 1,
                workedFor: timeWorkedFor,
              },
            },
          },
        });
      }

      return createdMessage;
    });

    // 7: update the project's thumbnail
    await step.run("update-project-thumbnail", async () => {
      const uploadResult = await captureThumbnailAndUpload(sandboxUrl);

      // update the project's thumbnail if the upload was successful
      if (uploadResult && uploadResult?.imageUrl) {
        await prisma.project.update({
          where: {
            id: projectId,
          },
          data: {
            thumbnailUrl: uploadResult.imageUrl,
          },
        });
      }

      return uploadResult;
    });

    // finalization
    return {
      sandboxId,
      sandboxUrl,
      title,
      summary,
      sandboxFiles: files,
    };
  }
);
