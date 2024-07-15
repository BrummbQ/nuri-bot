import { describe, expect, it } from "vitest";
import { setup, fetch } from "@nuxt/test-utils/e2e";

describe("Auth", async () => {
  await setup();

  it("should not auth public routes", async () => {
    const { status } = await fetch("/", { redirect: "manual" });
    expect(status).toBe(200);
  });

  it("should auth protected routes", async () => {
    const { status, headers } = await fetch("/user/123/basket", {
      redirect: "manual",
    });
    expect(status).toBe(302);
    expect(headers.get("location")).toEqual("/auth/login");
  });
});
