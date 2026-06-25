import "dotenv/config";
import { tool, createAgent } from "langchain";
import * as z from "zod";
import { setDebug } from "@langchain/core/utils/debug";

// Turn on global debugging
setDebug(true);

function getWeatherDetails(city = "") {
  if (city.toLowerCase() === "delhi") return "10°C";
  if (city.toLowerCase() === "raipur") return "23°C";
  if (city.toLowerCase() === "patiala") return "15°C";
  if (city.toLowerCase() === "bhilai") return "28°C";
  if (city.toLowerCase() === "durg") return "21°C";

  return "Data not available";
}

const getWeatherTool = tool((input) => getWeatherDetails(input.city), {
  name: "get_weather",
  description: "Returns the current weather for a given city",
  schema: z.object({
    city: z.string().describe("the city to get weather for"),
  }),
});

const agent = createAgent({
  model: "gpt-4o",
  tools: [getWeatherTool],
});

// Without stream jsut call agent

const response = await agent.invoke({
  messages: [{ role: "user", content: "What is weather for mumbai" }],
});

console.log(`🤖: ${response.messages[response.messages.length - 1].content}`);


// With stream jsut call agent
/* 
const eventStream = await agent.streamEvents(
  {
    messages: [{ role: "user", content: "What is weather for mumbai" }],
  },
  { version: "v2" },
);

for await (const event of eventStream) {
  if (event.event === "on_chat_model_start") {
    console.log("\n🤖: [AI is analyzing history and planning next step..]");
  }
  if (event.event == "on_chat_model_stream") {
    const token = event.data.chunk.content;
    if (token) process.stdout.write(token);
  }

  if (event.event === "on_tool_start") {
    console.log(
      `\n⚙️ [Executing Tool] : ${event.name} with input:`,
      event.data.input,
    );
  }

  if (event.event === "on_tool_end") {
    console.log(`🔌 [Tool Result Received]: `, event.data.output);
  }
}

*/