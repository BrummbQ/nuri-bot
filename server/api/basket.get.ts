import { protectApiRoute } from "~/lib/auth";
import { getBasket } from "~/lib/basket";
import type { GetBasketQuery, GetBasketResponse } from "~/lib/models";

export default defineEventHandler(async (event): Promise<GetBasketResponse> => {
  protectApiRoute(event.context.auth);
  const query = await getQuery<GetBasketQuery>(event);
  const basket = await getBasket(query.basketId);

  return { basket };
});
