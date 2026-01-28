import { McpServer } from "@modelcontextprotocol/server";
import { StdioServerTransport } from "@modelcontextprotocol/server/stdio";
import { z } from "zod";

const server = new McpServer({
  name: "Weather Date Fetcher",
  version: "1.0.0",
});

async function getWeatherData(city) {
  city = city.toLowerCase();
  if (city === "raipur")
    return { temp: "15℃", forecast: "chance of high rain " };
  else if (city === "durg")
    return { temp: "12℃", forecast: "chance of high cloud" };
  else if (city === "delhi")
    return { temp: "9℃", forecast: "chance of high tsunami" };
  else return { temp: null, error: "City not found" };
}

server.registerTool(
  "weather-data-server",
  {
    description: "Get weather data by city name",
    inputSchema: z.object({ city: z.string() }),
  },
  async ({ city }) => ({
    content: [
      { type: "text", text: JSON.stringify(await getWeatherData(city)) },
    ],
  }),
);

async function init() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

init();
