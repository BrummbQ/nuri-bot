<template>
  <div class="flex justify-between">
    <UiLink :to="basketUrl" class="inline-flex mb-4" variant="accent"
      >Zurück</UiLink
    >
  </div>
  <RecipeDetail
    :recipe="data"
    :canLike="true"
    :canShare="true"
    @likeRecipe="like($event)"
  />
</template>

<script setup lang="ts">
definePageMeta({
  layout: "narrow",
  middleware: ["auth"],
});

const route = useRoute("basket-id-recipe-recipeId");
const { data } = await useFetchRecipe(route.params.recipeId);
const { likeRecipe } = useApi();

const basketUrl = computed(() => `/basket/${route.params.id}/ordered`);

async function like(v: boolean) {
  await likeRecipe(route.params.recipeId, { like: v });
  if (data.value) {
    data.value.liked = v;
  }
}
</script>
