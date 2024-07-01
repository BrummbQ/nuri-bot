import { sql } from "@vercel/postgres";
import dotenv from "dotenv";

dotenv.config({ path: [".env.development.local"] });

try {
  await sql`CREATE EXTENSION IF NOT EXISTS pg_trgm;`;
  await sql`CREATE EXTENSION IF NOT EXISTS vector;`;

  const result = await sql`
CREATE TABLE Product (
    id SERIAL PRIMARY KEY,
    external_id VARCHAR(255) UNIQUE NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    data JSONB NOT NULL,
    market_id VARCHAR(255) NOT NULL,
    fetched_at TIMESTAMP NOT NULL,
    product_name_embedding vector(1024),
    product_name_search TSVECTOR  
      GENERATED ALWAYS AS (to_tsvector('german', product_name)) STORED
);
`;

  await sql`CREATE INDEX product_name_trgm_idx ON Product USING gin (product_name gin_trgm_ops);`;

  console.log("Created table", result);
} catch (error) {
  console.error(error);
}
