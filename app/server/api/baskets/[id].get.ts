import {
  protectApiRoute,
  protectBasketApiRoute,
  sessionToken,
} from "~/lib/auth";
import { getBasket } from "~/lib/basket";
import type { GetBasketResponse } from "~/lib/models";

export default defineEventHandler(async (event): Promise<GetBasketResponse> => {
  protectApiRoute(event.context.auth);
  const basketId = getRouterParam(event, "id");
  if (basketId == null) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing route parameter basket id",
    });
  }

  const basket = await getBasket(basketId, sessionToken(event));

  protectBasketApiRoute(event, basket);

  return { basket };
});
