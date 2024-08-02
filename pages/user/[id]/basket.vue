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
definePageMeta({
  middleware: ["auth-user"],
});

const data = await useFetchBaskets();
</script>
