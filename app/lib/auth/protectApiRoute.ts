import type { Basket } from "../models";
import type { AuthContext } from "./auth-context";
import type { H3Event } from "h3";

export const protectApiRoute = (context?: AuthContext) => {
  if (context?.userId == null) {
    throw createError({
      statusCode: 401,
      statusMessage: "Invalid or expired session token",
    });
  }
};

export const sessionToken = (event: H3Event): string => {
  return getCookie(event, "sessionToken")!;
};

export const protectBasketApiRoute = (event: H3Event, basket: Basket) => {
  if (basket.userId !== event.context.auth.userId) {
    throw createError({
      statusCode: 403,
      statusMessage: "You are not allowed to access this basket",
    });
  }
};
