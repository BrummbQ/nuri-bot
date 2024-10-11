<!-- RadioInput.vue -->
<template>
  <div class="flex items-center">
    <input
      type="radio"
      :id="id"
      :name="name"
      :value="value"
      :checked="modelValue === value"
      @change="$emit('update:modelValue', value)"
      class="w-4 h-4 text-gray-600 bg-gray-100 border-gray-300"
    />
    <label :for="id" class="ml-1 text-sm font-medium text-gray-700">
      {{ label }}
    </label>
  </div>
</template>

<script setup lang="ts">
interface RadioInputProps {
  id: string;
  name: string;
  value: any;
  label: string;
  modelValue: any;
}

const props = defineProps<RadioInputProps>();

const emit = defineEmits<{
  (e: "update:modelValue", value: any): void;
}>();
</script>
