<template>
  <li class="border-b border-gray-200 p-4">
    <div
      class="flex justify-between items-center text-lg cursor-pointer"
      @click="toggle()"
    >
      <slot name="title" />
      <Icon class="cursor-pointer" :name="toggledIconName" />
    </div>

    <div v-if="toggled" class="mt-4"><slot /></div>
  </li>
</template>

<script setup lang="ts">
const toggled = ref(false);
const toggledIconName = computed(() =>
  toggled.value
    ? "fluent:chevron-up-16-regular"
    : "fluent:chevron-down-16-regular",
);

const toggle = () => {
  toggled.value = !toggled.value;
};
</script>
