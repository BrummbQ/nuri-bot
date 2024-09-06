<template>
  <div class="text-center">
    <img
      src="/assets/nuribot.png"
      class="mx-auto mb-4"
      width="150"
      height="150"
      alt="Nuri Bot"
    />
    <UiHeader :level="1">Login</UiHeader>

    <p class="mb-4">
      Hallo! Du kannst dich mit deinem Konto anmelden und direkt nach Rezepten
      suchen.
    </p>

    <form class="mb-4 space-y-2" @submit.prevent="handleSubmit">
      <UiInput
        class="w-full"
        placeholder="Email eingeben"
        v-model="email"
        type="email"
        autofocus
        required
      />
      <UiButton type="submit" class="w-full" :loading="loading"
        >Senden</UiButton
      >
    </form>
    <UiNotification severity="success" v-if="success">
      Prüfe dein E-Mail Postfach und klicke auf den Anmelden Link!
    </UiNotification>
    <UiNotification v-if="error" severity="error"
      >Fehler beim Login! {{ error.message }}</UiNotification
    >
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "narrow",
});

const { sendMagicLink, loading, error } = useAuth();
const email = ref("");
const success = ref(false);

const handleSubmit = async () => {
  await sendMagicLink(email.value);
  if (!error.value) {
    success.value = true;
  }
};
</script>
