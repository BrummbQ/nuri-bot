<template>
  <ClientOnly>
    <div v-if="!showWizard" class="columns-2 gap-4">
      <UiButton
        type="button"
        class="w-full"
        variant="accent"
        iconName="mdi:wizard-hat"
        @click="showWizard = true"
        >Rezept ändern</UiButton
      >
      <UiButton
        type="button"
        class="w-full"
        iconName="mdi:check"
        @click="selectRecipe()"
        >Rezept verwenden</UiButton
      >
    </div>

    <RecipeWizard v-else @createRecipe="showWizard = false" />

    <div v-if="recipe && !showWizard" class="pt-4">
      <RecipeDetail :recipe="recipe" />
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "narrow",
  middleware: ["auth-basket"],
});

const route = useRoute("basket-id-recipe-wizard");
const basketUrl = computed(() => `/basket/${route.params.id}/basket`);
const { recipe } = useRecipeWizardState();
const { addRecipe } = useBasketStore();
const showWizard = ref(true);

watchEffect(() => {
  // recipe state only available on client!
  showWizard.value = recipe.value == null;
});

function selectRecipe() {
  if (recipe.value != null) {
    addRecipe(recipe.value, route.params.id);
    navigateTo(`/basket/${route.params.id}/recipe`);
  }
}
</script>
