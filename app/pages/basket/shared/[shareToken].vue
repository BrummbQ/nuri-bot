<template>
  <BasketDetail
    v-if="data?.basket"
    :basket="data.basket"
    :orderAgainLoading="orderAgainLoading"
    @orderAgain="orderAgain()"
    @share="share()"
  />
  <p v-if="error" class="mt-5 text-center font-bold">
    Konnte Warenkorb nicht laden!
  </p>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["auth"],
});

const route = useRoute("basket-shared-shareToken");

const { data, error } = await useFetchSharedBasket(route.params.shareToken);
const { postOrderIngredients } = useApi();
const { reweCookieDataValue, resetReweCookieData } = useBasketStore();
const orderAgainLoading = ref(false);
const url = useRequestURL();
const { addNotification } = useNotification();

async function orderAgain() {
  orderAgainLoading.value = true;
  try {
    await postOrderIngredients(
      data.value?.basket.ingredientsWithProducts,
      reweCookieDataValue.value,
    );
  } catch (e) {
    resetReweCookieData();
    throw createError({ statusMessage: "Could not order", fatal: true });
  } finally {
    orderAgainLoading.value = false;
  }
}

async function share() {
  const shareData = {
    title: `Nuri Warenkorb`,
    url: url.toString(),
  };
  try {
    await navigator.share(shareData);
  } catch (err) {
    const isAbort = err instanceof Error && err.name === "AbortError";
    if (!isAbort) {
      console.error(err);
      addNotification({ severity: "error", message: "Teilen nicht möglich!" });
    }
  }
}
</script>
