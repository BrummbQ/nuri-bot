import type { ProductGrammage, ReweProduct } from "~/lib/models";

export default function (product: ReweProduct): ProductGrammage | undefined {
  if (product._embedded.articles.length) {
    const grammage =
      product._embedded.articles[0]._embedded.listing.pricing.grammage;

    const match = grammage?.match(/^(\d+)\s*([a-zA-ZäöüÄÖÜß]*)/);
    if (match == null) {
      return;
    }

    const quantity = parseInt(match[1]);
    const unit = match[2].trim();

    if (!unit) {
      return;
    }

    return { unit, quantity };
  }
}
