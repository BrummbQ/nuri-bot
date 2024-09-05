<template>
  <button :type="type ?? 'submit'" :class="btnClass" :disabled="props.loading">
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
    type?: "submit" | "button";
    iconName?: string;
    variant?: "primary" | "accent" | "custom";
    size?: "small" | "regular";
    loading?: boolean;
  }>(),
  { variant: "primary" },
);

const btnClass = computed(() => {
  let sizeClasses = "px-4 h-10";
  if (props.size === "small") {
    sizeClasses = "px-2 h-8";
  }

  const defaultClasses = `rounded-md border flex items-center justify-center ${sizeClasses} `;

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
