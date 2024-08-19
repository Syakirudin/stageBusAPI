import pg from "pg";
import { createAllTables} from "../models/tableConnection.js";
import dotenv from "dotenv";




const { Pool } = pg;
dotenv.config();

//connection with database
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  max: parseInt(process.env.DB_MAX, 10),
  idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT, 10),
  connectionTimeoutMillis: parseInt(process.env.DB_CONN_TIMEOUT, 10),
});

async function testConnection() {
  //try-catch block
  try {
    const dbName = await pool.query("SELECT current_database()");
    const dbRes = await pool.query("SELECT NOW()");
    const time = dbRes.rows[0].now;
    const name = dbName.rows[0].current_database;

    console.log(
      `Database connection successful with ${name}'s database at ${time}`
    );

    await createAllTables();

  } catch (err) {
    console.log("Database connection failed");
    console.log(err);
  }
}

export { pool, testConnection };

//Promise 101
// promise is variable for future value
// since promise is a variable for future value, we need to wait for the value to be available by using asyncronous function
// WAITING / PENUGGUAN
// state of promise - pending, fulfilled, rejected
// fullfilled - value is available / database query is successful
// rejected - value is not available / database query is failed / error
// try-catch block
// try - block of code pending and resolved
// catch - block of code rejected
