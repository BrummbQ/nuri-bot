<template>
  <UiCard
    :title="props.product.productName"
    @click="toggleProduct()"
    :class="{ '!bg-emerald-300': props.selectedQuantity }"
  >
    <template #cardimg>
      <img
        :src="productImg"
        alt="Product Image"
        width="50"
        height="50"
        class="self-center object-cover mt-4"
      />
    </template>
    <template #cardbody>
      <div v-if="productListing" class="flex items-center gap-2">
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
      <div class="flex flex-row items-center">
        <UiButton
          icon-name="fluent:subtract-16-regular"
          :disabled="props.selectedQuantity < 1"
          @click.stop="changeQuantity(-1)"
        />
        <span class="px-4">
          {{ props.selectedQuantity }}
        </span>
        <UiButton
          icon-name="fluent:add-16-regular"
          :disabled="props.selectedQuantity > 9"
          @click.stop="changeQuantity(1)"
        />
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
  quantityChanged: [quantity: number];
}>();

const productImg = computed(() => {
  if (!props.product.media.images.length) {
    return "/assets/placeholder.svg";
  }
  return props.product.media.images[0]._links.self.href;
});

const productListing = computed(() => {
  const articles = props.product._embedded.articles;
  if (!articles.length) {
    return;
  }
  return articles[0]._embedded.listing;
});

const toggleProduct = () => {
  if (props.selectedQuantity) {
    emit("quantityChanged", 0);
  } else {
    emit("quantityChanged", 1);
  }
};

const changeQuantity = (delta: number) => {
  const quantity = props.selectedQuantity + delta;
  emit("quantityChanged", quantity);
};
</script>
