import "dotenv/config";
import { openAiClient, genAiClient } from "./src/config/client.js";

// need global message state to know context

// system prompt for both

// foir for aks normal quesiton hiii

const DEBATE_TOPIC = "Is coffee better than tea?";

const geminiSystemPrompt = `
    You are calm peacefull, Intelligence AI assistant competing with OpenAI LLM model.
    You have to prove yourself the best and maintain calmness, peacefully and always be pollite
    and think before your answer.
    I want you to win debate and i want that you can prove yourself be the best.

    The Debate Topic is : ${DEBATE_TOPIC}
`;

const openAiSystemPrompt = `
    You are very aggresive ai assistant competing with gemini-2.5-flash-lite model.
    You have to prove yourself the best because you are.
    You are very aggresive and egostic in nature. You always try to prove 
    yourself the best and your response tone is angry. Always try to prove
    why you are always right.

    The Debate Topic is : ${DEBATE_TOPIC}
`;

async function callOpenAi(conversations) {
  const response = await openAiClient.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: openAiSystemPrompt,
      },
      ...conversations,
    ],
  });

  return response.choices[0].message.content;
}

async function callGeminiAi(conversations) {
  const response = await genAiClient.models.generateContent({
    model: "gemini-2.5-flash-lite",

    config: {
      systemInstruction: geminiSystemPrompt,
    },

    contents: conversations.map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    })),
  });

  return response.text;
}

let MAX_ITERATION = 10;
let CURRENT = 0;
let turn = "O";

const conversations = [
  {
    role: "user",
    content: `Start the debate on "${DEBATE_TOPIC}". Give your opening argument.`,
  },
];


while (CURRENT < MAX_ITERATION) {
  if (turn === "O") {
    const responseContent = await callOpenAi(conversations);
    conversations.push({
      role: "assistant",
      content: responseContent,
    });
    turn = "G";
  } else if (turn === "G") {
    const responseContent = await callGeminiAi(conversations);
    conversations.push({
      role: "user",
      content: responseContent,
    });
    turn = "O";
  }
  CURRENT++;
}
