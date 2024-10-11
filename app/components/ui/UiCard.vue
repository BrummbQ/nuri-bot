<template>
  <article
    class="flex flex-col bg-white rounded-lg overflow-hidden shadow-lg relative"
  >
    <slot name="cardimg" />

    <div class="p-4 flex-1 flex flex-col">
      <h3
        class="text-lg text-gray-600 font-bold mb-2 text-ellipsis overflow-hidden text-nowrap"
        :title="props.title"
      >
        {{ props.title }}
      </h3>
      <slot name="cardbody" />

      <div v-if="$slots.cardfooter" class="mt-4">
        <slot name="cardfooter" />
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
const props = defineProps<{
  title: string;
}>();
</script>
