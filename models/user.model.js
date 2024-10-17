import pool from "../db/db.connection.js";

class UserModel {
  static async createUserTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) DEFAULT 'user', -- 'user', 'admin', 'super-admin'
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    try {
      await pool.query(query);
      console.log("User table created or already exists.");
    } catch (error) {
      console.error("Error creating User table:", error.message);
    }
  }

  static async createUser(username, email, password, role) {
    const query = `INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *`;
    const values = [username, email, password, role];
    return pool.query(query, values);
  }

  static async getUserByUsernameOrEmail(identifier) {
    const query = `SELECT * FROM users WHERE username = $1 OR email = $2`;
    return pool.query(query, [identifier, identifier]);
  }

  static async getUserById(id) {
    const query = `SELECT * FROM users WHERE id = $1`;
    return pool.query(query, [id]);
  }

  static async updatePassword(id, newPassword) {
    const query = `UPDATE users SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`;
    return pool.query(query, [newPassword, id]);
  }

  static async updateUserRole(id, role) {
    const query = `UPDATE users SET role = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`;
    return pool.query(query, [role, id]);
  }
  
}

UserModel.createUserTable();

export default UserModel;
