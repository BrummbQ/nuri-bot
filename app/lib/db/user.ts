import { sql } from "@vercel/postgres";

export async function findUserById(userId: string) {
  const userSelect =
    await sql`SELECT * FROM AppUser WHERE id = ${userId} LIMIT 1`;
  return userSelect.rows[0];
}

export async function findUserByEmail(email: string) {
  const userSelect =
    await sql`SELECT * FROM AppUser WHERE email = ${email} LIMIT 1`;
  return userSelect.rows[0];
}

export async function findOrInsertUser(email: string) {
  const user = await findUserByEmail(email);
  if (user != null) {
    return user;
  }

  const userInsert = await sql`
  INSERT INTO AppUser (email)
  VALUES (${email})
  RETURNING id, email`;

  if (!userInsert.rows.length) {
    throw new Error("Could not find inserted user");
  }

  return userInsert.rows[0];
}

export async function deleteUserByEmail(email: string) {
  await sql`DELETE FROM AppUser WHERE email = ${email}`;
}
