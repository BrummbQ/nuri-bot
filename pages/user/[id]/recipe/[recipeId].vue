<template>
  <div class="flex justify-between">
    <UiLink :to="basketUrl" class="inline-flex mb-4" variant="accent"
      >Zurück</UiLink
    >
  </div>
  <RecipeDetail :recipe="data" :canLike="true" @likeRecipe="like($event)" />
</template>

<script setup lang="ts">
definePageMeta({
  layout: "narrow",
});

const route = useRoute("user-id-recipe-recipeId");
const { data } = await useFetchRecipe(route.params.recipeId);
const { likeRecipe } = useApi();

const basketUrl = computed(() => `/user/${route.params.id}/recipe/liked`);

async function like(v: boolean) {
  await likeRecipe(route.params.recipeId, { like: v });
  if (data.value) {
    data.value.liked = v;
  }
}
</script>
