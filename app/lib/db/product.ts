import { sql } from "@vercel/postgres";
import type { Ingredient, ProductRow, ReweProduct } from "../models";
import { daysAgo } from "../utils/date";

export async function findProductByExternalId(
  product: ReweProduct,
): Promise<number | undefined> {
  const productSelect =
    await sql`SELECT id FROM Product WHERE external_id = ${product.id} LIMIT 1`;
  if (productSelect.rows.length) {
    return productSelect.rows[0].id;
  }
}

export async function lastFetchedProductByMarket(
  marketId: string,
): Promise<Date | undefined> {
  const response = await sql.query(
    `SELECT fetched_at FROM product WHERE market_id = '${marketId}' ORDER BY fetched_at DESC LIMIT 1;`,
  );
  if (response.rows.length) {
    return response.rows[0].fetched_at;
  }
}

export async function insertProducts(
  products: ReweProduct[],
  marketId: string,
) {
  try {
    const now = new Date();
    const values = products
      .map((p) => [p.id, p.productName, JSON.stringify(p), marketId, now])
      .flat();
    const numColumns = 5;
    const valuesPlaceholders = products
      .map(
        (_, rowIndex) =>
          `(${Array.from({ length: numColumns }, (_, colIndex) => `$${rowIndex * numColumns + colIndex + 1}`).join(", ")})`,
      )
      .join(", ");
    const query = `
    INSERT INTO Product (external_id, product_name, data, market_id, fetched_at)
    VALUES ${valuesPlaceholders}
    ON CONFLICT (external_id) DO UPDATE SET data = EXCLUDED.data, fetched_at = EXCLUDED.fetched_at;`;

    await sql.query(query, values);
  } catch (error) {
    console.error(error);
    throw new Error("Could not store products");
  }
}

export async function updateEmbeddings(products: ProductRow[]) {
  try {
    const values = products
      .map((p) => [
        p.id,
        p.external_id,
        p.product_name,
        JSON.stringify(p),
        p.market_id,
        p.fetched_at,
        `[${p.product_name_embedding}]`,
      ])
      .flat();
    const numColumns = 7;
    const valuesPlaceholders = products
      .map(
        (_, rowIndex) =>
          `(${Array.from({ length: numColumns }, (_, colIndex) => `$${rowIndex * numColumns + colIndex + 1}`).join(", ")})`,
      )
      .join(", ");
    const query = `
        INSERT INTO Product (id, external_id, product_name, data, market_id, fetched_at, product_name_embedding)
        VALUES ${valuesPlaceholders}
        ON CONFLICT (id) DO UPDATE SET product_name_embedding = EXCLUDED.product_name_embedding;`;

    await sql.query(query, values);
  } catch (error) {
    console.error(error);
    throw new Error("Could not store products");
  }
}

export async function paginateProduct(
  marketId: string,
  pageSize: number,
  offset: number,
) {
  return await sql`SELECT * FROM Product WHERE market_id = ${marketId} AND product_name_embedding is NULL LIMIT ${pageSize} OFFSET ${offset};`;
}

export async function searchProductsByTsquery(
  market: string,
  ingredient: Ingredient,
) {
  const search = `${ingredient.productName} ${ingredient.quantity}${ingredient.unit}`;
  const searchBasic = ingredient.productName;
  const searchBasicPattern = `%${ingredient.productName}%`;
  const oneWeekAgo = daysAgo(7);

  return await sql`
    SELECT 
      *,
      similarity(normalize_text(p.product_name), normalize_text(${searchBasic})) AS similarity,
      ts_rank(product_name_search, plainto_tsquery('german', normalize_text(${searchBasic}))) AS rank
    FROM 
      product p
    WHERE 
      market_id = ${market} AND
      fetched_at > ${oneWeekAgo.toISOString()} AND
      (normalize_text(p.product_name) LIKE normalize_text(${searchBasicPattern}) OR
      similarity(normalize_text(p.product_name), normalize_text(${searchBasic})) > 0.2 OR
      product_name_search @@ plainto_tsquery('german', normalize_text(${searchBasic})))
    ORDER BY rank DESC, similarity DESC, length(p.product_name) ASC
    LIMIT 10;`;
}

export async function searchProductsByEmbedding(
  market: string,
  searchQuery: string,
) {
  return await sql`SELECT id, external_id, product_name, data FROM product
      WHERE market_id = ${market}
      ORDER BY product_name_embedding <=> ${searchQuery}
      LIMIT 10`;
}

export async function searchProductsBySimilarity(
  market: string,
  search: string,
) {
  return await sql`SELECT * from product WHERE market_id = ${market} ORDER BY similarity(product_name, ${search}) DESC LIMIT 10`;
}
