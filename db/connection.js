import pg from 'pg'
import { createUserTable } from "../models/user.js";
const { Pool } = pg


//connection with database
const pool = new Pool({
  host: '127.0.0.1',
  user: 'postgres',
  password: '12345',
  database: 'intercity_bus',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

async function testConnection() {
    //try-catch block
    try{
        
        const dbName = await pool.query('SELECT current_database()');
        const dbRes = await pool.query('SELECT NOW()');
        const time = dbRes.rows[0].now;
        const name = dbName.rows[0].current_database;

        console.log(`Database connection successful with ${name}'s database at ${time}`);

        await createUserTable();
        
    }
    catch(err){
        console.log('Database connection failed');
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

