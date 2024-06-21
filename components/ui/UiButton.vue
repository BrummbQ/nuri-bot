<template>
  <button type="submit" :class="btnClass" :disabled="props.loading">
    <Icon v-if="props.loading" name="line-md:loading-loop" class="text-2xl" />
    <template v-else>
      <Icon
        v-if="props.iconName"
        :name="props.iconName"
        class="text-2xl"
        :class="{ 'mr-2': $slots.default }"
      />

      <slot />
    </template>
  </button>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    iconName?: string;
    variant?: "primary" | "accent";
    loading?: boolean;
  }>(),
  { variant: "primary" },
);

const btnClass = computed(() => {
  const defaultClasses =
    "rounded-md border flex items-center justify-center px-4 py-2 h-10";

  switch (props.variant) {
    case "primary":
      return (
        defaultClasses +
        "border-gray-700 bg-gray-700 text-white transition-colors hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      );
    case "accent":
    default:
      return (
        defaultClasses +
        "border-gray-700 text-gray-700 transition-colors hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
      );
  }
});
</script>
