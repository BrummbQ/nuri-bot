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

    <template v-else>
      <UiLink :to="basketRecipeUrl" class="inline-flex mb-4" variant="accent"
        >Zurück zum Warenkorb</UiLink
      >
      <RecipeWizard @createRecipe="showWizard = false" />
    </template>

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
const basketRecipeUrl = computed(() => `/basket/${route.params.id}/recipe`);
const { recipe, clearWizard } = useRecipeWizardState();
const { addRecipe } = useBasketStore();
const showWizard = ref(true);

onMounted(() => {
  clearWizard();
  // recipe state only available on client!
  showWizard.value = recipe.value == null;
});

async function selectRecipe() {
  if (recipe.value != null) {
    addRecipe(recipe.value, route.params.id);
    await navigateTo(`/basket/${route.params.id}/recipe`);
  }
}
</script>
