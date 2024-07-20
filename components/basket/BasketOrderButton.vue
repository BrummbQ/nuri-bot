<template>
  <NuxtErrorBoundary>
    <UiButton :loading="orderLoading" @click="orderBasket">
      {{ props.label }}
    </UiButton>

    <template #error="{ error, clearError }">
      <UiNotification severity="error">
        Fehler beim Bestellen! {{ error }}
      </UiNotification>
      <UiButton class="mt-2" @click="clearError">Erneut versuchen</UiButton>
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
