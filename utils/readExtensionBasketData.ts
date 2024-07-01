import type { ReweBasketCookieData } from "~/lib/models";

/**
 * Read rewe cookies from local storage (after set by extension)
 */
export default function (): ReweBasketCookieData[] | undefined {
  const data = localStorage.getItem("rewe-cookies");
  if (data) {
    return JSON.parse(data);
  }

  return undefined;
}
