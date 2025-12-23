import { AgentResult, TextMessage } from "@inngest/agent-kit";

// get the last ai message
const getLastAssistantMessage = (result: AgentResult) => {
  const lastAssistantMessageId = result.output.findLastIndex(
    (message) => message.role === "assistant"
  );

  const lastAssistantMessageText = result.output[lastAssistantMessageId] as
    | TextMessage
    | undefined;

  return lastAssistantMessageText?.content
    ? typeof lastAssistantMessageText.content === "string"
      ? lastAssistantMessageText.content
      : lastAssistantMessageText.content.map((m) => m.text).join("")
    : undefined;
};


export {getLastAssistantMessage}