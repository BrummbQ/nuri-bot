import { query } from "./db";

export async function findUserById(userId: string) {
  const userSelect = await query(
    "SELECT * FROM AppUser WHERE id = $1 LIMIT 1",
    [userId],
  );
  return userSelect.rows[0];
}

export async function findUserByEmail(email: string) {
  const userSelect = await query(
    "SELECT * FROM AppUser WHERE email = $1 LIMIT 1",
    [email],
  );
  return userSelect.rows[0];
}

export async function findOrInsertUser(email: string) {
  const user = await findUserByEmail(email);
  if (user != null) {
    return user;
  }

  const userInsert = await query(
    `
  INSERT INTO AppUser (email)
  VALUES ($1)
  RETURNING id, email`,
    [email],
  );

  if (!userInsert.rows.length) {
    throw new Error("Could not find inserted user");
  }

  return userInsert.rows[0];
}

export async function deleteUserByEmail(email: string) {
  await query("DELETE FROM AppUser WHERE email = $1", [email]);
}
