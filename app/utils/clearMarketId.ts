import { marketIdKey } from "~/lib/models";

export default function (): void {
  if (!import.meta.client) {
    return;
  }
  localStorage.removeItem(marketIdKey);
}
