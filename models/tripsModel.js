// id SERIAL PRIMARY KEY,
// bus_id INT REFERENCES buses(id) ON DELETE CASCADE,
// route_id INT REFERENCES routes(id) ON DELETE CASCADE,
// departure_date DATE NOT NULL,
// departure_time TIME NOT NULL,
// arrival_time TIME NOT NULL,
// base_price DECIMAL(10, 2) NOT NULL,
// created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

import { pool } from "../db/connection.js";

class TripsModel {
  async create(
    bus_id,
    route_id,
    departure_date,
    departure_time,
    arrival_time,
    base_price,
    created_at
  ) {
    const query = `
            INSERT INTO trips (bus_id, route_id, departure_date, departure_time, arrival_time, base_price, created_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *;`;
    try {
      const dbRes = await pool.query(query, [
        bus_id,
        route_id,
        departure_date,
        departure_time,
        arrival_time,
        base_price,
        created_at,
      ]);
      return dbRes.rows[0];
    } catch (error) {
      throw new Error("Unable to create trip");
    }
  }

  async findAll() {
    const query = `SELECT * FROM trips;`;
    try {
      const dbRes = await pool.query(query);
      return dbRes.rows;
    } catch (error) {
      throw new Error("Unable to fetch trips");
    }
  }

  async findById(id) {
    const query = `SELECT * FROM trips WHERE id = $1;`;
    try {
      const dbRes = await pool.query(query, [id]);
      return dbRes.rows[0];
    } catch (error) {
      throw new Error("Trip not found");
    }
  }

  async delete(id) {
    const query = `DELETE FROM trips WHERE id = $1 RETURNING *;`;
    try {
      const dbRes = await pool.query(query, [id]);
      return dbRes.rows[0];
    } catch (error) {
      throw new Error("Unable to delete trip");
    }
  }
}

export default new TripsModel();
