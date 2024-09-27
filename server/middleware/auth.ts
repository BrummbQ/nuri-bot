import { verifySession } from "~/lib/auth";
import type { AuthContext } from "~/lib/auth";

// const publicRoutes = [
//   "/api/auth/magic-link",
//   "/api/auth/verify",
//   "/auth/login",
//   "/auth/verify",
//   // protected by cron secret
//   "/api/cron/create-recipe-menu",
// ];

export default defineEventHandler(async (event) => {
  // Get the current route
  const route = event.node.req.url;

  // // dont check public routes
  // for (let publicRoute of publicRoutes) {
  //   if (route != null && (route.startsWith(publicRoute) || route === "/")) {
  //     return;
  //   }
  // }

  const sessionToken = await getCookie(event, "sessionToken");
  const userId = await verifySession(route, sessionToken);
  // if (userId == null) {
  //   // api route throws 401
  //   if (route?.startsWith("/api")) {
  //     throw createError({
  //       statusCode: 401,
  //       statusMessage: "Invalid or expired session token",
  //     });
  //   }
  //   // If not authenticated, redirect to login page
  //   return sendRedirect(event, "/auth/login");
  // }

  // attach auth if user logged in
  if (userId != null) {
    event.context.auth = { userId } as AuthContext;
  }
});
