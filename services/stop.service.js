import pool from "../../backend/db/db.connection.js";

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
      console.error("Error inserting stop point:", error);
      throw error; // Rethrow the error for further handling if needed
    }
  }
}

export default StopService;
