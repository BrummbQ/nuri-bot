<template>
  <UiHeader :level="1">Login</UiHeader>

  <UiNotification severity="info"
    >Zum Fortfahren melde dich mit deiner E-Mail an</UiNotification
  >

  <form class="flex items-center mb-4" @submit.prevent="handleSubmit">
    <UiInput
      class="rounded-r-none"
      placeholder="Email"
      v-model="email"
      type="email"
      autofocus
      required
    />
    <UiButton type="submit" class="rounded-l-none" :loading="loading"
      >E-Mail senden</UiButton
    >
  </form>
  <UiNotification severity="success" v-if="success">
    Prüfe dein E-Mail Postfach und klicke auf den Anmelden Link!
  </UiNotification>
  <UiNotification v-if="error" severity="error"
    >Fehler beim Login! {{ error.message }}</UiNotification
  >
</template>

<script setup lang="ts">
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
