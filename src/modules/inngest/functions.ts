import { inngest } from "./client";
import { createAgent, openai } from "@inngest/agent-kit";

// create a model
const model = openai({ model: "gpt-4.1" });

// create an agent
const greetingAgent = createAgent({
  model: model,
  name: "Enthusiast Greeter",
  system:
    "You are a helpful assistant who always greets with enthusiasm and cheerfulness...",
  description: "A simple AI agent that greets the user",
});

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    // 1: sleep
    await step.sleep("wait-a-moment", "1s");

    // 2: run ai agent
    const {output} = await greetingAgent.run(event.data.name);

    return output;
  }
);
