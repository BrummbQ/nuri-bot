<template>
  <NuxtLink :target="props.target" :class="btnClass" :to="props.to">
    <Icon v-if="props.iconName" :name="props.iconName" class="mr-2 text-2xl" />
    <slot />
  </NuxtLink>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    iconName?: string;
    target?: string;
    to: string;
    variant?: "primary" | "accent" | "outline" | "custom";
    size?: "small" | "regular";
  }>(),
  { variant: "primary" },
);

const btnClass = computed(() => getBtnClass(props.variant, props.size));
</script>
