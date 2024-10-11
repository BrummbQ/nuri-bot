import type { AuthContext } from "./auth-context";

export const protectApiRoute = (context?: AuthContext) => {
  if (context?.userId == null) {
    throw createError({
      statusCode: 401,
      statusMessage: "Invalid or expired session token",
    });
  }
};
