import { getUserIdFromClientOrServer } from "~/lib/auth/getUserIdFromClientOrServet";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const userId = getUserIdFromClientOrServer();

  const pathUserId = (to.params as { id: string }).id;

  // Check if we are logged in and have access
  if (pathUserId === userId) {
    return; // continue to the route
  }

  // If not authenticated, redirect to login
  return navigateToLogin();
});
