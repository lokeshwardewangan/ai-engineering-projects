import "dotenv/config";
import { Agent, tool, run } from "@openai/agents";
import * as z from "zod";
import readlineSync from "readline-sync";
import axios from "axios";

const weatherCityWithTemp = {
  raipur: "20°C",
  mumbai: "10°C",
  jaipur: "25°C",
  hyderabada: "18°C",
};

async function getWeather(city) {
  //   const result = weatherCityWithTemp[city.toLowerCase()];
  //   return `Weather for ${city} is : ${result}`;

  const result = await axios.get(
    `https://wttr.in/${city.toLowerCase()}?format=%C+%t`,
  );
  return result.data;
}

const getWeatherTool = tool({
  name: "get_weather",
  description:
    "call this function to get weather temperature in celcius, by giving city as input",
  parameters: z.object({
    city: z.string().describe("City name"),
  }),
  async execute({ city }) {
    console.log(`🤖: calling weather for ${city} ...`);
    return getWeather(city);
  },
});

const agent = new Agent({
  name: "weatherAgent",
  instructions: `You are weather assistant you have to return weather report of given city`,
  tools: [getWeatherTool],
});

async function askLLM(question) {
  const result = await run(agent, question);
  console.log(`🤖: ${result.finalOutput}`);
}

while (true) {
  const question = readlineSync.question(">> ");
  await askLLM(question);
}
