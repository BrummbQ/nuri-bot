import type { ReweBasketCookieData } from "~/lib/models";

export default function (data: ReweBasketCookieData[]): string | undefined {
  const cookieStrList = data.map((c) => `${c.name}=${c.value}`);
  return cookieStrList.join("; ");
}
