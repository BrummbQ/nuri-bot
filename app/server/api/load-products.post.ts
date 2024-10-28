import { protectApiRoute, sessionToken } from "~/lib/auth";

interface LoadProductsBody {
  marketId: string;
}

export async function loadProducts(marketId: string, token: string) {
  const result = await $fetch<void>(
    `${process.env.PRODUCTS_API}/api/v1/products/load`,
    {
      method: "POST",
      headers: { authorization: `Bearer ${token}` },
      body: {
        marketId,
      },
    },
  );
  return result;
}

/**
 * Load all products from rewe market to db
 */
export default defineEventHandler(async (event): Promise<void> => {
  protectApiRoute(event.context.auth);
  const body = await readBody<LoadProductsBody>(event);

  try {
    await loadProducts(body.marketId, sessionToken(event));
  } catch (e) {
    console.error("Product Api error:", e);
    throw createError({
      statusCode: 500,
      statusMessage: "Could not load products",
    });
  }

  return;
});
