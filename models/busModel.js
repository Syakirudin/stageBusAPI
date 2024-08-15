import { pool } from "../db/connection.js";

class BusModel {
  async create(bus_number, total_seats, bus_type, created_at) {
    const query = `INSERT INTO buses (bus_number,total_seats,bus_type,created_at) VALUES ($1, $2, $3, $4) RETURNING *;`;
    try {
      const dbRes = await pool.query(query, [
        bus_number,
        total_seats,
        bus_type,
        created_at,
      ]);
      return dbRes.rows[0];
    } catch (error) {
      console.error("Error details:", error); // Log the full error object
      throw new Error(`Unable to create bus: ${error.message}`); // Provide detailed error message
    }
  }

  async findAll() {
    const query = `SELECT * FROM buses;`;
    try {
      const dbRes = await pool.query(query);
      return dbRes.rows;
    } catch (error) {
      throw new Error("Unable to fetch buses");
    }
  }

  async findById(id) {
    const query = `SELECT * FROM buses WHERE id = $1;`;
    try {
      const dbRes = await pool.query(query, [id]);
      return dbRes.rows[0];
    } catch (error) {
      throw new Error("Bus not found");
    }
  }

  async delete(id) {
    const query = `DELETE FROM buses WHERE id = $1 RETURNING *;`;
    try {
      const dbRes = await pool.query(query, [id]);
      return dbRes.rows[0];
    } catch (error) {
      console.error("Error details:", error); // Log the full error object
      throw new Error(`Unable to delete bus: ${error.message}`); // Provide detailed error message
    }
  }

  async update(id, updatedFields) {
    const { bus_number, total_seats, bus_type, created_at } = updatedFields;
    const query = ` UPDATE buses SET bus_number=$1,total_seats=$2,bus_type=$3,created_at=$4 WHERE id = $5 RETURNING *;`;
    try {
      const dbRes = await pool.query(query, [
        bus_number,
        total_seats,
        bus_type,
        created_at,
      ]);
      return dbRes.rows[0];
    } catch (error) {
      console.error("Error details:", error); // Log the full error object
      throw new Error(`Unable to update bus: ${error.message}`); // Provide detailed error message
    }
  }
}

export default new BusModel();
