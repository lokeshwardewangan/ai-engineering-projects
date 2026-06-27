import { SystemMessage } from "@langchain/core/messages";
import { modelWithTool } from "../config/model.js";

export const llmCall = async (state) => {
  const response = await modelWithTool.invoke([
   new SystemMessage(
      "You are a strict math assistant. You are ONLY allowed to answer questions " +
      "using your provided tools (add, subtract, multiply, divide). If a user asks a question " +
      "that cannot be solved by these tools (like general knowledge, history, or politics), " +
      "you must politely refuse to answer."
    ),
    ...state.messages,
  ]);

  return {
    messages: [response],
    llmCalls: 1,
  };
};

