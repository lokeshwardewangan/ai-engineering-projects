import { chromaClient } from "./src/config/client.js";
import { WEB_COLLECTION } from "./src/config/constants.js";
import {
  generateCompletionContent,
  generateVectorEmbeddings,
} from "./src/services/llm.js";
import { scrapWebpage } from "./src/services/scrapper.js";
import { insertIntoDb, queryCollection } from "./src/services/vectorDb.js";
import { chunkText } from "./src/utils/chunker.js";

export async function ingest(url = "") {
  console.log(`✨ Ingesting ${url}`);
  const { body, externalLinks, internalLinks } = await scrapWebpage(url);

  const bodyChunks = chunkText(body, 1000);

  for (const [index, chunk] of bodyChunks.entries()) {
    const bodyEmbedding = await generateVectorEmbeddings({ text: chunk });
    await insertIntoDb({
      id: `${url}-chunk-${index}`,
      embedding: bodyEmbedding,
      url,
      body: chunk,
    });
  }

  console.log(`✨ Ingested successfully for ${url}`);
}

export async function chatWithAI(question = "") {
  const questionEmbedding = await generateVectorEmbeddings({ text: question });

  const limit = 3;
  const collectionResult = await queryCollection(question, questionEmbedding, limit);

  const bodyDocument = collectionResult.documents[0];
  const urls = collectionResult.metadatas[0].map((e)=> e.url);

  const responseContent = await generateCompletionContent(question, urls, bodyDocument);

  console.log(`🤖: ${responseContent}`);
}
