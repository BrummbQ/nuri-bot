import { createBasket } from "~/lib/basket";
import type { CreateBasketBody, CreateBasketResponse } from "~/lib/models";

export default defineEventHandler(
  async (event): Promise<CreateBasketResponse> => {
    const { recipes, ingredients } = await readBody<CreateBasketBody>(event);
    const { userId } = event.context.auth;

    const basketId = await createBasket(recipes, ingredients, userId);

    return { basketId };
  },
);
