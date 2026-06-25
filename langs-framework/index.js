import "dotenv/config";
import { callAgentForGetWeather } from "./src/basicLangChain.js";

import { createAgent, tool } from "langchain";
import { MemorySaver } from "@langchain/langgraph";
import z from "zod";

// 1. Define Agent & Tools
const agent = createAgent({
  model: "openai:gpt-4o",
  tools: [
    tool(async ({ city }) => `Sunny in ${city}!`, {
      name: "get_weather",
      description: "Get weather",
      schema: z.object({ city: z.string() }),
    })
  ],
  checkpointer: new MemorySaver(),
});

// 2. Stream Events Cleanly
const eventStream = await agent.streamEvents(
  { messages: [{ role: "user", content: "weather in sf" }] },
  { version: "v2", configurable: { thread_id: "1" } }
);

// 3. Simple loop to catch chunks as they arrive
for await (const event of eventStream) {
  // Catch Text Tokens
  if (event.event === "on_chat_model_stream") {
    const token = event.data.chunk.content;
    if (token) process.stdout.write(token);
  }
  // Catch Tool Execution Status (Optional UI update)
  else if (event.event === "on_tool_start") {
    console.log(`\n[Running Tool: ${event.name}...]`);
  }
}

 