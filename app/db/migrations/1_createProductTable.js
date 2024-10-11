import { sql } from "@vercel/postgres";
import dotenv from "dotenv";

dotenv.config({ path: [".env.development.local"] });

try {
  await sql`CREATE EXTENSION IF NOT EXISTS pg_trgm;`;
  await sql`CREATE EXTENSION IF NOT EXISTS vector;`;
  await sql`CREATE EXTENSION IF NOT EXISTS unaccent`;
  await sql`CREATE OR REPLACE FUNCTION normalize_text(text) RETURNS text AS $$
  SELECT lower(unaccent($1));
  $$ LANGUAGE SQL IMMUTABLE;`;

  const result = await sql`
CREATE TABLE IF NOT EXISTS Product (
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

  await sql`CREATE INDEX IF NOT EXISTS idx_product_market_id ON product(market_id);`;
  await sql`CREATE INDEX IF NOT EXISTS idx_product_name_trgm ON product USING gin(normalize_text(product_name) gin_trgm_ops);`;
  await sql`CREATE INDEX IF NOT EXISTS idx_product_name_search ON product USING gin(product_name_search);`;

  console.log("Created table", result);
} catch (error) {
  console.error(error);
}
