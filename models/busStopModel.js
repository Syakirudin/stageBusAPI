import { pool } from "../db/connection.js";

class BusStopModel {
  // Create a new bus stop
  async create(
    route_id,
    city_name,
    stop_order,
    created_at,
    coordinate,
    stop_name,
    stop_type
  ) {
    try {
      // Check if the bus stop already exists
      const existingStop = await this.findByRouteIdAndStopOrder(
        route_id,
        stop_order
      );
      if (existingStop) {
        throw new Error(
          "Bus stop with this route_id and stop_order already exists"
        );
      }

      const query = `
        INSERT INTO stops (route_id, city_name, stop_order, created_at, coordinate, stop_name, stop_type) 
        VALUES ($1, $2, $3, $4, $5, $6, $7) 
        RETURNING *;`;
      const dbRes = await pool.query(query, [
        route_id,
        city_name,
        stop_order,
        created_at || new Date(), // Default to current timestamp if not provided
        coordinate,
        stop_name,
        stop_type,
      ]);
      return dbRes.rows[0];
    } catch (error) {
      console.error("Error while creating bus stop:", error.message);
      throw new Error("Unable to create bus stop");
    }
  }

  // Find all bus stops
  async findAll() {
    const query = `SELECT * FROM stops;`;
    try {
      const dbRes = await pool.query(query);
      return dbRes.rows;
    } catch (error) {
      throw new Error("Unable to fetch bus stops");
    }
  }

  // Find a bus stop by ID
  async findById(id) {
    const query = `SELECT * FROM stops WHERE id = $1;`;
    try {
      const dbRes = await pool.query(query, [id]);
      return dbRes.rows[0];
    } catch (error) {
      throw new Error("Bus stop not found");
    }
  }

  // Find a bus stop by route_id and stop_order
  async findByRouteIdAndStopOrder(route_id, stop_order) {
    const query = `SELECT * FROM stops WHERE route_id = $1 AND stop_order = $2;`;
    try {
      const dbRes = await pool.query(query, [route_id, stop_order]);
      return dbRes.rows[0];
    } catch (error) {
      console.error("Error while finding bus stop:", error.message);
      throw new Error("Unable to find bus stop");
    }
  }

  // Update a bus stop
  async update(id, updateFields) {
    const {
      route_id,
      city_name,
      stop_order,
      created_at,
      coordinate,
      stop_name,
      stop_type,
    } = updateFields;

    const query = `
        UPDATE stops SET 
        route_id = $1, 
        city_name = $2,
        stop_order = $3,
        created_at = $4,
        coordinate = $5,
        stop_name = $6,
        stop_type = $7
        WHERE id = $8
        RETURNING *;`;
    try {
      const dbRes = await pool.query(query, [
        route_id,
        city_name,
        stop_order,
        created_at,
        coordinate,
        stop_name,
        stop_type,
        id,
      ]);
      return dbRes.rows[0];
    } catch (error) {
      console.error("Error while updating bus stop:", error.message);
      throw new Error("Unable to update bus stop");
    }
  }

  // Delete a bus stop
  async delete(id) {
    const query = `DELETE FROM stops WHERE id = $1 RETURNING *;`;
    try {
      const dbRes = await pool.query(query, [id]);
      return dbRes.rows[0];
    } catch (error) {
      console.error("Error while deleting bus stop:", error.message);
      throw new Error("Unable to delete bus stop");
    }
  }
}

export default new BusStopModel();
