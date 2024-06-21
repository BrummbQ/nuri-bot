<template>
  <h1 v-if="props.level === 1" class="text-3xl mb-3 font-bold tracking-tight">
    <slot \></slot>
  </h1>
  <h2 v-else-if="(props.level as number) === 2" class="text-2xl mb-3 font-bold">
    <slot \></slot>
  </h2>
  <h3 v-else-if="(props.level as number) === 3" class="text-xl mb-3 font-bold">
    <slot \></slot>
  </h3>
</template>

<script setup lang="ts">
const props = defineProps<{ level?: number }>();
</script>
