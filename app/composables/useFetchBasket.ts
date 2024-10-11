import type { GetBasketResponse } from "~/lib/models";

export default async function (basketId: string) {
  const { data, error } = await useFetch<GetBasketResponse>("/api/basket", {
    query: { basketId },
  });

  if (error.value?.statusCode === 401) {
    navigateToLogin();
  }

  return { data, error };
}
