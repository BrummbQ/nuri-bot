<template>
  <UiCard :title="basketTitle">
    <template #cardimg>
      <img
        :src="basketImage"
        alt="Warenkorb Bild"
        width="300"
        height="200"
        class="w-full h-48 object-cover"
      />
    </template>
    <template #cardbody>
      Enthält {{ props.basket.recipes.length }} Rezepte
    </template>
    <template #cardfooter>
      <UiLink :to="basketLink">Ansehen</UiLink>
    </template>
  </UiCard>
</template>

<script setup lang="ts">
import type { Basket } from "~/lib/models";

const props = defineProps<{ basket: Basket }>();

const basketTitle = computed(() => {
  if (!props.basket.recipes.length) {
    return "Leerer Warenkorb";
  }
  return props.basket.recipes[0].name;
});

const basketImage = computed(() => {
  if (!props.basket.recipes.length) {
    return "/images/placeholder.svg";
  }
  return props.basket.recipes[0].image[0] + "?impolicy=recipe-card";
});

const basketLink = computed(() => {
  return `/basket/${props.basket.basketId}/ordered`;
});
</script>
