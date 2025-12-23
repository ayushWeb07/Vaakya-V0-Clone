import { createAgent, createNetwork, openai } from "@inngest/agent-kit";
import {
  createOrUpdateFiles,
  readFilesFromSandbox,
  terminalTool,
} from "./tools";
import { AGENT_SYSTEM_PROMPT } from "./prompt";
import { getLastAssistantMessage } from "./utils";

// create a model
const model = openai({
  model: "gpt-4.1",
  defaultParameters: {
    temperature: 0.1,
  },
});

// create an agent
const createCodingAgent = (sandboxId: string) => {
  return createAgent({
    model: model,
    name: "Expert Code Agent",
    system: AGENT_SYSTEM_PROMPT,
    description: "An expert coding agent that excels in writing quality code.",

    tools: [
      terminalTool(sandboxId),
      createOrUpdateFiles(sandboxId),
      readFilesFromSandbox(sandboxId),
    ],

    lifecycle: {
      onResponse: async ({ result, network }) => {

        // get the last assistant message
        const lastAssistantMessage = getLastAssistantMessage(result);

        // update network state if lastAssistantMessage contains <task_summary>
        if (lastAssistantMessage && network) {
          if (lastAssistantMessage.includes("<task_summary>")) {
            network.state.data.summary = lastAssistantMessage; 
          }
        }

        return result;
      },
    },
  });
};

// create a network along with a router
const createCodingNetwork = (sandboxId: string) => {

    const codingAgent= createCodingAgent(sandboxId) // create a coding agent

    return createNetwork({
        name: "Coding Network",
        description: "A networking containing the coding agent",
        maxIter: 10,
        agents: [codingAgent],

        router: async ({network}) => {

            // summary exist inside the network state
            if(network && network.state.data.summary) {
                return; // just end the execution loop
            }

            return codingAgent

        }

    })

}

export { createCodingAgent, createCodingNetwork };
