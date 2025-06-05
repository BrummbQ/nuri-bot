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

export async function getBasketByShareToken(shareToken: string) {
  const basketResponse = await query(
    `SELECT b.* FROM Basket b
     JOIN BasketShare bs ON b.id = bs.basket_id
     WHERE bs.share_token = $1 AND (bs.expires_at IS NULL OR bs.expires_at > NOW())`,
    [shareToken],
  );
  if (!basketResponse.rowCount) {
    return null; // No basket found for the share token
  }
  return basketResponse.rows[0];
}

export async function insertBasketShare(id: string): Promise<string> {
  const expires_at = null;
  const role = "viewer"; // Default role is viewer

  // 1. Check for existing share
  const existing = await query(
    `
    SELECT share_token FROM BasketShare
    WHERE basket_id = $1 AND role = $2
      AND (expires_at IS NULL OR expires_at > NOW())
    LIMIT 1;
  `,
    [id, role],
  );

  if (existing.rowCount != null && existing.rowCount > 0) {
    return existing.rows[0].share_token;
  }

  // 2. Otherwise create a new one
  const shareToken = uuidv4();
  await query(
    `
      INSERT INTO BasketShare (basket_id, share_token, role, expires_at)
      VALUES ($1, $2, $3, $4)
      RETURNING share_token;
    `,
    [id, shareToken, role, expires_at],
  );

  return shareToken;
}
