import { verifySession } from "~/lib/auth";

const publicRoutes = [
  "/api/auth/magic-link",
  "/api/auth/verify",
  "/auth/login",
  "/auth/verify",
];

export default defineEventHandler(async (event) => {
  // Get the current route
  const route = event.node.req.url;

  // dont check public routes
  for (let publicRoute of publicRoutes) {
    if (route != null && (route.startsWith(publicRoute) || route === "/")) {
      return;
    }
  }

  const userId = await verifySession(event);
  if (userId == null) {
    // api route throws 401
    if (route?.startsWith("/api")) {
      throw createError({
        statusCode: 401,
        statusMessage: "Invalid or expired session token",
      });
    }
    // If not authenticated, redirect to login page
    return sendRedirect(event, "/auth/login");
  }

  event.context.auth = { userId };
});
