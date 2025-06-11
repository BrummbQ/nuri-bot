import type { MenuRecipesResponse } from "~/lib/models";

export default async function () {
  const nuxtApp = useNuxtApp();
  const route = useRoute();
  const { data, error } =
    await useFetch<MenuRecipesResponse>("/api/menu/recipes");

  await nuxtApp.runWithContext(async () => {
    if (error.value?.statusCode === 401) {
      await navigateToLogin(route.fullPath);
    }
  });

  return data;
}
