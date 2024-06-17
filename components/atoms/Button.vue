<template>
  <button
    type="submit"
    class="rounded-md border border-gray-700 bg-gray-700 px-4 py-2 text-white transition-colors hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center"
    style="height: 42px"
    :disabled="props.loading"
  >
    <Icon v-if="props.loading" name="line-md:loading-loop" class="text-2xl" />
    <template v-else>
      <Icon
        v-if="props.iconName"
        :name="props.iconName"
        class="mr-2 text-2xl"
      />

      <slot />
    </template>
  </button>
</template>

<script setup lang="ts">
const props = defineProps<{ iconName?: string; loading?: boolean }>();
</script>
