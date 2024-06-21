<template>
  <a
    target="_blank"
    class="rounded-md border border-gray-700 bg-gray-700 px-4 py-2 text-white transition-colors hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 inline-flex items-center justify-center h-10"
  >
    <Icon v-if="props.iconName" :name="props.iconName" class="mr-2 text-2xl" />
    <slot />
  </a>
</template>

<script setup lang="ts">
const props = defineProps<{ iconName?: string }>();
</script>
