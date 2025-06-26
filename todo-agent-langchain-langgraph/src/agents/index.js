import { createAgent } from "langchain";
import {
  deleteTodo,
  getAllTodos,
  insertTodo,
  searchTodo,
  updateTodo,
} from "./tools.js";
import { TODO_SYSTEM_PROMPT } from "./prompts.js";

const tools = [getAllTodos, insertTodo, deleteTodo, searchTodo, updateTodo];

const agent = createAgent({
  model: "gpt-4o",
  tools: tools,
  systemPrompt: TODO_SYSTEM_PROMPT,
});

export async function questionAiAgnet(question) {
  const streamEvents = await agent.streamEvents({
    messages: [{ role: "human", content: question }],
  });

  for await (const event of streamEvents) {
    if (event.event === "on_chat_model_start") {
      console.log(`🤖: [AI is analyzing history and planning next step...]`);
    }

    if (event.event === "on_chat_model_stream") {
      const token = event.data.chunk.content;
      if (token) process.stdout.write(token);
    }

    if (event.event === "on_tool_start") {
      console.log(
        `⚙️: [Executing Tool] : ${event.name} with input : ${JSON.stringify(event.data.input, null, 2)}`,
      );
    }

    if (event.event === "on_tool_end") {
      console.log(`🔌 [Tool Result Received]: `, event.data.output);
    }
  }
}
