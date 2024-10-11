<template>
  <input
    type="text"
    class="flex-1 rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
    :placeholder="props.placeholder"
    v-model="model"
  />
</template>

<script setup lang="ts">
const props = defineProps<{ placeholder: string }>();

const model = defineModel<string>();
</script>
