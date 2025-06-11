<template>
  <h1>Einloggen...</h1>
  <p v-if="error">{{ error }}</p>
</template>

<script setup lang="ts">
const route = useRoute();
const { verifyToken, error, user } = useAuth();

onMounted(async () => {
  const token = route.query.token as string;
  const redirect = route.query.redirect as string;
  if (token) {
    await verifyToken(token);
    if (user.value) {
      // Navigate to redirect or home page
      await navigateTo(redirect || "/");
    }
  }
});
</script>
