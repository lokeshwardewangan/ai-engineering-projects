import "dotenv/config";
import { HumanMessage } from "@langchain/core/messages";
import { agent, config } from "./src/graph.js";
import readlineSync from "readline-sync";

async function questionAiAgnet(question) {
  const result = await agent.invoke(
    {
      messages: [new HumanMessage(question)],
    },
    config,
  );

  for (const message of result.messages) {
    console.log(`[${message.type}]: [${message.text}]`);
  }
}

console.log("🤖 Arithmatic Math AI Assistant | Type 'exit' to quit.\n");

while (true) {
  const question = readlineSync.question(">> ");

  if (question.toLowerCase().trim() === "exit") {
    console.log("Goodbye! 👋");
    break;
  }

  if (!question.trim()) continue;

  await questionAiAgnet(question);
  console.log("\n" + "─".repeat(40) + "\n"); // Clean divider line
}
