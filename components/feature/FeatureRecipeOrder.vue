<template>
  <RecipeSearch v-model="recipes" />

  <BasketShoppingList v-if="recipes.length" :recipes="recipes" />
</template>

<script setup lang="ts">
import type { RecipeSchema } from "~/lib/models";

const recipes = ref<RecipeSchema[]>([]);
</script>
