<template>
  <div class="flex flex-col min-h-screen">
    <header class="px-4 lg:px-6 h-14 flex items-center">
      <NuxtLink to="/" class="flex items-center justify-center font-bold">
        <span>NURI</span>
      </NuxtLink>
      <nav class="ml-auto flex gap-4 sm:gap-6"></nav>

      <ClientOnly>
        <UiLink v-if="loggedIn" :to="basketsLink" iconName="mdi:cook"
          >Meine Warenkörbe</UiLink
        >
        <UiLink v-else to="/auth/login">Anmelden</UiLink>
      </ClientOnly>
    </header>

    <main class="max-w-6xl mx-auto px-4 py-12 md:px-6 lg:px-8 grow w-full">
      <slot />
    </main>

    <footer
      class="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t"
    >
      <p class="text-xs text-muted-foreground">
        &copy; 2024 Nuri(-ishment). Rezeptplanung.
      </p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import UiLink from "~/components/ui/UiLink.vue";

const { loggedIn, user } = useAuth();

const basketsLink = computed(() =>
  user.value ? `/user/${user.value.userId}/basket` : "",
);
</script>
