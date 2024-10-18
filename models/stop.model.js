// models/stop.model.js
import pool from "../db/db.connection.js";

class StopModel {
  static async createStopTable() {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS stop_point (
          location_name VARCHAR(255) NOT NULL,
          coordinates JSONB NOT NULL,            
          city_name VARCHAR(255) NOT NULL,

          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

          PRIMARY KEY (location_name, coordinates)       
      );
    `;

    const addUniqueConstraintQuery = `
      DO $$
      BEGIN
          IF NOT EXISTS (
              SELECT 1 
              FROM pg_constraint 
              WHERE conname = 'unique_location_name'
          ) THEN
              ALTER TABLE stop_point
              ADD CONSTRAINT unique_location_name UNIQUE (location_name);
          END IF;
      END $$;
    `;

    try {
      // Create the stop_point table
      await pool.query(createTableQuery);
      console.log("Stop table created or already exists.");

      // Add the unique constraint on location_name if it doesn't exist
      await pool.query(addUniqueConstraintQuery);
      console.log("Unique constraint on location_name added (if it was not already present).");
      
    } catch (error) {
      console.error("Error setting up Stop table:", error.message); // Log the error message
    }
  }
}

// Call the method to create the table
StopModel.createStopTable();

export default StopModel;
