import { client } from "../config/client.js";

export async function generateVectorEmbeddings({ text }) {
  const embedding = await client.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
    encoding_format: "float",
  });
  return embedding.data[0].embedding;
}

export async function generateCompletionContent(question, urls, bodyContents) {
  const response = await client.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content:
          "Your are an AI support agent expert in providing support to user on behalf of a webpage. Given the context about page content, reply the user on accordingly.",
          //  the answer in less than 50 words.
      },
      {
        role: "user",
        content: `
            Query: ${question}\n\n
            URL: ${urls.join(", ")}
            Retrived Context : ${bodyContents.join(", ")}
            `,
      },
    ],
  });

  return response.choices[0].message.content;
}
