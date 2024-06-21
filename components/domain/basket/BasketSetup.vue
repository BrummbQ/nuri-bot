<template>
  <div class="flex gap-4">
    <UiLink iconName="fluent:link-16-regular" href="https://shop.rewe.de/"
      >Gehe zu Rewe</UiLink
    >
    <UiInput placeholder="Warenkorb ID" v-model="listingId" />
  </div>

  <UiButton
    iconName="fluent:cart-16-regular"
    @click="emit('buildBasket', 'todo')"
    >Warenkorb erstellen</UiButton
  >
</template>

<script setup lang="ts">
const emit = defineEmits<{
  buildBasket: [data: string];
}>();

const listingId = ref("");
</script>
