<template>
  <div class="flex items-center gap-4 mb-6" v-if="!basketConfigured">
    <UiLink
      iconName="fluent:link-16-regular"
      to="https://shop.rewe.de/"
      target="_blank"
      >Rewe Markt {{ basketConfigured ? "ändern" : "wählen" }}</UiLink
    >
    <p>
      Gewünschten Markt auswählen und mit der
      <a
        class="underline text-lime-700"
        href="https://chromewebstore.google.com/detail/nuri-bot-basket-helper/paenjmocjdbgcnceecbhcccegahgkcpf?hl=de"
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

const handleReweConfiguredMessage = (event: MessageEvent) => {
  // We only accept messages from ourselves
  if (event.source !== window) {
    return;
  }

  if (event.data.type === "REWE_CONFIGURED") {
    updateReweCookieData();
  }
};

onMounted(() => {
  window.addEventListener("message", handleReweConfiguredMessage);
});

onUnmounted(() => {
  window.removeEventListener("message", handleReweConfiguredMessage);
});
</script>
