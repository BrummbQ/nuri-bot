// middleware/auth.ts
import { useAuth } from "~/composables/useAuth";

export default defineNuxtRouteMiddleware(async (to, from) => {
  if (import.meta.server) return;

  const { loggedIn } = useAuth();

  // Check if we are logged in have a user
  if (loggedIn.value) {
    return; // continue to the route
  }

  // If not authenticated, redirect to login
  return await navigateToLogin(to.fullPath);
});
