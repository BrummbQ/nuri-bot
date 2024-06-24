import type { BasketData } from "~/lib/models";

export default function (data: BasketData[]): string | undefined {
  const cookieStrList = data.map((c) => `${c.name}=${c.value}`);
  return cookieStrList.join("; ");
}
