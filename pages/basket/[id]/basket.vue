<template>
  <div class="flex mb-5">
    <UiHeader class="flex-grow mb-0" :level="1">Warenkorb</UiHeader>
    <UiLink :to="recipeUrl">Rezepte ändern</UiLink>
  </div>
  <ClientOnly>
    <BasketShoppingList v-if="recipes.length" :basketId="route.params.id" />
    <p v-else class="text-center mt-10 font-bold text-gray-500">
      <Icon name="fluent:emoji-sad-16-regular" width="50" height="50" />
      Keine Rezepte ausgewählt!
    </p>
  </ClientOnly>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["auth"],
});

const route = useRoute("basket-id-basket");

const { recipes, createOrSetBasket } = useBasketStore();
const recipeUrl = computed(() => `/basket/${route.params.id}/recipe`);

callOnce(() => createOrSetBasket(route.params.id));
</script>
