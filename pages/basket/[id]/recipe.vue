<template>
  <RecipeSearch :basketId="route.params.id" />
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["auth-basket"],
});

const route = useRoute("basket-id-recipe");
const basketUrl = computed(() => `/basket/${route.params.id}/basket`);
</script>
