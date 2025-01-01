import { marketIdKey } from "~/lib/models";

/**
 * Extract market id from local storage
 */
export default function (): string | undefined {
  if (!import.meta.client) {
    return undefined;
  }
  return localStorage.getItem(marketIdKey) ?? undefined;
}
