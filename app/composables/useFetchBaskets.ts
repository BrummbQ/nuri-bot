import type { GetBasketsResponse } from "~/lib/models";

export default async function () {
  const nuxtApp = useNuxtApp();
  const route = useRoute();
  const { data, error } = await useFetch<GetBasketsResponse>("/api/baskets");

  await nuxtApp.runWithContext(async () => {
    if (error.value?.statusCode === 401) {
      await navigateToLogin(route.fullPath);
    }
  });

  return data;
}
