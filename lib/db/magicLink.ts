import { sql } from "@vercel/postgres";

export async function insertMagicLink(
  token: string,
  user_id: string,
  expiresAt: Date,
) {
  const linkInsert = await sql`
  INSERT INTO MagicLink (token, user_id, expires_at)
  VALUES (${token}, ${user_id}, ${expiresAt.toISOString()})
  RETURNING id`;

  if (!linkInsert.rows.length) {
    throw new Error("Could not find inserted link");
  }

  return linkInsert.rows[0];
}

export async function findMagicLink(token: string) {
  const linkSelect = await sql`
    SELECT ml.id, u.id as user_id, u.email as email, ml.expires_at
    FROM MagicLink ml
    JOIN AppUser u ON ml.user_id = u.id
    WHERE token = ${token}`;

  return linkSelect.rows[0];
}

export async function findMagicLinkByUser(userId: string) {
  const linkSelect = await sql`
    SELECT *
    FROM MagicLink
    WHERE user_id = ${userId}
    LIMIT 1`;

  return linkSelect.rows[0];
}

export async function deleteMagicLink(id: number) {
  await sql`DELETE FROM MagicLink WHERE id = ${id}`;
}

export async function deleteMagicLinkFromUser(userId: number) {
  await sql`DELETE FROM MagicLink WHERE user_id = ${userId}`;
}
