<template>
  <div class="flex flex-col items-center">
    <img src="/assets/loader.png" alt="Loading..." class="loader-image" />
    <span class="text-lg">{{ loadingText }}</span>
  </div>
</template>

<script setup lang="ts">
function pickRandomMessage(): string {
  const loadingMessages = [
    "Wir heizen den Ofen vor...",
    "Noch eine Prise Geduld!",
    "Die Butter schmilzt gleich...",
    "Rühren, nicht schütteln...",
    "Wir suchen die perfekte Reifezeit...",
    "Die Geheimzutat wird hinzugefügt...",
    "Das Rezept lädt – bitte nicht naschen!",
    "Wie man es wendet, es ist gleich fertig.",
    "Kekse... im Browser oder im Ofen?",
    "Wir karamellisieren das Internet...",
    "Der Teig ruht, gleich geht’s weiter!",
  ];
  const randomIndex = Math.floor(Math.random() * loadingMessages.length);
  return loadingMessages[randomIndex];
}

const updateLoadingText = () => {
  loadingText.value = pickRandomMessage();
};

const loadingText = ref(pickRandomMessage());
const loaderInterval = ref<number | undefined>();

onMounted(() => {
  loaderInterval.value = setInterval(
    updateLoadingText,
    2000,
  ) as unknown as number;
});

onUnmounted(() => {
  if (loaderInterval.value) {
    clearInterval(loaderInterval.value);
  }
});
</script>

<style scoped>
.loader-image {
  width: 100px;
  height: 100px;
  animation: spin 1.5s linear infinite;
}

/* Animation for spinning effect */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
