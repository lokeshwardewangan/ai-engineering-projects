import "dotenv/config";
import { createAgent, tool } from "langchain";
import * as z from "zod";

const getWeather = tool((input) => `It's always sunny in ${input.city}`, {
  name: "get_weather",
  description: "Get the weather for given city",
  schema: z.object({
    city: z.string().describe("The city to get the weather for"),
  }),
});

const agent = createAgent({
  model: "gpt-4o",
  tools: [getWeather],
});

export async function callAgentForGetWeather(question) {
  const response = await agent.invoke({
    messages: [{ role: "user", content: question }],
  });
  console.log(`🤖: ${response.messages[3].content}`);
}
