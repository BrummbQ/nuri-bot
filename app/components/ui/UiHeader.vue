<template>
  <h1
    v-if="props.level === 1"
    class="text-3xl font-bold tracking-tight"
    :class="{ 'mb-0': props.noMargin, 'mb-3': !props.noMargin }"
  >
    <slot \></slot>
  </h1>
  <h2
    v-else-if="(props.level as number) === 2"
    class="text-2xl font-bold"
    :class="{ 'mb-0': props.noMargin, 'mb-3': !props.noMargin }"
  >
    <slot \></slot>
  </h2>
  <h3
    v-else-if="(props.level as number) === 3"
    class="text-xl font-bold"
    :class="{ 'mb-0': props.noMargin, 'mb-3': !props.noMargin }"
  >
    <slot \></slot>
  </h3>
</template>

<script setup lang="ts">
const props = defineProps<{ level?: number; noMargin?: boolean }>();
</script>
