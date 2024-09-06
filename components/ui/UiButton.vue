<template>
  <button
    :type="type ?? 'submit'"
    :class="btnClass"
    :disabled="props.loading || props.disabled"
  >
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
    variant?: "primary" | "accent" | "custom" | "outline";
    size?: "small" | "regular";
    loading?: boolean;
    disabled?: boolean;
  }>(),
  { variant: "primary" },
);

const btnClass = computed(() =>
  getBtnClass(props.variant, props.size, props.disabled),
);
</script>
