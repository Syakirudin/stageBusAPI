import pool from "../db/db.connection.js";

class FareModel {
  static async createFareTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS fare (
        id SERIAL PRIMARY KEY,
        route_no VARCHAR(50) NOT NULL,
        from_location_name VARCHAR(255) NOT NULL,
        to_location_name VARCHAR(255) NOT NULL,
        amount_of_fare NUMERIC NOT NULL,

        FOREIGN KEY (route_no) 
            REFERENCES route(route_no) ON DELETE CASCADE, -- Ensure fare is linked to a valid route
        FOREIGN KEY (from_location_name) 
            REFERENCES stop_point(location_name) ON DELETE CASCADE,
        FOREIGN KEY (to_location_name) 
            REFERENCES stop_point(location_name) ON DELETE CASCADE,

        UNIQUE (route_no, from_location_name, to_location_name) -- Prevent duplicate fares for the same route and stop pair
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
