

import readlineSync from "readline-sync";
import { questionAiAgnet } from "./agents/index.js";
import "dotenv/config";


console.log("🤖 Todo AI Assistant | Type 'exit' to quit.\n");

while (true) {
    const question = readlineSync.question(">> ");
    
    if (question.toLowerCase().trim() === 'exit') {
        console.log("Goodbye! 👋");
        break;
    }
    
    if (!question.trim()) continue;

    await questionAiAgnet(question);
    console.log("\n" + "─".repeat(40) + "\n"); // Clean divider line
}