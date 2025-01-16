import { protectApiRoute, sessionToken } from "~/lib/auth";
import { deleteListingInBasket, updateListingInBasket } from "~/lib/basket";
import { searchSimilarProducts } from "~/lib/search";

interface ValidateIngredientsOrderBody {
  marketId: string;
  reweCookies: string;
}

export default defineEventHandler(async (event) => {
  protectApiRoute(event.context.auth);
  const { marketId, reweCookies } =
    await readBody<ValidateIngredientsOrderBody>(event);

  const testIngredient = {
    quantity: 1,
    productName: "Milch",
    recipes: [],
  };

  const products = await searchSimilarProducts(
    testIngredient,
    marketId,
    sessionToken(event),
  );

  if (!products.length) {
    throw createError({
      statusCode: 500,
      statusMessage: "No products found in market",
    });
  }

  const listingId = products[0].listing_id;
  if (listingId == null) {
    throw new Error("No listing id found");
  }

  // add and remove product from basket for test
  const addResult = await updateListingInBasket(
    listingId,
    testIngredient.quantity,
    reweCookies,
  );
  await deleteListingInBasket(addResult.id, listingId, reweCookies);
});
