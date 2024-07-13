import type { SearchGenerateTermResponse } from "~/lib/models";

export default async function () {
  const { data, error } = await useFetch<SearchGenerateTermResponse>(
    "/api/search/generate-term",
  );

  if (error.value?.statusCode === 401) {
    navigateToLogin();
  }

  return { data, error };
}
