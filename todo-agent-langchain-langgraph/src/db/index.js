import "dotenv/config";

import { drizzle } from "drizzle-orm/node-postgres";
// Wrap it in an object with the 'connection' property
export const db = drizzle({ connection: process.env.DATABASE_URL });
