<template>
  <NuxtErrorBoundary>
    <ClientOnly>
      <UiButton
        :loading="orderLoading"
        :disabled="!basketConfigured || searchLoading"
        @click="orderBasket"
      >
        {{ props.label }}
      </UiButton>
    </ClientOnly>

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

const { orderBasket, orderLoading, basketConfigured, searchLoading } =
  useOrderBasket(props.basketId);
</script>
