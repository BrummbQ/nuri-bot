export default function formatCurrency(
  price: number,
  currency: string,
): string {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: currency,
  }).format(price / 100);
}
