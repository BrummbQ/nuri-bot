import { getBasketsOverview } from "~/lib/basket";
import type { GetBasketsResponse } from "~/lib/models";

export default defineEventHandler(
  async (event): Promise<GetBasketsResponse> => {
    const { userId } = event.context.auth;
    const baskets = await getBasketsOverview(userId);

    return { baskets };
  },
);
