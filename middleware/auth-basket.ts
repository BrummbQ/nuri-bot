import { getUserIdFromClientOrServer } from "~/lib/auth/getUserIdFromClientOrServet";
import { getBasketById } from "~/lib/db";

export default defineNuxtRouteMiddleware(async (to, from) => {
  if (!import.meta.server) return;
  const userId = getUserIdFromClientOrServer();
  const basketId = (to.params as { id: string }).id;

  // special case for new baskets
  if (basketId === "new") {
    return;
  }

  const basket = await getBasketById(basketId);

  // Check if we are logged in and have access
  if (basket?.user_id === userId) {
    return; // continue to the route
  }

  // If not authenticated, redirect to login
  return navigateTo("/auth/login");
});
