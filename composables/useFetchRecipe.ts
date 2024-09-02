import type { RecipeSchema } from "~/lib/models";

export default async function (id: string) {
  const { data, error } = await useFetch<RecipeSchema>("/api/recipes/" + id);
  if (error.value) {
    throw createError({
      status: error.value.statusCode,
      statusMessage: error.value.statusMessage,
    });
  }

  return { data, error };
}
