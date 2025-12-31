import {
  createAgent,
  createNetwork,
  createState,
  Message,
  openai,
  State,
} from "@inngest/agent-kit";
import {
  createOrUpdateFiles,
  readFilesFromSandbox,
  terminalTool,
} from "./tools";
import { AGENT_SYSTEM_PROMPT, FRAGMENT_TITLE_PROMPT, RESPONSE_PROMPT } from "./prompt";
import { getLastAssistantMessage } from "./utils";

// create a coding model
const codingModel = openai({
  model: "gpt-4.1",
  defaultParameters: {
    temperature: 0.1,
  },
});

// create a text model
const textModel = openai({
  model: "gpt-4o",
});

// create a coding agent
const createCodingAgent = (sandboxId: string) => {
  return createAgent({
    model: codingModel,
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

// create fragment title generator agent
const createFragmentTitleGeneratorAgent = () => {
  return createAgent({
    model: textModel,
    name: "Fragment Title Generator Agent",
    system: FRAGMENT_TITLE_PROMPT,
    description:
      "An expert agent that excels in writing quality fragment titles.",
  });
};


// create response generator agent
const createResponseGeneratorAgent = () => {
  return createAgent({
    model: textModel,
    name: "Response Generator Agent",
    system: RESPONSE_PROMPT,
    description:
      "An expert agent that excels in writing quality response summaries.",
  });
};

// create a network along with a router
const createCodingNetwork = (
  sandboxId: string,
  state: State<{
    summary: string;
    files: {};
  }>
) => {
  const codingAgent = createCodingAgent(sandboxId); // create a coding agent

  return createNetwork({
    name: "Coding Network",
    description: "A networking containing the coding agent",
    maxIter: 10,
    defaultState: state,
    agents: [codingAgent],

    router: async ({ network }) => {
      // summary exist inside the network state
      if (network && network.state.data.summary) {
        return; // just end the execution loop
      }

      return codingAgent;
    },
  });
};

export {
  createCodingAgent,
  createFragmentTitleGeneratorAgent,
  createResponseGeneratorAgent,
  createCodingNetwork,
};
