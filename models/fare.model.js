// models/fare.model.js
import pool from "../db/db.connection.js";

class FareModel {
  static async createFareTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS fare (
    id SERIAL PRIMARY KEY,
    from_location_name VARCHAR(255) NOT NULL,
    from_coordinates JSONB NOT NULL,
    to_location_name VARCHAR(255) NOT NULL,
    to_coordinates JSONB NOT NULL,
    amount_of_fare NUMERIC NOT NULL,

    FOREIGN KEY (from_location_name, from_coordinates) 
        REFERENCES stop_point(location_name, coordinates),
    FOREIGN KEY (to_location_name, to_coordinates) 
        REFERENCES stop_point(location_name, coordinates)
);

    `;

    try {
      await pool.query(query);
      console.log("Fare table created or already exists.");
    } catch (error) {
      console.error("Error creating Fare table:", error.message);
    }
  }
}

// Call the method to create the table
FareModel.createFareTable();

export default FareModel;
