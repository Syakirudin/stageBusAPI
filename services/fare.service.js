import pool from "../db/db.connection.js";

class FareService {
  // Create new fare
  static async addFares(route_no, fares) {
    const insertQuery = `
      INSERT INTO fare (route_no, from_location_name, to_location_name, amount_of_fare) 
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;

    const client = await pool.connect();
    try {
      await client.query("BEGIN"); // Start transaction
      const results = [];

      for (const fare of fares) {
        const { from_location_name, to_location_name, amount_of_fare } = fare;

        // Validate fare details
        if (!from_location_name || !to_location_name || amount_of_fare <= 0) {
          throw new Error("Invalid fare details provided.");
        }

        const result = await client.query(insertQuery, [route_no, from_location_name, to_location_name, amount_of_fare]);
        results.push(result.rows[0]);
      }

      await client.query("COMMIT"); // Commit transaction
      return results;
    } catch (error) {
      await client.query("ROLLBACK"); // Rollback on error
      console.error("Error adding fares:", error);
      throw new Error("Failed to add fares: " + error.message);
    } finally {
      client.release(); // Release the database client
    }
  }

  static async getFares(route_no) {
    const query = `
      SELECT * FROM fare WHERE route_no = $1;
    `;

    try {
      const result = await pool.query(query, [route_no]);
      return result.rows;
    } catch (error) {
      console.error("Error fetching fares:", error);
      throw new Error("Failed to fetch fares: " + error.message);
    }
  }

  // Get a fare by ID
  static async getFareById(fare_id) {
    const query = `
      SELECT * FROM fare WHERE id = $1;
    `;

    try {
      const result = await pool.query(query, [fare_id]);
      if (result.rowCount === 0) {
        throw new Error("Fare not found.");
      }
      return result.rows[0];
    } catch (error) {
      console.error("Error fetching fare:", error);
      throw new Error("Failed to fetch fare: " + error.message);
    }
  }

  // Update a fare by ID
  static async updateFareById(fare_id, route_no, from_location_name, to_location_name, amount_of_fare) {
    const updateQuery = `
      UPDATE fare 
      SET route_no = $1, from_location_name = $2, to_location_name = $3, amount_of_fare = $4
      WHERE id = $5
      RETURNING *;
    `;

    const client = await pool.connect();
    try {
      await client.query("BEGIN"); // Start transaction

      // Validate fare details
      if (!from_location_name || !to_location_name || amount_of_fare <= 0) {
        throw new Error("Invalid fare details provided.");
      }

      const result = await client.query(updateQuery, [route_no, from_location_name, to_location_name, amount_of_fare, fare_id]);

      if (result.rowCount === 0) {
        throw new Error("Fare not found for updating.");
      }

      await client.query("COMMIT"); // Commit transaction
      return result.rows[0];
    } catch (error) {
      await client.query("ROLLBACK"); // Rollback on error
      console.error("Error updating fare:", error);
      throw new Error("Failed to update fare: " + error.message);
    } finally {
      client.release(); // Release the database client
    }
  }

  // Delete a fare by ID
  static async deleteFareById(fare_id) {
    const deleteQuery = `
      DELETE FROM fare WHERE id = $1 RETURNING *;
    `;

    try {
      const result = await pool.query(deleteQuery, [fare_id]);
      if (result.rowCount === 0) {
        throw new Error("Fare not found for deletion.");
      }
      return result.rows[0];
    } catch (error) {
      console.error("Error deleting fare:", error);
      throw new Error("Failed to delete fare: " + error.message);
    }
  }
}

export default FareService;
