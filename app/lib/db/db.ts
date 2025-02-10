import pg from "pg";

const pool = new pg.Pool({ connectionString: process.env.POSTGRES_URL });

export const query = (
  text: string,
  values?: pg.QueryConfigValues<any>,
): Promise<pg.QueryResult<any>> => {
  return pool.query(text, values);
};
