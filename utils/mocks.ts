import type { ReweProduct } from "~/lib/models";

export function mockProduct(grammage?: string): ReweProduct {
  return {
    _embedded: {
      articles: [
        {
          _embedded: {
            listing: {
              pricing: {
                currentRetailPrice: 179,
                currency: "EUR",
                basePrice: 716,
                baseUnit: { KG: 1 },
                grammage,
              },
            },
          },
        },
      ],
    },
  } as ReweProduct;
}
