<template>
  <div class="flex items-center">
    <input :id="props.id" type="checkbox" v-model="model" class="h-5 w-5" />
    <label :for="props.id" class="ml-2 flex-1">{{ props.label }}</label>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ label: string; id: string }>();

const model = defineModel<boolean>();
</script>
