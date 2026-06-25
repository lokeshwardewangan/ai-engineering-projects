import { chromaClient } from "../config/client.js";
import { WEB_COLLECTION } from "../config/constants.js";

export async function getCollectionInstance() {
  return await chromaClient.getOrCreateCollection({
    name: WEB_COLLECTION,
  });
}

export async function insertIntoDb({ id, embedding, url, body }) {
  const collection = await getCollectionInstance();

  const payload = {
    ids: [id],
    metadatas: [
      { url: url, type: "body_chunk", extracted_at: new Date().toISOString() },
    ],
  };

  // If you pass an embedding array (OpenAI), use it. Otherwise, let Chroma handle it.
  if (embedding) {
    payload.embeddings = [embedding];
  }

  if (body) {
    payload.documents = [body];
  }

  await collection.add(payload);
}

export async function queryCollection(question, questionEmbedding, limit = 3){

  const collection = await getCollectionInstance();

  const queryParams = { nResults: limit };
  if(questionEmbedding){
    queryParams.queryEmbeddings = [questionEmbedding]
  }else{
    queryParams.queryTexts = [question]
  }

  return await collection.query(queryParams);

}

/**
 * Utility functions to debug or clear your database status
 */

export async function getAboutCollections() {
  const collection = await getCollectionInstance();
  
  return await collection.get({
    // Explicitly add 'embeddings' to the array to make them appear
    include: ["documents", "metadatas", "embeddings"],
    limit: 100 
  });
}

export async function deleteCollection() {
  await chromaClient.deleteCollection({
    name: WEB_COLLECTION,
  });
}
