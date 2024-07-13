export default function () {
  return useNuxtApp().runWithContext(() => navigateTo("/auth/login"));
}
