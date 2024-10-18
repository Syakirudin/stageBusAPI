import pool from "../db/db.connection.js";

class StopService {
  // Fetch all stop points
  static async getStop() {
    const res = await pool.query("SELECT * FROM stop_point");
    return res.rows;
  }

  // Create a new stop point
  static async createStop(location_name, latitude, longitude, city_name) {
    const coordinates = JSON.stringify({ latitude, longitude }); // Convert to JSON string

    const query = `
      INSERT INTO stop_point (location_name, coordinates, city_name) 
      VALUES ($1, $2, $3) 
      RETURNING *;
    `;

    try {
      const res = await pool.query(query, [location_name, coordinates, city_name]);
      return res.rows[0]; // Return the newly created stop point
    } catch (error) {
      // Handle unique constraint violation
      if (error.code === "23505") { // PostgreSQL error code for unique violation
        console.error("Error: Duplicate location_name. A stop with this name already exists.");
        throw new Error("A stop with this location name already exists. Please use a different name.");
      }
      
      console.error("Error inserting stop point:", error);
      throw error; // Rethrow the error for further handling if needed
    }
  }
}

export default StopService;
