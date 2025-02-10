import { expect } from "vitest";
import { fetch } from "@nuxt/test-utils/e2e";
import { findUserByEmail, findMagicLinkByUser } from "~/lib/db";
import { createSessionToken } from "~/lib/auth";

export async function sendMagicLink(
  testmail: string,
): Promise<{ token: string; user: any }> {
  const { status, statusText } = await fetch("/api/auth/magic-link", {
    headers: { "Content-Type": "application/json" },
    method: "POST",
    body: JSON.stringify({ email: testmail }),
  });

  expect(status).toBe(200);
  expect(statusText).toEqual("OK");
  const user = await findUserByEmail(testmail);
  expect(user.email).toBe(testmail);
  const magicLink = await findMagicLinkByUser(user.id);
  expect(magicLink.token.length).toBe(128);

  return { token: magicLink.token, user };
}

export async function verifyToken(
  token: string,
  testmail: string,
  userId: string,
) {
  const verifyResult = await fetch("/api/auth/verify", {
    headers: { "Content-Type": "application/json" },
    method: "POST",
    body: JSON.stringify({ token }),
  });
  expect(verifyResult.status).toBe(200);
  const verifyJson = await verifyResult.json();
  expect(verifyJson).toEqual({
    email: testmail,
    userId,
    sessionExpiresAt: expect.any(Number),
  });
}

export async function loginUser(
  testmail: string,
): Promise<{ sessionToken: string; user: any }> {
  const { token, user } = await sendMagicLink(testmail);
  await verifyToken(token, testmail, user.id);
  const sessionToken = createSessionToken(user.id, 1000);
  return { sessionToken, user };
}
