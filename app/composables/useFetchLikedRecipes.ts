import type { LikedRecipesResponse } from "~/lib/models";

export default async function () {
  const { data, error } =
    await useFetch<LikedRecipesResponse>("/api/recipes/liked");

  if (error.value?.statusCode === 401) {
    navigateToLogin();
  }

  return data;
}
