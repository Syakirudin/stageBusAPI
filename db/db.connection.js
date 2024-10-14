import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';



// Load environment variables
dotenv.config();

// Create a new database connection pool
const pool = new Pool({
  host: process.env.DB_HOST  || process.env.LIVE_DB_HOST ,
  user: process.env.DB_USER || process.env.LIVE_DB_USER,
  database: process.env.DB_NAME || process.env.LIVE_DB_NAME,
  password: process.env.DB_PASSWORD || process.env.LIVE_DB_PASSWORD,
  port: process.env.DB_PORT || process.env.LIVE_DB_PORT,
});




// Test the database connection
(async () => {
  try {
    await pool.connect();
    console.log('Database connected successfully.');
  } catch (err) {
    console.error('Database connection error:', err);
  }
})();

export default pool;
