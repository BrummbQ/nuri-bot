import type { ScheduleRecipesResponse } from "~/lib/models";

export default async function () {
  const { data, error } = await useFetch<ScheduleRecipesResponse>(
    "/api/schedule/recipes",
  );

  if (error.value?.statusCode === 401) {
    navigateToLogin();
  }

  return data;
}
