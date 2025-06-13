export type RecipeCategory =
  | "Appetizer"
  | "Main"
  | "Side"
  | "Dessert"
  | "Snack"
  | "Breakfast"
  | "Drink"
  | "Sauce"
  | "Other";

export type RecipeCategorization = {
  category: RecipeCategory;
  cuisine: string;
  complexity: "Easy" | "Medium" | "Hard";
  cost: "Low" | "Medium" | "High";
  season: "Spring" | "Summer" | "Autumn" | "Winter" | "All Year";
  dietary: string[];
};
