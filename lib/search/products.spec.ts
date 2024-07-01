import { describe, expect, it } from "vitest";
import { cleanupSearchQuery } from "./products";

describe("Products", () => {
  it("should cleanup query", () => {
    expect(cleanupSearchQuery("Eier")).toBe("Eier");
    expect(cleanupSearchQuery("Eier (Größe M)")).toBe("Eier");
    expect(cleanupSearchQuery("(kleine) Eier (Größe M)")).toBe("Eier");
  });
});
