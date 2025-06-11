import { beforeEach, describe, expect, it } from "vitest";
import { setup, fetch } from "@nuxt/test-utils/e2e";
import {
  findUserByEmail,
  deleteMagicLinkFromUser,
  deleteUserByEmail,
} from "~/lib/db";
import { loginUser } from "./auth-helper";

const testmail = "testuser1@nuribot.de";

describe("Auth", async () => {
  await setup();

  beforeEach(async () => {
    const user = await findUserByEmail(testmail);
    if (user) {
      await deleteMagicLinkFromUser(user.id);
      await deleteUserByEmail(testmail);
    }
  });

  it("should not auth public routes", async () => {
    const { status } = await fetch("/", { redirect: "manual" });
    expect(status).toBe(200);
  });

  it("should auth protected routes", async () => {
    const { status, headers } = await fetch("/user/123/basket", {
      redirect: "manual",
    });
    expect(status).toBe(302);
    expect(headers.get("location")).toEqual(
      "/auth/login?redirect=/user/123/basket",
    );
  });

  it("should auth protected api routes", async () => {
    const { status } = await fetch("/api/baskets");
    expect(status).toBe(401);
  });

  it("should access protected route", async () => {
    const { sessionToken, user } = await loginUser(testmail);

    const { status } = await fetch(`/user/${user.id}/basket`, {
      redirect: "manual",
      headers: { Cookie: `sessionToken=${sessionToken}` },
    });
    expect(status).toBe(200);
  });

  it("should not access protected route from other user", async () => {
    const { sessionToken } = await loginUser(testmail);

    const { status } = await fetch(
      `/user/b7be74b4-9796-48b6-b93a-edb5b8d9aba8/basket`,
      {
        redirect: "manual",
        headers: { Cookie: `sessionToken=${sessionToken}` },
      },
    );
    expect(status).toBe(302);
  });
});
