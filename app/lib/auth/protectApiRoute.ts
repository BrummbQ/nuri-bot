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
