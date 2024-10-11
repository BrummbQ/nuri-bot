<template>
  <UiHeaderRow headerText="Meine Lieblingsrezepte">
    <UiLink :to="basketRecipeUrl">Warenkorb</UiLink>
  </UiHeaderRow>
  <RecipeLikedCards
    v-if="data?.recipes"
    :recipes="data?.recipes"
    :userId="route.params.id"
    @select="selectRecipe($event)"
  />
  <div
    v-if="!data?.recipes.length"
    class="text-center mt-10 font-bold text-gray-500"
  >
    <p>
      <Icon name="fluent:emoji-sad-16-regular" width="50" height="50" />
      Keine Lieblingsrezepte! Erstelle einen Warenkorb, Du findest die Rezepte
      dann hier
    </p>
    <UiLink class="w-64 inline-flex" :to="basketRecipeUrl"
      >Zur Bestellung</UiLink
    >
  </div>
</template>

<script setup lang="ts">
import type { RecipeSchema } from "~/lib/models";

definePageMeta({
  middleware: ["auth-user"],
});

const route = useRoute("user-id-recipe-liked");
const data = await useFetchLikedRecipes();
const { addRecipe, currentBasket } = useBasketStore();
const { addNotification } = useNotification();
const basketRecipeUrl = computed(() => `/basket/${currentBasket.value}/recipe`);

const selectRecipe = (recipe: RecipeSchema) => {
  if (currentBasket.value) {
    addRecipe(recipe, currentBasket.value);
    addNotification({
      severity: "success",
      message: "Rezept zum Warenkorb hinzugefügt",
    });
  }
};
</script>
