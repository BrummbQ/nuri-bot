export default defineNuxtPlugin(() => {
  const api = $fetch.create({
    async onResponseError({ response }) {
      if (response.status === 401) {
        await navigateToLogin();
      }
    },
  });

  // Expose to useNuxtApp().$api
  return { provide: { api } };
});
