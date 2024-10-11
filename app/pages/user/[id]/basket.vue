<template>
  <UiHeader :level="1">Meine Warenkörbe</UiHeader>
  <UiCardView>
    <BasketCard
      v-for="basket in data?.baskets"
      :key="basket.basketId"
      :basket="basket"
    />
  </UiCardView>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["auth-user"],
});

const data = await useFetchBaskets();
</script>
