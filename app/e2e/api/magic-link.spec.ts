import { beforeEach, describe, expect, it } from "vitest";
import { setup, fetch } from "@nuxt/test-utils/e2e";
import {
  deleteMagicLinkFromUser,
  deleteUserByEmail,
  findMagicLinkByUser,
  findUserByEmail,
} from "~/lib/db";
import { sendMagicLink, verifyToken } from "./auth-helper";

const testmail = "testuser2@nuribot.de";

describe("Magic Link", async () => {
  await setup();

  beforeEach(async () => {
    const user = await findUserByEmail(testmail);
    if (user) {
      await deleteMagicLinkFromUser(user.id);
      await deleteUserByEmail(testmail);
    }
  });

  it("should not get link without mail", async () => {
    const { status, statusText } = await fetch("/api/auth/magic-link", {
      method: "POST",
    });
    expect(status).toBe(400);
    expect(statusText).toEqual("Email is required");
  });

  it("should send magic link and verify", async () => {
    const noUser = await findUserByEmail(testmail);
    expect(noUser).toBeUndefined();
    const { token, user } = await sendMagicLink(testmail);

    // verify
    await verifyToken(token, testmail, user.id);
    const noMagicLink = await findMagicLinkByUser(user.id);
    expect(noMagicLink).toBeUndefined();
  });
});
