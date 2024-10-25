import { protectApiRoute } from "~/lib/auth";
import { updateListingInBasket } from "~/lib/basket";
import type { IngredientsOrderBody } from "~/lib/models";

export default defineEventHandler(async (event) => {
  protectApiRoute(event.context.auth);
  const body = await readBody<IngredientsOrderBody>(event);

  // add each ingredient to rewe basket
  for (let i of body.ingredients) {
    const selectedProducts = i.selectedProducts?.filter(
      (sP) => sP.product != null,
    );
    if (!selectedProducts) {
      continue;
    }
    // add all products for each ingredient
    for (let selectedProduct of selectedProducts) {
      const listingId = selectedProduct.product.listing_id;
      if (listingId == null) {
        throw new Error("No listing id found");
      }

      if (selectedProduct.quantity < 1) {
        continue;
      }

      // add product to basket
      await updateListingInBasket(
        listingId,
        selectedProduct.quantity,
        body.reweCookies,
      );
      console.log(
        "Added product",
        selectedProduct.quantity,
        selectedProduct.product.name,
      );
    }
  }
});
