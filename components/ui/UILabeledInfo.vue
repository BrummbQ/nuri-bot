<template>
  <div class="flex items-center bg-white rounded px-1">
    <Icon v-if="props.iconName" :name="props.iconName" class="mr-1" />
    <span class="text-gray-500 dark:text-gray-400">{{
      props.text ?? "-"
    }}</span>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ iconName?: string; text?: string | number }>();
</script>
