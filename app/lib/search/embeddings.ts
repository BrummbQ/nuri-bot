import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";

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
