<template>
  <div class="flex items-center gap-4">
    <UiLink iconName="fluent:link-16-regular" href="https://shop.rewe.de/"
      >Rewe Markt {{ basketConfigured ? "ändern" : "wählen" }}</UiLink
    >
    <p v-if="!basketConfigured">
      Gewünschten Markt auswählen und mit der Extension den Warenkorb
      konfigurieren
    </p>
  </div>
</template>

<script setup lang="ts">
import type { BasketData } from "~/lib/models";

export interface BuildBasketEvent {
  basketData: BasketData[];
  marketId: string;
}

const emit = defineEmits<{
  buildBasket: [event: BuildBasketEvent];
}>();

const marketId = ref<string | undefined>();
// try to read basket data from local storage
const basketData = ref<BasketData[] | undefined>(readExtensionBasketData());

const basketConfigured = computed(() => marketId.value && basketData.value);

watchEffect(() => {
  marketId.value = readMarketId(basketData.value);
});

watchEffect(() => {
  if (basketData.value && marketId.value) {
    emit("buildBasket", {
      basketData: basketData.value,
      marketId: marketId.value,
    });
  }
});

// watch rewe configured event
window.addEventListener(
  "message",
  (event) => {
    // We only accept messages from ourselves
    if (event.source !== window) {
      return;
    }

    if (event.data.type && event.data.type === "REWE_CONFIGURED") {
      basketData.value = readExtensionBasketData();
    }
  },
  false,
);
</script>
