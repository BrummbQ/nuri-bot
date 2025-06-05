import { getUserIdFromClientOrServer } from "~/lib/auth/getUserIdFromClientOrServet";
import type { GetBasketResponse } from "~/lib/models";

export default async function (shareToken: string) {
  const nuxtApp = useNuxtApp();
  const { data, error } = await useFetch<GetBasketResponse>(
    `/api/baskets/shared/${shareToken}`,
  );

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
