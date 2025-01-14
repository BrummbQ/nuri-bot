import { getUserIdFromClientOrServer } from "~/lib/auth/getUserIdFromClientOrServet";
import type { GetBasketResponse } from "~/lib/models";

export default async function (basketId: string) {
  const nuxtApp = useNuxtApp();
  const { data, error } = await useFetch<GetBasketResponse>("/api/basket", {
    query: { basketId },
  });

  if (error.value?.statusCode === 401) {
    navigateToLogin();
  }

  if (error.value?.statusCode === 403) {
    await nuxtApp.runWithContext(() => {
      const userId = getUserIdFromClientOrServer();
      navigateTo(`/user/${userId}/basket`);
    });
  }

  return { data, error };
}
