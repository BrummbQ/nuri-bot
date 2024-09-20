import type { MenuRecipesResponse } from "~/lib/models";

export default async function () {
  const { data, error } =
    await useFetch<MenuRecipesResponse>("/api/menu/recipes");

  if (error.value?.statusCode === 401) {
    navigateToLogin();
  }

  return data;
}
