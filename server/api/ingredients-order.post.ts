import type { IngredientsOrderBody } from "~/lib/models";

async function updateListingInBasket(
  listingId: string,
  quantity: number,
  cookie: string,
) {
  const headers = {
    accept: "application/vnd.com.rewe.digital.basket-v2+json",
    cookie,
  };

  return await $fetch(
    `https://shop.rewe.de/api/baskets/listings/${listingId}`,
    {
      method: "POST",
      headers,
      body: {
        quantity,
        includeTimeslot: false,
        context: "product-list-search",
      },
    },
  );
}

export default defineEventHandler(async (event) => {
  const body = await readBody<IngredientsOrderBody>(event);

  // add each ingredient to rewe basket
  for (let i of body.ingredients) {
    if (!i.selectedProducts) {
      continue;
    }
    // add all products for each ingredient
    for (let selectedProduct of i.selectedProducts) {
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
        selectedProduct.product,
        response,
      );
    }
  }
});
