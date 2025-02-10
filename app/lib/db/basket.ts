import { query } from "./db";
import { v4 as uuidv4 } from "uuid";

export async function insertBasket(
  userId: string,
  basketId = uuidv4(),
): Promise<string> {
  await query(`INSERT INTO Basket (id, user_id) VALUES ($1, $2)`, [
    basketId,
    userId,
  ]);
  console.log("Created basket", basketId);
  return basketId;
}

export async function getBasketsByUserId(userId: string) {
  return await query(
    `SELECT * FROM Basket WHERE user_id = $1 ORDER BY created_at DESC`,
    [userId],
  );
}

export async function getBasketById(id: string) {
  const basketResponse = await query(`SELECT * FROM Basket WHERE id = $1`, [
    id,
  ]);
  return basketResponse.rows[0];
}
