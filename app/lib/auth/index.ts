import jwt from "jsonwebtoken";
import { findUserById } from "../db";

const jwtAlgorithm = "RS256";

export async function verifySession(
  url?: string,
  sessionToken?: string | null,
): Promise<string | undefined> {
  if (sessionToken == null) {
    console.log("No session token", url);
    return undefined;
  }

  try {
    const publicKey = Buffer.from(process.env.JWT_PUBLIC!, "base64").toString();
    const decoded = jwt.verify(sessionToken, publicKey, {
      algorithms: [jwtAlgorithm],
    }) as {
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
  const privateKey = Buffer.from(process.env.JWT_SECRET!, "base64").toString();
  return jwt.sign({ userId }, privateKey, {
    expiresIn,
    algorithm: jwtAlgorithm,
  });
}

export * from "./protectApiRoute";
export * from "./auth-context";
