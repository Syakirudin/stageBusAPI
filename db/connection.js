import pg from "pg";
import dotenv from "dotenv";

// Load environment variables from .env file in non-production environments
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

const { Pool } = pg;

// Dynamically configure the database connection based on the environment
const pool = new Pool({
  host: process.env.NODE_ENV === 'production' ? process.env.DB_HOST : process.env.LOCAL_DB_HOST,
  user: process.env.NODE_ENV === 'production' ? process.env.DB_USER : process.env.LOCAL_DB_USER,
  password: process.env.NODE_ENV === 'production' ? process.env.DB_PASSWORD : process.env.LOCAL_DB_PASSWORD,
  database: process.env.NODE_ENV === 'production' ? process.env.DB_NAME : process.env.LOCAL_DB_NAME,
  port: process.env.NODE_ENV === 'production' ? process.env.DB_PORT : process.env.LOCAL_DB_PORT,
});

async function testConnection() {
  try {
    const dbName = await pool.query("SELECT current_database()");
    const dbRes = await pool.query("SELECT NOW()");
    const time = dbRes.rows[0].now;
    const name = dbName.rows[0].current_database;

    console.log(
      `Database connection successful with ${name}'s database at ${time}`
    );
  } catch (err) {
    console.log("Database connection failed");
    console.error(err);
  }
}

export { pool, testConnection };
