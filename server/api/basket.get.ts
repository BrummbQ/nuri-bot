import { getBasket } from "~/lib/basket";
import type { GetBasketQuery, GetBasketResponse } from "~/lib/models";

export default defineEventHandler(async (event): Promise<GetBasketResponse> => {
  const query = await getQuery<GetBasketQuery>(event);

  const basket = await getBasket(query.basketId);

  return { basket };
});
