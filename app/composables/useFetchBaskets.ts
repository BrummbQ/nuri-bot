import type { GetBasketsResponse } from "~/lib/models";

export default async function () {
  const { data, error } = await useFetch<GetBasketsResponse>("/api/baskets");

  if (error.value?.statusCode === 401) {
    navigateToLogin();
  }

  return data;
}
