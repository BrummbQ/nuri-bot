import { it, expect, describe } from "vitest";
import { renderSuspended } from "@nuxt/test-utils/runtime";
import { BasketShoppingListOverview } from "#components";

describe("BasketShoppingListOverview", () => {
  it("render shopping list", async () => {
    const mockBasket = {
      basketId: "test-basket",
      ingredientsWithProducts: [
        { productName: "Banana", quantity: 3, products: [], recipes: [] },
        { productName: "Apfel", quantity: 2, products: [], recipes: [] },
      ],
      recipes: [],
    };

    const result = await renderSuspended(BasketShoppingListOverview, {
      props: { basket: mockBasket },
    });
    const listItems = result.getAllByRole("checkbox");
    expect(listItems.length).toBe(2);
    expect(listItems[0].id).toBe("Apfel");
    expect(listItems[1].id).toBe("Banana");
  });
});
