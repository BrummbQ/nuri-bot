<template>
  <li class="border rounded-lg bg-gray-300 border-gray-200 my-2 px-4 py-2">
    <div
      class="flex justify-between items-center text-lg cursor-pointer"
      @click="toggle()"
    >
      <slot name="title" />
      <Icon class="cursor-pointer" :name="toggledIconName" />
    </div>

    <div v-if="model" class="mt-4"><slot /></div>
  </li>
</template>

<script setup lang="ts">
const model = defineModel<boolean>();

const toggledIconName = computed(() =>
  model.value
    ? "fluent:chevron-up-16-regular"
    : "fluent:chevron-down-16-regular",
);

const toggle = () => {
  model.value = !model.value;
};
</script>
