import { updateListingInBasket } from "~/lib/basket";
import type { IngredientsOrderBody } from "~/lib/models";

export default defineEventHandler(async (event) => {
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
      const articles = selectedProduct.product._embedded.articles;
      if (!articles.length) {
        throw new Error("No articles found");
      }

      const listing = articles[0]._embedded.listing;
      const listingId = listing.id;

      // add product to basket
      const response = await updateListingInBasket(
        listingId,
        selectedProduct.quantity,
        body.reweCookies,
      );
      console.log(
        "Added product",
        selectedProduct.quantity,
        selectedProduct.product.productName,
      );
    }
  }
});
