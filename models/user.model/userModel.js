// backend/models/userModel.js

import { pool } from "../../db/connection.js";

class UserModel {
  async create(full_name, email, password_hash, phone_number, role = "user",area,district,level,coordinate) {
    const query = `
        INSERT INTO users (full_name, email, password_hash, phone_number, role, area, district, level, coordinate) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
        RETURNING *;`;

    try {
      const dbRes = await pool.query(query, [
        full_name,
        email,
        password_hash,
        phone_number,
        role,
        area,
        district,
        level,
        coordinate,
      ]);
      return dbRes.rows[0];
    } catch (error) {
      throw new Error("Unable to create user");
    }
  }

  async findById(id) {
    const query = `SELECT * FROM users WHERE id = $1;`;
    try {
      const dbRes = await pool.query(query, [id]);
      return dbRes.rows[0];
    } catch (error) {
      throw new Error("User not found");
    }
  }

  async findAll() {
    const query = `SELECT * FROM users;`;
    try {
      const dbRes = await pool.query(query);
      return dbRes.rows;
    } catch (error) {
      throw new Error("Unable to fetch users");
    }
  }

  // backend/models/userModel.js
  async update(id, updatedFields) {
    const { full_name, email, password_hash, phone_number, role, area, district, level, coordinate } = updatedFields;
    const query = `
      UPDATE users SET 
        full_name = $1, 
        email = $2, 
        password_hash = $3, 
        phone_number = $4, 
        role = $5,
        area = $6,
        district = $7,
        level = $8,
        coordinate = $9
      WHERE id = $10
      RETURNING *;`;
  
    try {
      console.log('Updating user with ID:', id); // Add this line
      const dbRes = await pool.query(query, [
        full_name,
        email,
        password_hash,
        phone_number,
        role,
        area,
        district,
        level,
        coordinate,
        id,
      ]);
      console.log('Update result:', dbRes.rows[0]); // Add this line
      return dbRes.rows[0];
    } catch (error) {
      console.error('Database update error:', error);
      throw new Error("Unable to update user");
    }
  }
  


  async delete(id) {
    const query = `DELETE FROM users WHERE id = $1 RETURNING *;`;
    try {
      const dbRes = await pool.query(query, [id]);
      return dbRes.rows[0];
    } catch (error) {
      throw new Error("Unable to delete user");
    }
  }
}

export default new UserModel();
