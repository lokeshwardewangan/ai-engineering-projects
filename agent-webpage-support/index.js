import "dotenv/config.js";
import { chromaClient } from "./src/config/client.js";
import { chatWithAI, ingest } from "./pipeline.js";
import {
  deleteCollection,
  getAboutCollections,
} from "./src/services/vectorDb.js";
import readlineSync from "readline-sync";

const heartbeat = await chromaClient.heartbeat();
console.log(heartbeat);

// await deleteCollection();
// console.log(await getAboutCollections());

// await ingest("https://www.lokeshwardewangan.in/");
// await ingest("https://www.lokeshwardewangan.in/about");
// await ingest("https://www.lokeshwardewangan.in/projects");


async function startConversation() {
  console.log("\n🌐 Enter Your Website URL: ");
  const websiteURL = readlineSync.question(">> ");
  
  console.log(`\n⏳ Ingesting and indexing ${websiteURL}... Please wait.`);
  await ingest(websiteURL);
  console.log("✅ Ingestion complete! Website data is ready.\n");

  while (true) {
    console.log("💬 Ask me anything about your website (or press Ctrl+C to exit):");
    const question = readlineSync.question(">> ");
    
    console.log("\n🤖 Thinking...");
    await chatWithAI(question);
    console.log("\n" + "─".repeat(50) + "\n"); // Adds a clean visual separator between turns
  }
}

startConversation();

