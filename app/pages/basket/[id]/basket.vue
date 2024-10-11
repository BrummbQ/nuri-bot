<template>
  <UiHeaderRow
    class="py-4 !mb-0 bg-white sticky top-0 z-20"
    headerText="Zutaten"
  >
    <div class="flex gap-4">
      <UiLink variant="accent" :to="recipeUrl">Rezepte ändern</UiLink>
      <BasketOrderButton :basketId="route.params.id" />
    </div>
  </UiHeaderRow>
  <div class="md:p-4">
    <ClientOnly>
      <BasketShoppingList v-if="recipes.length" :basketId="route.params.id" />
      <p v-else class="text-center mt-10 font-bold text-gray-500">
        <Icon name="fluent:emoji-sad-16-regular" width="50" height="50" />
        Keine Rezepte ausgewählt!
      </p>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["auth-basket"],
});

const route = useRoute("basket-id-basket");

const { recipes, createOrSetBasket, searchIngedients, marketIdValue } =
  useBasketStore();
const recipeUrl = computed(() => `/basket/${route.params.id}/recipe`);

callOnce(() => createOrSetBasket(route.params.id));

onMounted(() => {
  if (marketIdValue.value) {
    searchIngedients(recipes.value, marketIdValue.value, route.params.id);
  }
});
</script>
