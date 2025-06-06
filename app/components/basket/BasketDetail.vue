<template>
  <UiHeaderRow :headerText="basketTitle">
    <UiShareButton
      title="Warenkorb teilen"
      @click="emit('share', basket.basketId)"
    />
  </UiHeaderRow>

  <p class="mb-4">
    Der Warenkorb wurde angelegt. Gehe zum Rewe Warenkorb, um die Bestellung
    abzuschließen.
  </p>

  <div class="flex gap-1">
    <UiLink
      v-if="!orderAgainLoading"
      to="https://shop.rewe.de/checkout/basket"
      target="_blank"
      >Zum Rewe Warenkorb</UiLink
    >
    <NuxtErrorBoundary>
      <UiButton :loading="orderAgainLoading" @click="emit('orderAgain')"
        >Erneut bestellen</UiButton
      >
      <template #error="{ error, clearError }">
        <UiNotification severity="error">
          Fehler beim Bestellen! {{ error }}
        </UiNotification>
        <UiButton class="mt-2" @click="clearError">Erneut versuchen</UiButton>
      </template>
    </NuxtErrorBoundary>
  </div>

  <UiHeader class="mt-10" :level="2">Ausgewählte Rezepte</UiHeader>
  <UiCardView>
    <RecipeCard
      v-for="recipe in basket.recipes"
      :key="recipe['@id']"
      :recipe="recipe"
      :recipeLink="recipeLink(recipe)"
    >
    </RecipeCard>
  </UiCardView>

  <BasketShoppingListOverview :basket="basket" />
  <p v-if="!basket.recipes.length">Warenkorb ist leer</p>
</template>

<script setup lang="ts">
import type { Basket, RecipeSchema } from "~/lib/models";
import { formatBasketTitle } from "~/lib/utils/basket";

const props = defineProps<{ basket: Basket; orderAgainLoading: boolean }>();
const emit = defineEmits<{
  orderAgain: [];
  share: [basketId: string];
}>();

const basketTitle = computed(() => {
  return formatBasketTitle(props.basket);
});

function recipeLink(recipe: RecipeSchema) {
  return `/basket/${props.basket.basketId}/ordered/recipe/${encodeURIComponent(encodeURIComponent(recipe["@id"]))}`;
}
</script>
