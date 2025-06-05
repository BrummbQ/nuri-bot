import { insertBasketShare } from "../db";

export async function shareBasket(basketId: string): Promise<string> {
  return await insertBasketShare(basketId);
}
