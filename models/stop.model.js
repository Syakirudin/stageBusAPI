// models/stop.model.js
import pool from "../db/db.connection.js";

class StopModel {
  static async createStopTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS stop_point (
          location_name VARCHAR(255) NOT NULL,
          coordinates JSONB NOT NULL,            -- Store coordinates in JSONB format
          city_name VARCHAR(255) NOT NULL,

          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

          PRIMARY KEY (location_name, coordinates)       
      );
    `;

    try {
      const res = await pool.query(query);
      console.log("Stop table created or already exists."); // Log the result of the query
    } catch (error) {
      console.error("Error creating Stop table:", error.message); // Log the error message
    }
  }
}

// Call the method to create the table
StopModel.createStopTable();

export default StopModel;
