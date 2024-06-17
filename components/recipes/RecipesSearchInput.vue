<template>
  <form className="flex items-center mb-4" @submit="emit('search', query)">
    <AtomsInput
      class="rounded-r-none"
      :disabled="props.loading"
      v-model="query"
    />
    <AtomsButton
      class="rounded-l-none"
      iconName="uil:food"
      :loading="props.loading"
      style="min-width: 6em"
      @click="emit('search', query)"
      >Los</AtomsButton
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
