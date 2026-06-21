// LLM only understands user intent and context, it doesn't execute any real actions
// All actions are handled through external tools (functions/APIs) we define
// An AI agent is basically LLM + tools + memory working together
// The model decides which tool to use by interpreting the user’s intent

import OpenAI from "openai";
import readlineSync from "readline-sync";
import dotenv from "dotenv";
dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const client = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

function getWeatherDetails(city = "") {
  if (city.toLowerCase() === "raipur") return "32°C";
  if (city.toLowerCase() === "mumbai") return "28°C";
  if (city.toLowerCase() === "bangalore") return "22°C";
  if (city.toLowerCase() === "bhilai") return "31°C";
  if (city.toLowerCase() === "delhi") return "12°C";

  return "Weather data not available";
}

const tools = {
  getWeatherDetails: getWeatherDetails,
};

const SYSTEM_PROMPT = `
You are an AI Assistant with START, PLAN, ACTION, Observation and Output State.
Wait for the user prompt and first PLAN using avaible tools.
After Planning, Take the action with appropriate tools and wait for Observation based on Action.
Once you get the observations, Return the AI response based on START prompt and observation

Strictly follow the JSON output as an example

Available Tools: 
- function getWeatherDetails(city:string):string
getWeatherDetails is function that accepts city name as string and returns the wather details

Example: 
START
{"type": "user", "user": "What is the sum of weather of raipur and delhi?"}
{"type": "plan", "plan": "I will call the getWeatherDetails for raipur"}
{"type": "action", "function": "getWeatherDetails", "input": "raipur"}
{"type": "observation", "observation": "10°C"}
{"type": "plan", "plan": "I will call the getWeatherDetails for delhi"}
{"type": "action", "function": "getWeatherDetails", "input": "delhi"}
{"type": "observation", "observation": "14°C"}
{"type": "output", "output": "The sum of weather of raipur and delhi is 24°C"}
`;

const messages = [{ role: "system", content: SYSTEM_PROMPT }];

while (true) {
  const query = readlineSync.question(">> ");
  const q = {
    type: "user",
    user: query,
  };
  messages.push({ role: "user", content: JSON.stringify(q) });

  while (true) {
    const chat = await client.chat.completions.create({
      model: "gpt-4o",
      messages: messages,
      // response_format: { type: "json_object" },
    });

    const result = chat.choices[0].message.content;
    messages.push({ role: "assistant", content: result });

    console.log("\n\n ---------- START AI ---------- ");
    console.log(result);
    console.log("---------- START AI ---------- \n\n");

    const call = JSON.parse(result);

    if (call.type === "output") {
      console.log(`🤖: ${call.output}`);
      break;
    } else if (call.type === "action") {
      const fn = tools[call.function];
      const observation = fn(call.input);
      const obs = { type: "observation", observation: observation };
      messages.push({ role: "developer", content: JSON.stringify(obs) });
    }
  }
}
