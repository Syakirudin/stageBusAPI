import pool from "../db/db.connection.js";

class FareService {
  // Create new fare
  static async createFare(fareData) {
    const query = `
      INSERT INTO fare (
        from_location_name, from_coordinates, 
        to_location_name, to_coordinates, 
        amount_of_fare
      ) VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    
    const values = [
      fareData.from_location_name,
      JSON.stringify(fareData.from_coordinates),
      fareData.to_location_name,
      JSON.stringify(fareData.to_coordinates),
      fareData.amount_of_fare,
    ];

    try {
      const result = await pool.query(query, values);
      return result.rows[0];  // Return the newly created fare
    } catch (error) {
      throw new Error(`Error creating fare: ${error.message}`);
    }
  }

  // Get all fares
  static async getAllFares() {
    const query = `
      SELECT * FROM fare;
    `;
    try {
      const result = await pool.query(query);
      return result.rows;  // Return all fares
    } catch (error) {
      throw new Error(`Error retrieving fares: ${error.message}`);
    }
  }

  // Update fare by id
  static async updateFare(id, fareData) {
    const query = `
      UPDATE fare 
      SET 
        from_location_name = $1,
        from_coordinates = $2,
        to_location_name = $3,
        to_coordinates = $4,
        amount_of_fare = $5,
        updated_at = NOW()
      WHERE id = $6
      RETURNING *;
    `;
    const values = [
      fareData.from_location_name,
      JSON.stringify(fareData.from_coordinates),
      fareData.to_location_name,
      JSON.stringify(fareData.to_coordinates),
      fareData.amount_of_fare,
      id,
    ];

    try {
      const result = await pool.query(query, values);
      return result.rows[0];  // Return the updated fare
    } catch (error) {
      throw new Error(`Error updating fare: ${error.message}`);
    }
  }

  // Delete fare by id
  static async deleteFare(id) {
    const query = `
      DELETE FROM fare WHERE id = $1 RETURNING *;
    `;
    try {
      const result = await pool.query(query, [id]);
      return result.rows[0];  // Return the deleted fare
    } catch (error) {
      throw new Error(`Error deleting fare: ${error.message}`);
    }
  }
}

export default FareService;
