<template>
  <div v-for="(recipes, category) in groupedRecipes" :key="category">
    <UiHeaderRow :headerText="category">
      <UiLink :to="wizardUrl" variant="outline"
        ><Icon name="mdi:add" class="text-2xl mr-2" /> Rezept hinzufügen</UiLink
      >
    </UiHeaderRow>

    <UiCardView>
      <RecipeCard
        v-for="recipe in recipes"
        :key="recipe['@id']"
        :recipe="recipe"
        :recipeLink="basketRecipeUrl(basketId, recipe)"
      >
        <UiButton
          class="mt-4"
          iconName="fluent:checkmark-16-regular"
          variant="accent"
          @click="emit('select', recipe)"
          >Auswählen</UiButton
        >
      </RecipeCard>
    </UiCardView>
  </div>
</template>

<script setup lang="ts">
import type { RecipeSchema } from "~/lib/models";
import type { RecipeCategory } from "~/lib/models/recipe-category.model";

const props = defineProps<{
  recipes: RecipeSchema[];
  basketId: string;
}>();
const emit = defineEmits<{
  select: [RecipeSchema];
}>();

const categoryTranslations: Record<RecipeCategory, string> = {
  Appetizer: "Vorspeisen",
  Main: "Hauptgerichte",
  Side: "Beilagen",
  Dessert: "Dessert",
  Snack: "Snacks",
  Breakfast: "Frühstück",
  Drink: "Getränke",
  Sauce: "Soßen",
  Other: "Andere",
};

const wizardUrl = computed(() => `/basket/${props.basketId}/recipe-wizard`);

// Group recipes by category
const groupedRecipes = computed(() => {
  return props.recipes.reduce<Record<string, RecipeSchema[]>>(
    (groups, recipe) => {
      const category =
        categoryTranslations[recipe.categorization?.category ?? "Other"] ??
        "Andere";
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(recipe);
      return groups;
    },
    {},
  );
});
</script>
