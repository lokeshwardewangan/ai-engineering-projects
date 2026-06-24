import axios from "axios";
import "dotenv/config";
import * as cheerio from "cheerio";
import OpenAI from "openai";
import { ChromaClient } from "chromadb";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const chromaClient = new ChromaClient({
  host: "localhost",
  port: 8000,
  ssl: false,
});
const heartbeat = await chromaClient.heartbeat();
console.log(heartbeat);

const WEB_COLLECTION = `WEB_SCRAPED_DATA_COLLECTIOIN-1`;

async function scrapWebpage(url = "") {
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);

  const pageHead = $("head").html();
  const pageBody = $("body").html();

  const internalLinks = new Set();
  const externalLinks = new Set();

  $("a").each((_, el) => {
    const link = $(el).attr("href");
    if (link === "/") return;
    if (link.startsWith("http") || link.startsWith("https")) {
      externalLinks.add(link);
    } else if (link.startsWith("/") && !link.includes("#")) {
      internalLinks.add(link);
    }
    // console.log(link);
  });

  return {
    head: pageHead,
    body: pageBody,
    internalLinks: [...internalLinks],
    externalLinks: [...externalLinks],
  };

  // console.log(pageHead, pageBody);
}

async function generateVectorEmbeddings({ text }) {
  const embedding = await client.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
    encoding_format: "float",
  });
  return embedding.data[0].embedding;
}

async function insertIntoDb({ id, embedding, url, body = "", head }) {
  const collection = await chromaClient.getOrCreateCollection({
    name: WEB_COLLECTION,
  });

  await collection.add({
    ids: [id],
    embeddings: [embedding],
    metadatas: [{ url, head, body }],
  });
}

async function ingest(url = "") {
  console.log(`✨ Ingesting ${url}`);
  const { head, body, internalLinks } = await scrapWebpage(url);
  const headEmbedding = await generateVectorEmbeddings({ text: head });
  await insertIntoDb({
    id: `${url}-head`,
    embedding: headEmbedding,
    url,
    head,
  });
  const bodyChunks = chunkText(body, 1000);
  console.log("body chunk", bodyChunks.length);

  for (const [index, chunk] of bodyChunks.entries()) {
    console.log("chunks", chunk.slice(0, 100));
    const bodyEmbedding = await generateVectorEmbeddings({ text: chunk });
    await insertIntoDb({
      id: `${url}-chunk-${index}`,
      embedding: bodyEmbedding,
      url,
      head,
      body: chunk,
    });
  }

  console.log(`✨ Ingested for ${url}`);
  //   for (const link of internalLinks) {
  //     const _url = `${url}${link}`;
  //     console.log(_url);
  //     await ingest(_url);
  //   }
  console.log(`✨ Ingested successfully `);
}

async function chat(question = "") {
  const questionEmbedding = await generateVectorEmbeddings({ text: question });
  const collection = await chromaClient.getOrCreateCollection({
    name: WEB_COLLECTION,
  });

  const collectionResult = await collection.query({
    nResults: 3,
    queryEmbeddings: [questionEmbedding],
  });

  const body = collectionResult.metadatas[0]
    .map((e) => e.body)
    .filter((e) => e.trim() !== "" && !!e);
  const head = collectionResult.metadatas[0]
    .map((e) => e.head)
    .filter((e) => e.trim() !== "" && !!e);
  const url = collectionResult.metadatas[0]
    .map((e) => e.url)
    .filter((e) => e.trim() !== "" && !!e);

  //   console.log(head);
  console.log(body);
  //   console.log(url);

  console.log("Retriving ...");

  const response = await client.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content:
          "Your are an AI support agent expert in providing support to user on behalf of a webpage. Given the context about page content, reply the user on accordingly.",
      },
      {
        role: "user",
        content: `
            Query: ${question}\n\n
            URL: ${url.join(", ")}
            Retrived Context : ${body.join(", ")}
            `,
      },
    ],
  });

 const letters = `Query: ${question}\n\n
            URL: ${url.join(", ")}
            Retrived Context : ${body.join(", ")}
            `;
      
            console.log("length : " , letters.length)
//   console.log(`🤖: ${response.choices[0].message.content}`);
}

// chat("who is lokeshwar prasad dewangan?");
chat("what is budgetter ?");

function chunkText(text, chunkSize) {
  if (!text || chunkSize <= 0) return [];

  const words = text.split(/\s+/);
  const chunks = [];

  for (let i = 0; i < words.length; i += chunkSize) {
    chunks.push(words.slice(i, i + chunkSize).join(" "));
  }

  return chunks;
}

async function getAboutCollections() {
  const collection = await chromaClient.getCollection({
    name: WEB_COLLECTION,
  });

  console.log(await collection.get());
}

async function deleteCollection() {
  const collections = await chromaClient.deleteCollection({
    name: WEB_COLLECTION,
  });
}

// deleteCollection();
// getAboutCollections();

// await getAboutCollections();

// await ingest("https://www.lokeshwardewangan.in/");
// await ingest("https://www.lokeshwardewangan.in/about");
// await ingest("https://www.lokeshwardewangan.in/projects");
