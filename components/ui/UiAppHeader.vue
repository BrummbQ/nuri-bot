<template>
  <header
    class="mx-4 px-4 lg:px-6 h-14 flex items-center gap-8 bg-accent rounded-b-xl"
  >
    <NuxtLink to="/" class="flex items-center justify-center font-bold">
      <img src="/assets/logo.png" width="100" alt="Logo" />
    </NuxtLink>
    <NuxtLink class="font-medium" to="/basket/new/recipe">Rezepte</NuxtLink>
    <nav class="ml-auto flex gap-4 sm:gap-6"></nav>

    <ClientOnly>
      <template v-if="loggedIn">
        <NuxtLink :to="likedRecipesLink" title="Lieblingsrezepte">
          <Icon name="mdi:heart" class="text-2xl" />
        </NuxtLink>
        <NuxtLink :to="basketsLink" title="Meine Warenkörbe">
          <Icon name="mdi:cook" class="text-2xl" />
        </NuxtLink>
      </template>
      <UiLink v-else to="/auth/login">Anmelden</UiLink>
    </ClientOnly>
  </header>
</template>

<script setup lang="ts">
const { loggedIn, user } = useAuth();

const basketsLink = computed(() =>
  user.value ? `/user/${user.value.userId}/basket` : "",
);
const likedRecipesLink = computed(() =>
  user.value ? `/user/${user.value.userId}/recipe/liked` : "",
);
</script>
