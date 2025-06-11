import { getUserIdFromClientOrServer } from "~/lib/auth/getUserIdFromClientOrServet";
import type { GetBasketResponse } from "~/lib/models";

export default async function (shareToken: string) {
  const nuxtApp = useNuxtApp();
  const route = useRoute();
  const { data, error } = await useFetch<GetBasketResponse>(
    `/api/baskets/shared/${shareToken}`,
  );

  await nuxtApp.runWithContext(async () => {
    if (error.value?.statusCode === 401) {
      await navigateToLogin(route.fullPath);
    }

    if (error.value?.statusCode === 403) {
      const userId = getUserIdFromClientOrServer();
      await navigateTo(`/user/${userId}/basket`);
    }
  });

  return { data, error };
}
