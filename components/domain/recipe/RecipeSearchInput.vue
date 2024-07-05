<template>
  <form class="flex items-center mb-4" @submit="emit('search', query)">
    <UiInput
      class="rounded-r-none"
      placeholder="Was möchtest du essen?"
      :disabled="props.loading"
      v-model="query"
    />
    <UiButton
      class="rounded-l-none"
      iconName="fluent:food-16-regular"
      :loading="props.loading"
      style="min-width: 6em"
      @click="emit('search', query)"
      >Los</UiButton
    >
  </form>
</template>

<script setup lang="ts">
const props = defineProps<{ loading?: boolean }>();
const emit = defineEmits<{
  search: [query: string];
}>();

const query = ref("");
</script>
