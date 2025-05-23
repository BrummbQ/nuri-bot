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
      try {
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
      } catch (e: any) {
        console.error("Error adding product", selectedProduct.product.name, e);
        // continue on 400 errors, some products might not be available anymore
        if (e.response?.status === 400) {
          console.error("Bad Request (400) adding product:", e.response._data);
          continue;
        }

        throw createError({
          statusCode: 500,
          statusMessage: "Error adding product to basket",
        });
      }
    }
  }
});
