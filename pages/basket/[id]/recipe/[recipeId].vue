<template>
  <div class="flex justify-between mb-4">
    <UiLink :to="basketUrl" class="inline-flex" variant="accent">Zurück</UiLink>
    <UiButton v-if="inBasket" type="button" @click="unselectRecipe()"
      >Entfernen</UiButton
    >
    <UiButton v-else="inBasket" type="button" @click="selectRecipe()"
      >Hinzufügen</UiButton
    >
  </div>
  <RecipeDetail :recipe="data" />
</template>

<script setup lang="ts">
definePageMeta({
  layout: "narrow",
});

const route = useRoute("basket-id-recipe-recipeId");
const { data } = await useFetchRecipe(route.params.recipeId);
const { addRecipe, removeRecipe, recipes } = useBasketStore();
const { addNotification } = useNotification();

const basketUrl = computed(() => `/basket/${route.params.id}/recipe`);
const inBasket = computed(() =>
  recipes.value.find(
    (r) => r["@id"] === decodeURIComponent(route.params.recipeId),
  ),
);

function unselectRecipe() {
  if (data.value) {
    removeRecipe(data.value, route.params.id);
    addNotification({ severity: "success", message: "Rezept entfernt" });
  }
}

function selectRecipe() {
  if (data.value) {
    addRecipe(data.value, route.params.id);
    addNotification({ severity: "success", message: "Rezept hinzugefügt" });
  }
}
</script>
