import { sql } from "@vercel/postgres";
import { v4 as uuidv4 } from "uuid";

export async function insertBasket(basketId = uuidv4()): Promise<string> {
  await sql`INSERT INTO Basket (id) VALUES (${basketId})`;
  console.log("Created basket", basketId);
  return basketId;
}
