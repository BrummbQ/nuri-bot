<template>
  <div class="flex flex-col min-h-screen">
    <UiAppHeader />

    <main class="max-w-xl px-8 sm:px-0 mx-auto py-12 grow w-full">
      <slot />
    </main>

    <UiAppFooter />
  </div>
</template>
