import { END, START, StateGraph, MemorySaver } from "@langchain/langgraph";
import { MessagesState } from "./state.js";
import { llmCall } from "./nodes/llmCall.js";
import { toolNode } from "./nodes/ToolNode.js";
import { shouldContinue } from "./edges.js";

export const agent = new StateGraph(MessagesState)
  .addNode("llmCall", llmCall)
  .addNode("toolNode", toolNode)
  .addEdge(START, "llmCall")
  .addConditionalEdges("llmCall", shouldContinue, ["toolNode", END])
  .addEdge("toolNode", "llmCall")
  .compile({ checkpointer: new MemorySaver() });

export const config = { configurable: { thread_id: "user-session-123" } };
