import type { H3Event } from "h3";
import jwt from "jsonwebtoken";
import { findUserById } from "../db";

export async function verifySession(
  event: H3Event,
): Promise<string | undefined> {
  const sessionToken = await getCookie(event, "sessionToken");
  if (sessionToken == null) {
    return undefined;
  }

  try {
    const decoded = jwt.verify(sessionToken, process.env.JWT_SECRET!) as {
      userId: string;
    };

    const result = await findUserById(decoded.userId);

    if (result == null) {
      console.error("Did not find user for session token");
      return undefined;
    }

    return result.id;
  } catch (error) {
    return undefined;
  }
}
