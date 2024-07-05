<template>
  <div
    class="p-4 rounded-md my-4"
    :class="{
      'bg-green-200': props.severity === 'success',
      'bg-blue-200': props.severity === 'info',
      'bg-red-200': props.severity === 'error',
    }"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ severity: "info" | "success" | "error" }>();
</script>
