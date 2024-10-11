import { verifySession } from "~/lib/auth";
import type { AuthContext } from "~/lib/auth";

export default defineEventHandler(async (event) => {
  // Get the current route
  const route = event.node.req.url;

  const sessionToken = await getCookie(event, "sessionToken");
  const userId = await verifySession(route, sessionToken);

  // attach auth if user logged in
  if (userId != null) {
    event.context.auth = { userId } as AuthContext;
  }
});
