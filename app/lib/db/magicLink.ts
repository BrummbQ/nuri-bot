import { query } from "./db";

export async function insertMagicLink(
  token: string,
  user_id: string,
  expiresAt: Date,
) {
  const linkInsert = await query(
    `
  INSERT INTO MagicLink (token, user_id, expires_at)
  VALUES ($1, $2, $3)
  RETURNING id`,
    [token, user_id, expiresAt.toISOString()],
  );

  if (!linkInsert.rows.length) {
    throw new Error("Could not find inserted link");
  }

  return linkInsert.rows[0];
}

export async function findMagicLink(token: string) {
  const linkSelect = await query(
    `
    SELECT ml.id, u.id as user_id, u.email as email, ml.expires_at
    FROM MagicLink ml
    JOIN AppUser u ON ml.user_id = u.id
    WHERE token = $1`,
    [token],
  );

  return linkSelect.rows[0];
}

export async function findMagicLinkByUser(userId: string) {
  const linkSelect = await query(
    `
    SELECT *
    FROM MagicLink
    WHERE user_id = $1
    LIMIT 1`,
    [userId],
  );

  return linkSelect.rows[0];
}

export async function deleteMagicLink(id: number) {
  await query(`DELETE FROM MagicLink WHERE id = $1`, [id]);
}

export async function deleteMagicLinkFromUser(userId: number) {
  await query(`DELETE FROM MagicLink WHERE user_id = $1`, [userId]);
}
