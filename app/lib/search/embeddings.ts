import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";
import type { ProductRow } from "../models";
import { paginateProduct, updateEmbeddings } from "../db";

export async function getEmbedding(text: string): Promise<number[]> {
  const client = new BedrockRuntimeClient({ region: "us-east-1" });
  const modelId = "amazon.titan-embed-text-v2:0";

  // Prepare the payload for the model.
  const payload = {
    inputText: text,
    dimensions: 1024,
    normalize: true,
  };

  // Invoke the model with the payload and wait for the response.
  const command = new InvokeModelCommand({
    contentType: "application/json",
    body: JSON.stringify(payload),
    modelId,
  });
  const apiResponse = await client.send(command);

  // Decode and return the response.
  const decodedResponseBody = new TextDecoder().decode(apiResponse.body);
  const responseBody = JSON.parse(decodedResponseBody);
  return responseBody.embedding;
}

export async function loadEmbeddings(marketId: string, page = 1) {
  const pageSize = 100; // Number of records per page
  const offset = (page - 1) * pageSize;
  const result = await paginateProduct(marketId, pageSize, offset);
  const productNameEmbeddings = await Promise.all(
    result.rows.map(async (r) => {
      const nameEmbedding = await getEmbedding(r.product_name);
      return { ...r, product_name_embedding: nameEmbedding };
    }),
  );

  await updateEmbeddings(productNameEmbeddings as ProductRow[]);

  console.log(`Loaded ${result.rowCount} embeddings`);
  if (result.rowCount && result.rowCount > 0) {
    await loadEmbeddings(marketId, page + 1);
  }
}
