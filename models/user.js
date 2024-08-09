import { pool } from "../db/connection.js";

const query = `
    CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone_number VARCHAR(15),
    role VARCHAR(50) DEFAULT 'user',  -- 'user' or 'admin'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    `;


async function createUserTable() {
    try{
        const usertable = await pool.query(query);
        console.log(`Users table is created`);
    }
    catch(error){
        console.error(error);
    }
}

export {createUserTable};



