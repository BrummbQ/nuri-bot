export default function (basketId: string) {
  const { createBasket, postOrderIngredients } = useApi();
  const {
    reweCookieDataValue,
    ingredientsWithProducts,
    completeCurrentBasket,
    recipes,
    resetReweCookieData,
  } = useBasketStore();

  const orderLoading = useState("orderLoading", () => false);

  async function orderBasket() {
    if (reweCookieDataValue.value == null) {
      throw createError({
        statusMessage: "No REWE cookies available",
        fatal: true,
      });
    }

    if (ingredientsWithProducts.value == null) {
      throw createError({
        statusMessage: "No products available",
        fatal: true,
      });
    }

    orderLoading.value = true;

    // first order ingredients in rewe basket
    try {
      await postOrderIngredients(
        ingredientsWithProducts.value,
        reweCookieDataValue.value,
      );
    } catch (e) {
      // if we have an error, reset the rewe cookie data
      console.error(e);
      resetReweCookieData();
      orderLoading.value = false;
      throw createError({
        statusCode: 400,
        statusMessage: "Error ordering ingredients",
        fatal: true,
      });
    }

    // then create our basket
    try {
      const createBasketResponse = await createBasket({
        basketId,
        ingredients: ingredientsWithProducts.value,
        recipes: recipes.value,
      });

      await navigateTo(`/basket/${createBasketResponse.basketId}/ordered`);
      completeCurrentBasket();
    } catch (e) {
      console.error(e);
      throw createError({
        statusCode: 400,
        statusMessage: "Error creating basket",
        fatal: true,
      });
    } finally {
      orderLoading.value = false;
    }
  }

  return { orderBasket, orderLoading };
}
