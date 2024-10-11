<template>
  <UiCard :title="basket.title">
    <template #cardimg>
      <img
        :src="basket.image"
        alt="Warenkorb Bild"
        width="300"
        height="200"
        class="w-full h-48 object-cover"
      />
    </template>
    <template #cardbody>
      Enthält {{ props.basket.recipeCount }} Rezepte
    </template>
    <template #cardfooter>
      <UiLink :to="basketLink">Ansehen</UiLink>
    </template>
  </UiCard>
</template>

<script setup lang="ts">
import type { BasketOverview } from "~/lib/models";

const props = defineProps<{ basket: BasketOverview }>();

const basketLink = computed(() => `/basket/${props.basket.basketId}/ordered`);
</script>
