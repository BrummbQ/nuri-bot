import type {
  IngredientWithProducts,
  IngredientsSearchBody,
  IngredientsSearchResponse,
  ReweProductsResponse,
} from "~/lib/models";

async function searchProducts(
  search: string,
  market: string,
): Promise<ReweProductsResponse> {
  const result = await $fetch<ReweProductsResponse>(
    "https://shop.rewe.de/api/products",
    {
      query: {
        search,
        objectsPerPage: 10,
        serviceTypes: "PICKUP",
        sorting: "TOPSELLER_DESC",
        page: 1,
        market,
      },
    },
  );
  return result;
}

export default defineEventHandler(
  async (event): Promise<IngredientsSearchResponse> => {
    const body = await readBody<IngredientsSearchBody>(event);

    const responseIngredients: IngredientWithProducts[] = await Promise.all(
      body.ingredients.map(async (ingredient) => {
        const productResponse = await searchProducts(
          ingredient.productName,
          body.market,
        );
        const products = productResponse._embedded.products;
        return { ...ingredient, products };
      }),
    );

    return { ingredients: responseIngredients };
  },
);
