import {
  Pinecone,
  type ScoredPineconeRecord,
} from "@pinecone-database/pinecone";
import { getEmbedding } from "./embeddings";
import type { RecipeSchema } from "../models";

export type Metadata = {
  recipeSchema: string;
};

// The function `searchRecipes` is used to retrieve matches for the given embeddings
export const searchRecipes = async (
  query: string,
): Promise<ScoredPineconeRecord<Metadata>[]> => {
  const embedding = await getEmbedding(query);
  return searchRecipesByEmbedding(embedding);
};

const searchRecipesByEmbedding = async (
  embedding: number[],
  topK: number = 6,
  namespace: string = "",
): Promise<ScoredPineconeRecord<Metadata>[]> => {
  // Obtain a client for Pinecone
  const pinecone = new Pinecone();

  const indexName = "recipes-index-aws";

  // Retrieve the list of indexes to check if expected index exists
  const indexes = (await pinecone.listIndexes())?.indexes;
  if (!indexes || indexes.filter((i) => i.name === indexName).length !== 1) {
    throw new Error(`Index ${indexName} does not exist`);
  }

  // Get the Pinecone index
  const index = pinecone!.Index<Metadata>(indexName);

  // Get the namespace
  const pineconeNamespace = index.namespace(namespace ?? "");

  try {
    // Query the index with the defined request
    const queryResult = await pineconeNamespace.query({
      vector: embedding,
      topK,
      includeMetadata: true,
    });
    return queryResult.matches || [];
  } catch (e) {
    // Log the error and throw it
    console.log("Error querying embeddings: ", e);
    throw new Error(`Error querying embeddings: ${e}`);
  }
};

export const getPineconeRecipeById = async (
  id: string,
  namespace: string = "",
): Promise<RecipeSchema | undefined> => {
  // Obtain a client for Pinecone
  const pinecone = new Pinecone();

  const indexName = "recipes-index-aws";

  // Retrieve the list of indexes to check if expected index exists
  const indexes = (await pinecone.listIndexes())?.indexes;
  if (!indexes || indexes.filter((i) => i.name === indexName).length !== 1) {
    throw new Error(`Index ${indexName} does not exist`);
  }

  // Get the Pinecone index
  const index = pinecone!.Index<Metadata>(indexName);

  // Get the namespace
  const pineconeNamespace = index.namespace(namespace ?? "");

  try {
    // Query the index with the defined request
    const queryResult = await pineconeNamespace.fetch([id]);
    const recipeSchema = queryResult.records[id]?.metadata?.recipeSchema;
    if (recipeSchema != null) {
      return JSON.parse(recipeSchema);
    }
    return recipeSchema;
  } catch (e) {
    // Log the error and throw it
    console.log("Error fetching records: ", e);
    throw new Error(`Error fetching records: ${e}`);
  }
};
