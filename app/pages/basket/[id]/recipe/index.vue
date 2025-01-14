<template>
  <RecipeSearch :basketId="route.params.id" />
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["auth"],
});

const route = useRoute("basket-id-recipe");
</script>
