import { inngest } from "./client";
import { createAgent, openai } from "@inngest/agent-kit";
import { Sandbox } from "@e2b/code-interpreter";

// create a model
// const model = openai({ model: "gpt-4.1" });

// // create an agent
// const greetingAgent = createAgent({
//   model: model,
//   name: "Enthusiast Greeter",
//   system:
//     "You are a helpful assistant who always greets with enthusiasm and cheerfulness...",
//   description: "A simple AI agent that greets the user",
// });

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    // 1: sleep
    await step.sleep("wait-a-moment", "1s");

    // 2: run ai agent
    // const {output} = await greetingAgent.run(event.data.name);

    // 3: create sandbox and get id [1]
    const sandboxId = await step.run("get-sandbox-id", async () => {
      // create a sandbox
      const sbx = await Sandbox.create("f1moj4g4fa2pm1e2zu4v");

      // return the sandbox id
      return sbx?.sandboxId;
    });

    // 4: connect to the created sandbox and get its url [2]
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
    };
  }
);
