<template>
  <div class="flex justify-between items-center mb-4">
    <UiHeader :noMargin="true" :level="1">{{ props.headerText }}</UiHeader>
    <slot />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  headerText: string;
}>();
</script>
