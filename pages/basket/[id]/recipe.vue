<template>
  <div class="flex mb-5">
    <UiHeader class="flex-grow mb-0" :level="1">Rezepte suchen</UiHeader>
    <UiLink :to="basketUrl">Zum Warenkorb</UiLink>
  </div>
  <RecipeSearch :basketId="route.params.id" />
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["auth-basket"],
});

const route = useRoute("basket-id-recipe");
const basketUrl = computed(() => `/basket/${route.params.id}/basket`);
</script>
