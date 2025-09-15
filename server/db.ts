import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import pkg from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

const { Pool } = pkg;

// 🔹 Obtener __dirname equivalente en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 🔹 Cargar .env antes de cualquier uso de process.env
dotenv.config({ path: resolve(__dirname, '../.env') });

// 🔹 Verificación de DATABASE_URL
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// 🔹 Conexión a PostgreSQL local
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool, { schema });
