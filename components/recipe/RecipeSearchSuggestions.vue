<template>
  <div class="flex flex-col sm:flex-row place-content-between mb-4">
    <div class="flex gap-1">
      <UiButton
        size="small"
        variant="custom"
        class="rounded-full bg-accent border-accent-400 text-gray-700 transition-colors hover:bg-accent-400"
        v-for="suggestion in suggestions"
        :key="suggestion.label"
        @click="emit('suggest', { seed: suggestion.data, dietType: dietType })"
        >{{ suggestion.label }}</UiButton
      >
    </div>

    <UiLink :to="wizardUrl" size="small"
      ><Icon name="mdi:wizard-hat" class="text-2xl mr-2" /> Neues Rezept</UiLink
    >
    <!-- <div class="flex gap-2">
      <UiRadioInput
        v-for="dietTypeRadio in dietTypeRadios"
        :key="dietTypeRadio.value"
        :id="dietTypeRadio.value"
        name="dietType"
        :value="dietTypeRadio.value"
        :label="dietTypeRadio.label"
        v-model="dietType"
      />
    </div> -->
  </div>
</template>

<script setup lang="ts">
import type { DietType, RecipeSuggestion } from "~/lib/models";

const props = defineProps<{
  basketId: string;
}>();
const emit = defineEmits<{ suggest: [RecipeSuggestion] }>();

const wizardUrl = computed(() => `/basket/${props.basketId}/recipe-wizard`);

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
