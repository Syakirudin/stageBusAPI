import { pool } from "../db/connection.js";

class RouteStopPointsModel {
  // Create a new route-stop point entry
  async create(routeStopPointData) {
    const { route_id, stop_point_id, stop_order, coordinate } = routeStopPointData;

    const query = `
      INSERT INTO "RouteStopPoint" (route_id, stop_point_id, stop_order, coordinate)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;

    try {
      const result = await pool.query(query, [route_id, stop_point_id, stop_order, coordinate]);
      return result.rows[0];
    } catch (error) {
      console.error("Error inserting route-stop point into database:", error);
      throw error;
    }
  }

  // Find a route-stop point by ID
  async findById(id) {
    const query = `SELECT * FROM "RouteStopPoint" WHERE id = $1`;

    try {
      const result = await pool.query(query, [id]);
      return result.rows[0]; // Returns undefined if no route-stop point is found
    } catch (error) {
      console.error("Error finding route-stop point by ID:", error);
      throw error;
    }
  }

  // Update a route-stop point
  async update(id, updateData) {
    const { route_id, stop_point_id, stop_order, coordinate } = updateData;

    const query = `
      UPDATE "RouteStopPoint"
      SET route_id = $1, stop_point_id = $2, stop_order = $3, coordinate = $4
      WHERE id = $5
      RETURNING *;
    `;

    try {
      const result = await pool.query(query, [route_id, stop_point_id, stop_order, coordinate, id]);
      return result.rows[0]; // Returns the updated route-stop point
    } catch (error) {
      console.error("Error updating route-stop point in database:", error);
      throw error;
    }
  }

  // Delete a route-stop point by ID
  async delete(id) {
    const query = `DELETE FROM "RouteStopPoint" WHERE id = $1 RETURNING *;`;

    try {
      const result = await pool.query(query, [id]);
      return result.rows[0]; // Returns the deleted route-stop point
    } catch (error) {
      console.error("Error deleting route-stop point from database:", error);
      throw error;
    }
  }

  // Retrieve all route-stop points
  async findAll() {
    const query = `SELECT * FROM "RouteStopPoint";`;

    try {
      const result = await pool.query(query);
      return result.rows; // Returns all route-stop points
    } catch (error) {
      console.error("Error retrieving route-stop points from database:", error);
      throw error;
    }
  }
}

export default new RouteStopPointsModel();
