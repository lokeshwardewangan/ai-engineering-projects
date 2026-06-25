import OpenAI from "openai";
import { ChromaClient } from "chromadb";

export const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const chromaClient = new ChromaClient({
  host: "localhost",
  port: 8000,
  ssl: false,
});


