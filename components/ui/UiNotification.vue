<template>
  <div
    class="p-4 rounded-md"
    :class="{
      'bg-green-200': props.severity === 'success',
      'bg-blue-200': props.severity === 'info',
      'bg-red-200': props.severity === 'error',
      'absolute bottom-4 left-1/2 -translate-x-1/2': props.toast,
    }"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  severity: "info" | "success" | "error";
  toast?: boolean;
}>();
</script>
