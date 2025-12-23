import { inngest } from "./client";
import { Sandbox } from "@e2b/code-interpreter";
import { createCodingNetwork } from "../ai-agent/agent";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
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


    return {
      sandboxId,
      sandboxUrl,
      summary: networkResult.state.data?.summary,
      files: networkResult.state.data?.files,
    };
  }
);
