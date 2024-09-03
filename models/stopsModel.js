import { pool } from "../db/connection.js";

class StopsModel {

  async getStops(stopData = {}) {
    try {
      const { location_name, city_name, coordinate } = stopData;
      let query = `SELECT * FROM "StopPoint"`;
      const queryParams = [];
      const conditions = [];
  
      // Add conditions dynamically
      if (location_name) {
        conditions.push(`location_name = $${conditions.length + 1}`);
        queryParams.push(location_name);
      }
  
      if (city_name) {
        conditions.push(`city_name = $${conditions.length + 1}`);
        queryParams.push(city_name);
      }
  
      if (coordinate) {
        conditions.push(`coordinate = $${conditions.length + 1}`);
        queryParams.push(coordinate);
      }
  
      // Append conditions to query
      if (conditions.length > 0) {
        query += ` WHERE ${conditions.join(" AND ")}`;
      }
  
      const result = await pool.query(query, queryParams);
      return result.rows;
    } catch (error) {
      console.error("Error retrieving stops from database:", error);
      throw error;
    }
  }
  
    
}

export default new StopsModel();
