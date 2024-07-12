<template>
  <div class="flex place-content-between mb-4">
    <div class="flex gap-1">
      <UiButton
        size="small"
        variant="custom"
        class="rounded-full bg-lime-300 border-lime-400 text-gray-700 transition-colors hover:bg-lime-400"
        v-for="suggestion in suggestions"
        :key="suggestion.label"
        @click="emit('suggest', { seed: suggestion.data, dietType: dietType })"
        >{{ suggestion.label }}</UiButton
      >
    </div>

    <div class="flex gap-2">
      <UiRadioInput
        v-for="dietTypeRadio in dietTypeRadios"
        :key="dietTypeRadio.value"
        :id="dietTypeRadio.value"
        name="dietType"
        :value="dietTypeRadio.value"
        :label="dietTypeRadio.label"
        v-model="dietType"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DietType, RecipeSuggestion } from "~/lib/models";

const emit = defineEmits<{ suggest: [RecipeSuggestion] }>();

const suggestions = [
  {
    label: "Hauptgericht schnell",
    data: "Schnelle Nudelsuppe, Nudeln mit Soße",
  },
  {
    label: "Dessert",
    data: "Schokoladenpudding, Erdbeereis, Kuchen mit Kiwi, Tiramisu",
  },
  //   {
  //     label: "Getränk",
  //     data: "Getränkerezepte, Cocktail für Party, Gesunder Wachmacher, Limonade mit wenig Zucker, Aperol, Kaffee mit Whiskey",
  //   },
  { label: "Zufällig" },
];
const dietTypeRadios = [
  { value: "vegan", label: "Vegan" },
  { value: "vegetarian", label: "Vegetarisch" },
  { value: "all", label: "Alles" },
];

const dietType = ref<DietType>("all");
</script>
