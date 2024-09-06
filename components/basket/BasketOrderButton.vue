<template>
  <NuxtErrorBoundary>
    <UiButton :loading="orderLoading" @click="orderBasket">
      {{ props.label }}
    </UiButton>

    <template #error="{ error, clearError }">
      <UiNotification severity="error" :toast="true">
        Fehler beim Bestellen! {{ error }}
      </UiNotification>
      <UiButton @click="clearError">Erneut versuchen</UiButton>
    </template>
  </NuxtErrorBoundary>
</template>

<script setup lang="ts">
interface Props {
  basketId: string;
  label?: string;
}

const props = withDefaults(defineProps<Props>(), {
  label: "Bestellen",
});

const { orderBasket, orderLoading } = useOrderBasket(props.basketId);
</script>
