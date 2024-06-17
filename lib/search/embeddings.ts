import Replicate from "replicate";

interface EmbeddingOutput {
  vectors: number[];
}

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_KEY || "",
});

export async function getEmbedding(text: string): Promise<number[]> {
  const output = (await replicate.run(
    "brummbq/gbert-large-paraphrase-cosine:e514bc51be488261aaae87e55e2089631d77c6331dc11b1ad8e0c67c5d710735",
    {
      input: { text },
    },
  )) as EmbeddingOutput;

  return output.vectors;
}
