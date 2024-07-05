import jwt from "jsonwebtoken";
import { deleteMagicLink, findMagicLink } from "~/lib/db";

interface VerifyBody {
  token: string;
}

export default defineEventHandler(async (event) => {
  const body = await readBody<VerifyBody>(event);
  const { token } = body;

  if (!token) {
    throw createError({
      statusCode: 400,
      statusMessage: "Token is required",
    });
  }

  const magicLink = await findMagicLink(token);
  if (magicLink == null || magicLink.expires_at < new Date()) {
    throw createError({
      statusCode: 401,
      statusMessage: "Invalid or expired token",
    });
  }

  await deleteMagicLink(magicLink.id);

  // 7 days expire
  const expiresIn = 60 * 60 * 24 * 7;
  const sessionToken = jwt.sign(
    { userId: magicLink.user_id },
    process.env.JWT_SECRET!,
    { expiresIn },
  );

  setCookie(event, "sessionToken", sessionToken, {
    secure: true,
    httpOnly: true,
  });

  const sessionExpiresAt = Date.now() + expiresIn * 1000;
  return {
    userId: magicLink.user_id,
    email: magicLink.email,
    sessionExpiresAt,
  };
});