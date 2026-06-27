import { AIMessage } from "@langchain/core/messages"
import { toolsByName } from "../tools/mathTools.js";

export const toolNode = async (state) => {
  // get last message check tool called and their names
  // loop all tools land execute and store in array result
  const lastMessages = state.messages.at(-1);
  if (lastMessages === null || !AIMessage.isInstance(lastMessages)) {
    return { messages: [] };
  }

  const result = [];

  for (const toolCall of lastMessages.tool_calls ?? []) {
    const tool = toolsByName[toolCall.name];
    const observation = await tool.invoke(toolCall);
    result.push(observation);
  }

  return { messages: result };
};
