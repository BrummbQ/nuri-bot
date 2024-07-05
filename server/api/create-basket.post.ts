import { verifySession } from "~/lib/auth";
import { createBasket } from "~/lib/basket";
import type { CreateBasketBody, CreateBasketResponse } from "~/lib/models";

export default defineEventHandler(
  async (event): Promise<CreateBasketResponse> => {
    const body = await readBody<CreateBasketBody>(event);

    const userId = await verifySession(event);
    if (userId == null) {
      throw createError({
        statusCode: 401,
        statusMessage: "Invalid or expired session token",
      });
    }

    const basketId = await createBasket(body.ingredients, userId);

    return { basketId };
  },
);
