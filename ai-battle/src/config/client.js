import { OpenAI } from "openai";
import { GoogleGenAI } from "@google/genai";

export const openAiClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const genAiClient = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});
