import type { ReweProduct } from "~/lib/models";
import { getEmbedding, searchProducts } from "~/lib/search";

interface LoadProductsBody {
  marketId: string;
}

/**
 * Load all products from rewe market to db
 */
export default defineEventHandler(async (event): Promise<void> => {
  const body = await readBody<LoadProductsBody>(event);

  try {
    //await loadProducts(body.marketId);
    console.log("Loaded all products");
    //await loadEmbeddings(body.marketId);
  } catch (e) {
    console.error("DB error:", e);
    throw createError({
      statusCode: 500,
      statusMessage: "Could not load products",
    });
  }

  return;
});
