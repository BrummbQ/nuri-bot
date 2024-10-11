export function getUserIdFromClientOrServer(): string | undefined {
  if (import.meta.server) {
    return useNuxtApp().ssrContext?.event.context.auth?.userId;
  } else if (import.meta.client) {
    const { loggedIn, user } = useAuth();
    if (loggedIn.value) {
      return user.value?.userId;
    }
  }
  return;
}
