import { query } from "./db.js";
import dotenv from "dotenv";

dotenv.config({ path: [".env.development.local"] });

try {
  await query(`
CREATE TABLE IF NOT EXISTS AppUser (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);`);

  await query(`
CREATE TABLE IF NOT EXISTS MagicLink (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    token VARCHAR(255) UNIQUE NOT NULL,
    user_id UUID NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES AppUser(id)
);`);

  console.log("Created table");
} catch (error) {
  console.error(error);
}
