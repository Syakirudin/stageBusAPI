// CREATE TABLE "StopPoint" (
//   id SERIAL PRIMARY KEY,
//   location_name VARCHAR(255) NOT NULL,
//   city_name VARCHAR(255) NOT NULL,
//   coordinate POINT NOT NULL
// );



import { pool } from "../db/connection.js";

class StopsModel {
  // Create a new stop point
  async create(stopData) {
    const { location_name, city_name, coordinate } = stopData;

    const query = `
      INSERT INTO "StopPoint" (location_name, city_name, coordinate)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;

    try {
      const result = await pool.query(query, [location_name, city_name, coordinate]);
      return result.rows[0];
    } catch (error) {
      console.error("Error inserting stop point into database:", error);
      throw error;
    }
  }

  // Find a stop point by ID
  async findById(id) {
    const query = `SELECT * FROM "StopPoint" WHERE id = $1`;

    try {
      const result = await pool.query(query, [id]);
      return result.rows[0]; // Returns undefined if no stop point is found
    } catch (error) {
      console.error("Error finding stop point by ID:", error);
      throw error;
    }
  }

  // Update a stop point
  async update(id, updateData) {
    const { location_name, city_name, coordinate } = updateData;

    const query = `
      UPDATE "StopPoint"
      SET location_name = $1, city_name = $2, coordinate = $3, updated_at = $4
      WHERE id = $5
      RETURNING *;
    `;

    try {
      const result = await pool.query(query, [
        location_name,
        city_name,
        coordinate,
        new Date(),
        id,
      ]);
      return result.rows[0]; // Returns the updated stop point
    } catch (error) {
      console.error("Error updating stop point in database:", error);
      throw error;
    }
  }

  // Delete a stop point by ID
  async delete(id) {
    const query = `DELETE FROM "StopPoint" WHERE id = $1 RETURNING *;`;

    try {
      const result = await pool.query(query, [id]);
      return result.rows[0]; // Returns the deleted stop point
    } catch (error) {
      console.error("Error deleting stop point from database:", error);
      throw error;
    }
  }

  // Retrieve all stop points
  async findAll() {
    const query = `SELECT * FROM "StopPoint";`;

    try {
      const result = await pool.query(query);
      return result.rows; // Returns all stop points
    } catch (error) {
      console.error("Error retrieving stop points from database:", error);
      throw error;
    }
  }
}

export default new StopsModel();
