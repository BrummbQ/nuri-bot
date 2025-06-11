import type { LikedRecipesResponse } from "~/lib/models";

export default async function () {
  const nuxtApp = useNuxtApp();
  const route = useRoute();
  const { data, error } =
    await useFetch<LikedRecipesResponse>("/api/recipes/liked");

  await nuxtApp.runWithContext(async () => {
    if (error.value?.statusCode === 401) {
      await navigateToLogin(route.fullPath);
    }
  });

  return data;
}
