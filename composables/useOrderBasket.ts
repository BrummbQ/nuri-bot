export default function (basketId: string) {
  const { createBasket, postOrderIngredients } = useApi();
  const {
    reweCookieDataValue,
    ingredientsWithProducts,
    completeCurrentBasket,
    recipes,
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

    try {
      const createBasketResponse = await createBasket({
        basketId,
        ingredients: ingredientsWithProducts.value,
        recipes: recipes.value,
      });

      await postOrderIngredients(
        ingredientsWithProducts.value,
        reweCookieDataValue.value,
      );

      await navigateTo(`/basket/${createBasketResponse.basketId}/ordered`);
      completeCurrentBasket();
    } catch (e) {
      console.error(e);
      throw createError({
        statusCode: 400,
        statusMessage: "Error ordering basket",
        fatal: true,
      });
    } finally {
      orderLoading.value = false;
    }
  }

  return { orderBasket, orderLoading };
}
