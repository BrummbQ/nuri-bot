<template>
  <UiHeader class="flex-grow mb-5" :level="1">Warenkorb vollständig!</UiHeader>

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
      <UiButton :loading="orderAgainLoading" @click="orderAgain"
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

  <template v-if="data">
    <UiHeader class="mt-10" :level="2">Ausgewählte Rezepte</UiHeader>
    <RecipeCardView>
      <RecipeCard
        v-for="recipe in data.basket.recipes"
        :key="recipe['@id']"
        :recipe="recipe"
      >
      </RecipeCard>
    </RecipeCardView>

    <BasketShoppingListOverview :basket="data.basket" />
    <p v-if="!data.basket.recipes.length">Warenkorb ist leer</p>
  </template>
  <p v-if="error" class="mt-5 text-center font-bold">
    Konnte Warenkorb nicht laden!
  </p>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["auth-basket"],
});

const route = useRoute("basket-id-ordered");

const { data, error } = await useFetchBasket(route.params.id);
const { postOrderIngredients } = useApi();
const { reweCookieDataValue } = useBasketStore();
const orderAgainLoading = ref(false);

async function orderAgain() {
  orderAgainLoading.value = true;
  try {
    await postOrderIngredients(
      data.value?.basket.ingredientsWithProducts,
      reweCookieDataValue.value,
    );
  } catch (e) {
    throw createError({ statusMessage: "Could not order", fatal: true });
  } finally {
    orderAgainLoading.value = false;
  }
}
</script>
