<!-- pages/auth/verify.vue -->
<template>
  <h1>Einloggen...</h1>
  <p v-if="error">{{ error }}</p>
</template>

<script setup lang="ts">
const route = useRoute();
const router = useRouter();
const { verifyToken, error, user } = useAuth();

onMounted(async () => {
  const token = route.query.token as string;
  if (token) {
    await verifyToken(token);
    if (user.value) {
      // Redirect to dashboard or home page
      router.push("/");
    }
  }
});
</script>
