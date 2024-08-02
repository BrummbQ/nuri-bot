import jwt from "jsonwebtoken";
import { findUserById } from "../db";

export async function verifySession(
  url?: string,
  sessionToken?: string | null,
): Promise<string | undefined> {
  if (sessionToken == null) {
    console.log("No session token", url);
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
    console.error(error);
    return undefined;
  }
}

export function createSessionToken(userId: string, expiresIn: number): string {
  return jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn });
}
