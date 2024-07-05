<template>
  <UiHeader :level="1">Meine Warenkörbe</UiHeader>
  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
    <BasketCard
      v-for="basket in data?.baskets"
      :key="basket.basketId"
      :basket="basket"
    />
  </div>
</template>

<script setup lang="ts">
import type { GetBasketsResponse } from "~/lib/models";

definePageMeta({
  middleware: ["auth"],
});

const { data } = await useFetch<GetBasketsResponse>("/api/baskets");
</script>
