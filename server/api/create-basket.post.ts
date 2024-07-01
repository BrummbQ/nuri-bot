import { createBasket } from "~/lib/basket";
import type { CreateBasketBody, CreateBasketResponse } from "~/lib/models";

export default defineEventHandler(
  async (event): Promise<CreateBasketResponse> => {
    const body = await readBody<CreateBasketBody>(event);

    const basketId = await createBasket(body.ingredients);

    return { basketId };
  },
);
