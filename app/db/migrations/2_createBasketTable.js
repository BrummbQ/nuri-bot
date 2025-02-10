import { query } from "./db.js";
import dotenv from "dotenv";

dotenv.config({ path: [".env.development.local"] });

try {
  await query(`
CREATE TABLE IF NOT EXISTS Basket (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES AppUser(id)
);
`);

  await query(`CREATE TYPE recipe_source AS ENUM ('REWE', 'GENERATED');`);

  await query(`
CREATE TABLE IF NOT EXISTS Recipe (
    id SERIAL PRIMARY KEY,
    external_id VARCHAR(255) UNIQUE NOT NULL,
    recipe JSONB NOT NULL,
    source recipe_source NOT NULL, 
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by UUID NULL,
    FOREIGN KEY (created_by) REFERENCES AppUser(id)
);
`);

  await query(`
CREATE TABLE IF NOT EXISTS Ingredient (
    id SERIAL PRIMARY KEY,
    basket_id UUID NOT NULL,
    ingredient JSONB NOT NULL,
    FOREIGN KEY (basket_id) REFERENCES Basket(id)
);
`);

  await query(`
CREATE INDEX IF NOT EXISTS ingredient_basket_id_idx ON Ingredient (basket_id);
  `);

  await query(`
CREATE TABLE IF NOT EXISTS Ingredient_Recipe (
    recipe_id SERIAL NOT NULL,
    ingredient_id SERIAL NOT NULL,
    PRIMARY KEY (recipe_id, ingredient_id),
    FOREIGN KEY (recipe_id) REFERENCES Recipe(id),
    FOREIGN KEY (ingredient_id) REFERENCES Ingredient(id)
);
`);

  await query(`
CREATE INDEX IF NOT EXISTS ingredient_recipe_ingredient_id_idx ON Ingredient_Recipe (ingredient_id);
  `);

  await query(`
CREATE TABLE IF NOT EXISTS Ingredient_Product (
    ingredient_id SERIAL NOT NULL,
    product_id VARCHAR(255) NOT NULL,
    quantity INT NOT NULL,
    PRIMARY KEY (ingredient_id, product_id),
    FOREIGN KEY (ingredient_id) REFERENCES Ingredient(id)
);
`);

  await query(`
CREATE TABLE IF NOT EXISTS AppUser_Recipe_Likes (
    recipe_id SERIAL NOT NULL,
    user_id UUID NOT NULL,
    PRIMARY KEY (recipe_id, user_id),
    FOREIGN KEY (recipe_id) REFERENCES Recipe(id),
    FOREIGN KEY (user_id) REFERENCES AppUser(id)
);
`);

  await query(`
CREATE TABLE IF NOT EXISTS Menu (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
`);

  await query(`
CREATE TABLE IF NOT EXISTS Recipe_Menu (
    menu_id SERIAL NOT NULL,
    recipe_id SERIAL NOT NULL,
    searchterm VARCHAR(255) NOT NULL,
    PRIMARY KEY (menu_id, recipe_id),
    FOREIGN KEY (menu_id) REFERENCES Menu(id),
    FOREIGN KEY (recipe_id) REFERENCES Recipe(id)
);
`);

  console.log("Created table");
} catch (error) {
  console.error(error);
}
