
import { pool } from "../db/connection.js";

class UserModel {
  // Create a new user
  async create(userData) {
    const { username, email, password, gender, residence, created_at } = userData;

    const query = `
      INSERT INTO "User" (username, email, password, gender, residence, created_at)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;

    try {
      const result = await pool.query(query, [username, email, password, gender, residence, created_at]);
      return result.rows[0];
    } catch (error) {
      console.error("Error inserting user into database:", error);
      throw error;
    }
  }

  // Find a user by email
  async findByEmail(email) {
    const query = `SELECT * FROM "User" WHERE email = $1`;

    try {
      const result = await pool.query(query, [email]);
      return result.rows[0]; // Returns undefined if no user is found
    } catch (error) {
      console.error("Error finding user by email:", error);
      throw error;
    }
  }

  // Find a user by ID
  async findById(id) {
    const query = `SELECT * FROM "User" WHERE id = $1`;

    try {
      const result = await pool.query(query, [id]);
      return result.rows[0]; // Returns undefined if no user is found
    } catch (error) {
      console.error("Error finding user by ID:", error);
      throw error;
    }
  }

  // Update a user
  async update(id, updateData) {
    const { username, email, password, gender, residence } = updateData;

    const query = `
      UPDATE "User"
      SET username = $1, email = $2, password = $3, gender = $4, residence = $5, updated_at = $6
      WHERE id = $7
      RETURNING *;
    `;

    try {
      const result = await pool.query(query, [username, email, password, gender, residence, new Date(), id]);
      return result.rows[0]; // Returns the updated user
    } catch (error) {
      console.error("Error updating user in database:", error);
      throw error;
    }
  }

  // Delete a user by ID
  async delete(id) {
    const query = `DELETE FROM "User" WHERE id = $1 RETURNING *;`;

    try {
      const result = await pool.query(query, [id]);
      return result.rows[0]; // Returns the deleted user
    } catch (error) {
      console.error("Error deleting user from database:", error);
      throw error;
    }
  }

  // Retrieve all users (optional method)
  async findAll() {
    const query = `SELECT * FROM "User";`;

    try {
      const result = await pool.query(query);
      return result.rows; // Returns all users
    } catch (error) {
      console.error("Error retrieving users from database:", error);
      throw error;
    }
  }
}

export default new UserModel();
