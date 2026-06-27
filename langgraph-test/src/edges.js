import { AIMessage } from "@langchain/core/messages";
import { END } from "@langchain/langgraph";

export const shouldContinue = async (state) => {
  const lastMessages = state.messages.at(-1);
  if (!lastMessages || !AIMessage.isInstance(lastMessages)) {
    return END;
  }

  if (lastMessages.tool_calls?.length) {
    return "toolNode";
  }

  return END;
};
