<template>
  <NuxtLink
    :target="props.target"
    class="rounded-md border border-gray-700 bg-gray-700 px-4 py-2 text-white transition-colors hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 inline-flex items-center justify-center h-10"
    :to="props.to"
  >
    <Icon v-if="props.iconName" :name="props.iconName" class="mr-2 text-2xl" />
    <slot />
  </NuxtLink>
</template>

<script setup lang="ts">
const props = defineProps<{ iconName?: string; target?: string; to: string }>();
</script>
