import pg from "pg";

const pool = new pg.Pool({ connectionString: process.env.POSTGRES_URL });

export const query = (text) => {
  return pool.query(text);
};

// This function executes a query and ignores duplicate errors
export const queryIgnoreDuplicate = async (text) => {
  try {
    return await pool.query(text);
  } catch (error) {
    if (error.code !== "42710") {
      throw error; // rethrow if it's not a duplicate error
    }
    console.warn("Duplicate entry ignored:", error.message);
  }
};
