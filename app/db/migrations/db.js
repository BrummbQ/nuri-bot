import pg from "pg";

const pool = new pg.Pool({ connectionString: process.env.POSTGRES_URL });

export const query = (text) => {
  return pool.query(text);
};
