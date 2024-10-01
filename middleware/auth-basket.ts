import { getUserIdFromClientOrServer } from "~/lib/auth/getUserIdFromClientOrServet";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const userId = getUserIdFromClientOrServer();
  if (userId == null) {
    return navigateToLogin();
  }
  const basketId = (to.params as { id: string }).id;

  // special case for new baskets
  if (basketId === "new") {
    return;
  }

  const { data, error } = await useFetchBasket(basketId);

  // Check if we are logged in and have access
  if (error.value == null && data.value?.basket.userId === userId) {
    return; // continue to the route
  }

  // If not authenticated, redirect to login
  return navigateToLogin();
});
