export default function () {
  return useNuxtApp().runWithContext(() => {
    const { logout } = useAuth();
    logout();
    return navigateTo("/auth/login");
  });
}
