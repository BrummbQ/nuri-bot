import { sql } from "@vercel/postgres";
import { v4 as uuidv4 } from "uuid";

export async function insertBasket(
  userId: string,
  basketId = uuidv4(),
): Promise<string> {
  await sql`INSERT INTO Basket (id, user_id) VALUES (${basketId}, ${userId})`;
  console.log("Created basket", basketId);
  return basketId;
}

export async function getBasketsByUserId(userId: string) {
  return await sql`SELECT * FROM Basket WHERE user_id = ${userId} ORDER BY created_at DESC`;
}

export async function getBasketById(id: string) {
  const basketResponse = await sql`SELECT * FROM Basket WHERE id = ${id}`;
  return basketResponse.rows[0];
}
