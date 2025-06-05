import { protectApiRoute, sessionToken } from "~/lib/auth";
import { getSharedBasket } from "~/lib/basket";
import type { GetBasketResponse } from "~/lib/models";

export default defineEventHandler(async (event): Promise<GetBasketResponse> => {
  protectApiRoute(event.context.auth);
  const shareToken = getRouterParam(event, "shareToken");
  if (shareToken == null) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing route parameter share token",
    });
  }

  const basket = await getSharedBasket(shareToken, sessionToken(event));

  return { basket };
});
