<template>
  <div class="flex items-center gap-4">
    <UiLink
      iconName="fluent:link-16-regular"
      to="https://shop.rewe.de/"
      target="_blank"
      >Rewe Markt {{ basketConfigured ? "ändern" : "wählen" }}</UiLink
    >
    <p v-if="!basketConfigured">
      Gewünschten Markt auswählen und mit der
      <a
        class="underline text-lime-700"
        href="https://github.com/BrummbQ/nuri-bot/tree/main/chrome-extension"
        target="_blank"
        >Chrome Extension</a
      >
      den Warenkorb konfigurieren
    </p>
  </div>
</template>

<script setup lang="ts">
import type { ReweBasketCookieData } from "~/lib/models";

export interface BuildBasketEvent {
  basketData: ReweBasketCookieData[];
  marketId: string;
}

const emit = defineEmits<{
  buildBasket: [event: BuildBasketEvent];
}>();

const marketId = ref<string | undefined>();
// try to read basket data from local storage
const basketData = ref<ReweBasketCookieData[] | undefined>(
  readExtensionBasketData(),
);

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
