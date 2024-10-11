<template>
  <RecipeSearch :basketId="route.params.id" />
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["auth-basket"],
});

const route = useRoute("basket-id-recipe");
</script>
