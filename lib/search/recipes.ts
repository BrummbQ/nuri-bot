import {
  Pinecone,
  type ScoredPineconeRecord,
} from "@pinecone-database/pinecone";
import { getEmbedding } from "./embeddings";

export type RecipeSchema = {
  "@id": string;
  description: string;
  image: string[];
  keywords: string;
  name: string;
  recipeCategory: string;
  recipeIngredient: string[];
  recipeInstructions: { name: string; text: string; url: string }[];
  recipeYield: number;
  totalTime?: string;
  prepTime?: string;
  cookTime?: string;
};

export type Metadata = {
  recipeSchema: string;
};

// The function `searchRecipes` is used to retrieve matches for the given embeddings
const searchRecipes = async (
  query: string,
): Promise<ScoredPineconeRecord<Metadata>[]> => {
  const embedding = await getEmbedding(query);
  return searchRecipesByEmbedding(embedding);
};

const searchRecipesByEmbedding = async (
  embedding: number[],
  topK: number = 3,
  namespace: string = "",
): Promise<ScoredPineconeRecord<Metadata>[]> => {
  // Obtain a client for Pinecone
  const pinecone = new Pinecone();

  const indexName = "recipes-index";

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

export { searchRecipes };
