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

const route = useRoute("basket-id-ordered");

const { data, error } = await useFetchBasket(route.params.id);
const { postOrderIngredients, shareBasket } = useApi();
const { reweCookieDataValue, resetReweCookieData } = useBasketStore();
const orderAgainLoading = ref(false);
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
  try {
    const { shareUrl } = await shareBasket(route.params.id);
    const shareData = {
      title: `Nuri Warenkorb`,
      url: shareUrl,
    };

    await navigator.share(shareData);
  } catch (e) {
    const isAbort = e instanceof Error && e.name === "AbortError";
    if (!isAbort) {
      console.error(e);
      addNotification({
        severity: "error",
        message: "Teilen nicht möglich!",
      });
    }
  }
}
</script>
