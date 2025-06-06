import { describe, it, expect, vi } from "vitest";
import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import Page from "./[shareToken].vue";

const { useFetchSharedBasketMock } = vi.hoisted(() => ({
  useFetchSharedBasketMock: vi.fn(() => ({ error: "error" })),
}));

mockNuxtImport("useFetchSharedBasket", () => useFetchSharedBasketMock);

describe("BasketShared page", () => {
  it("show error if cant load data", async () => {
    const { queryByText } = await renderSuspended(Page);

    expect(queryByText("Konnte Warenkorb nicht laden!")).toBeTruthy();
  });

  it("show data", async () => {
    useFetchSharedBasketMock.mockImplementation(() => ({
      data: { basket: mockBasket() },
      error: null as any,
    }));
    const { getByRole, queryByText } = await renderSuspended(Page);

    expect(getByRole("heading", { name: "1. Jan. 00" })).toBeTruthy();
    expect(queryByText("Konnte Warenkorb nicht laden!")).toBeNull();
  });
});
