import type { ReweBasketCookieData } from "~/lib/models";

/**
 * Extract market id from rewe cookies
 */
export default function (
  basketData?: ReweBasketCookieData[],
): string | undefined {
  if (basketData) {
    const marketsCookie = basketData.find((v) => v.name === "marketsCookie");
    if (marketsCookie) {
      const marketsCookieValue = JSON.parse(
        decodeURIComponent(marketsCookie.value),
      );
      return marketsCookieValue?.online?.wwIdent;
    }
  }

  return undefined;
}
