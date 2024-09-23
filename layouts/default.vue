<template>
  <div class="flex flex-col min-h-screen">
    <UiAppHeader />

    <main class="max-w-6xl px-4 xl:px-0 lg:mx-auto py-12 grow w-full">
      <slot />
    </main>

    <UiAppFooter />
  </div>
</template>
