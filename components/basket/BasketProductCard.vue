<template>
  <UiCard
    :title="props.product.productName"
    class="border border-2 border-white"
    :class="{ '!border-primary': props.selectedQuantity }"
  >
    <template #cardimg>
      <img
        :src="productImg"
        alt="Product Image"
        width="80"
        height="80"
        class="self-center object-cover mt-4"
      />
      <div
        v-if="props.selectedQuantity"
        class="bg-black rounded-full w-10 h-10 flex items-center justify-center absolute right-2 top-2"
      >
        <Icon
          name="mdi:check"
          class="text-2xl text-white"
          :class="{ 'mr-2': $slots.default }"
        />
      </div>
    </template>
    <template #cardbody>
      <div v-if="productListing" class="flex items-center gap-2 grow">
        <UILabeledInfo
          icon-name="solar:tag-price-bold"
          :text="
            formatCurrency(
              productListing.pricing.currentRetailPrice,
              productListing.pricing.currency,
            )
          "
        />

        <UILabeledInfo
          icon-name="material-symbols:weight"
          :text="productListing.pricing.grammage"
        />
      </div>
    </template>
    <template #cardfooter>
      <div class="flex">
        <div class="flex items-center grow">
          <UiButton
            icon-name="fluent:subtract-16-regular"
            :disabled="props.selectedQuantity < 1"
            variant="outline"
            @click.stop="changeQuantity(-1)"
          />
          <span class="px-4">
            {{ props.selectedQuantity }}
          </span>
          <UiButton
            icon-name="fluent:add-16-regular"
            :disabled="props.selectedQuantity > 9"
            variant="outline"
            @click.stop="changeQuantity(1)"
          />
        </div>
        <UiButton type="button" variant="primary" @click="toggleProduct()">{{
          selectedQuantity ? "Abwählen" : "Wählen"
        }}</UiButton>
      </div>
    </template>
  </UiCard>
</template>

<script setup lang="ts">
import type { ReweProduct } from "~/lib/models";

const props = defineProps<{
  product: ReweProduct;
  selectedQuantity: number;
}>();
const emit = defineEmits<{
  quantityChanged: [quantity?: number];
}>();

const productImg = computed(() => {
  if (!props.product.media.images.length) {
    return "/images/placeholder.svg";
  }
  return (
    props.product.media.images[0]._links.self.href +
    "?resize=304px:304px&output-quality=80&output-format=webp&im=BackgroundColor,color=fffff"
  );
});

const productListing = computed(() => {
  const articles = props.product._embedded.articles;
  if (!articles.length) {
    return;
  }
  return articles[0]._embedded.listing;
});

const toggleProduct = () => {
  // if undefined parent must calculate quantity
  emit("quantityChanged", props.selectedQuantity ? 0 : undefined);
};

const changeQuantity = (delta: number) => {
  const quantity = props.selectedQuantity + delta;
  emit("quantityChanged", quantity);
};
</script>
