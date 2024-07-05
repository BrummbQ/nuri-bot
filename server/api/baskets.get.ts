import { verifySession } from "~/lib/auth";
import { getBaskets } from "~/lib/basket";
import type { GetBasketsResponse } from "~/lib/models";

export default defineEventHandler(
  async (event): Promise<GetBasketsResponse> => {
    const userId = await verifySession(event);
    if (userId == null) {
      throw createError({
        statusCode: 401,
        statusMessage: "Invalid or expired session token",
      });
    }
    const baskets = await getBaskets(userId);

    return { baskets };
  },
);
