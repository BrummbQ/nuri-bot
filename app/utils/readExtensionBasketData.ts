import {
  extensionBasketDataKey,
  type ReweBasketCookieData,
} from "~/lib/models";

/**
 * Read rewe cookies from local storage (after set by extension)
 */
export default function (): ReweBasketCookieData[] | undefined {
  if (!import.meta.client) {
    return undefined;
  }
  const data = localStorage.getItem(extensionBasketDataKey);
  if (data) {
    return JSON.parse(data);
  }

  return undefined;
}
