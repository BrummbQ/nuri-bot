<template>
  <div class="flex flex-col min-h-screen">
    <header
      class="mx-4 px-4 lg:px-6 h-14 flex items-center gap-8 bg-accent rounded-b-xl"
    >
      <NuxtLink to="/" class="flex items-center justify-center font-bold">
        <img src="/assets/logo.png" width="100" alt="Logo" />
      </NuxtLink>
      <NuxtLink class="font-medium" to="/basket/new/recipe">Rezepte</NuxtLink>
      <nav class="ml-auto flex gap-4 sm:gap-6"></nav>

      <ClientOnly>
        <NuxtLink v-if="loggedIn" :to="basketsLink" title="Meine Warenkörbe">
          <Icon name="mdi:cook" class="text-2xl" />
        </NuxtLink>
        <UiLink v-else to="/auth/login">Anmelden</UiLink>
      </ClientOnly>
    </header>

    <main class="max-w-6xl mx-8 xl:mx-auto py-12 grow">
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
