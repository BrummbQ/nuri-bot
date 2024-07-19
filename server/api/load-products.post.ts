import { lastFetchedProductByMarket } from "~/lib/db";
import { loadProducts } from "~/lib/search";
import { daysAgo } from "~/lib/utils/date";

interface LoadProductsBody {
  marketId: string;
}

/**
 * Load all products from rewe market to db
 */
export default defineEventHandler(async (event): Promise<void> => {
  const body = await readBody<LoadProductsBody>(event);

  try {
    const lastFetched = await lastFetchedProductByMarket(body.marketId);
    let fetchProducts = true;
    // skip fetch if last import less then 7 days ago
    if (lastFetched != null) {
      const oneWeekAgo = daysAgo();
      fetchProducts = lastFetched < oneWeekAgo;
    }
    if (fetchProducts) {
      console.time("Load products");
      await loadProducts(body.marketId);
      console.timeEnd("Load products");
    }
  } catch (e) {
    console.error("DB error:", e);
    throw createError({
      statusCode: 500,
      statusMessage: "Could not load products",
    });
  }

  return;
});
