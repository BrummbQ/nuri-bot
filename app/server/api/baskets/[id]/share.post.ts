import { protectApiRoute } from "~/lib/auth";
import { shareBasket } from "~/lib/basket/share-basket";
import type { ShareBasketResponse } from "~/lib/models";
import { getAppUrl } from "~/lib/utils/url";

export default defineEventHandler(
  async (event): Promise<ShareBasketResponse> => {
    protectApiRoute(event.context.auth);
    const basketId = getRouterParam(event, "id");
    if (basketId == null) {
      throw createError({
        statusCode: 400,
        statusMessage: "Missing route parameter basket id",
      });
    }

    const shareToken = await shareBasket(basketId);
    const appUrl = getAppUrl();

    return {
      shareUrl: `${appUrl}/basket/shared/${shareToken}`,
    };
  },
);
