<template>
  <UiHeader :level="1">Meine Lieblingsrezepte</UiHeader>
  <RecipeCardView>
    <RecipeCard
      v-for="recipe in data?.recipes"
      :key="recipe['@id']"
      :recipe="recipe"
      :recipeLink="userRecipeUrl(route.params.id, recipe)"
    >
    </RecipeCard>
  </RecipeCardView>
  <div
    v-if="!data?.recipes.length"
    class="text-center mt-10 font-bold text-gray-500"
  >
    <p>
      <Icon name="fluent:emoji-sad-16-regular" width="50" height="50" />
      Keine Lieblingsrezepte! Erstelle einen Warenkorb, Du findest die Rezepte
      dann hier
    </p>
    <UiLink class="w-64 inline-flex" to="/basket/new/recipe"
      >Zur Bestellung</UiLink
    >
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["auth-user"],
});

const route = useRoute("user-id-recipe-liked");
const data = await useFetchLikedRecipes();
</script>
