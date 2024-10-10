import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';



// Load environment variables
dotenv.config();

// Create a new database connection pool
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
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
