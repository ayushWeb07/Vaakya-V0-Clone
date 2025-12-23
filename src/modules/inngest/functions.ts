import { inngest } from "./client";
import { Sandbox } from "@e2b/code-interpreter";
import { createCodingNetwork } from "../ai-agent/agent";
import { prisma } from "@/lib/db";

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

    // 2: run ai agent
    const { prompt } = event.data;
    const { projectId } = event.data;

    const codingNetwork = createCodingNetwork(sandboxId);
    const networkResult = await codingNetwork.run(prompt);

    // 3: connect to the created sandbox and get its url
    const sandboxUrl = await step.run("get-sandbox-url", async () => {
      // connect to sandbox
      const sbx = await Sandbox.connect(sandboxId);

      // get the host address for the port
      const host = sbx.getHost(3000);

      // return the sandbox url
      return `http://${host}`;
    });

    // 4: create a new message in the DB
    const title = "Next.js Fragment";
    const summary = networkResult.state.data?.summary;
    const files = networkResult.state.data?.files;

    const isError = !summary || Object.keys(files || {}).length === 0;

    await step.run("save-result-in-db", async () => {
      let createdMessage = null;

      if (isError) {
        // create the error message
        createdMessage = await prisma.message.create({
          data: {
            content:
              "Something went wrong :(. Check the inngest logs and try again!",
            role: "ASSISTANT",
            type: "ERROR",
            projectId,
          },
        });
      } else {
        // create the result message
        createdMessage = await prisma.message.create({
          data: {
            content: summary,
            role: "ASSISTANT",
            type: "RESULT",
            projectId,

            fragment: {
              create: {
                title,
                sandboxUrl,
                sandboxFiles: files,
              },
            },
          },
        });
      }

      return createdMessage;
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
