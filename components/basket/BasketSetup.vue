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
const { reweCookieDataValue, updateReweCookieData } = useBasketStore();

const basketConfigured = computed(() => reweCookieDataValue.value);

// watch rewe configured event
window.addEventListener(
  "message",
  (event) => {
    // We only accept messages from ourselves
    if (event.source !== window) {
      return;
    }

    if (event.data.type && event.data.type === "REWE_CONFIGURED") {
      updateReweCookieData(readExtensionBasketData());
    }
  },
  false,
);
</script>
