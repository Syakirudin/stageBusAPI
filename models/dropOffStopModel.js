// id SERIAL PRIMARY KEY,
// coordinate VARCHAR(255) NOT NULL,
// time TIME NOT NULL,
// created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

import { pool } from "../db/connection.js";

class DropOffStopModel {
  async createDropOffStop(coordinate, time, created_at) {
    try {
      const newDropOffStop = await pool.query(
        "INSERT INTO drop_off_stops (coordinate, time, created_at) VALUES ($1, $2, $3) RETURNING *",
        [coordinate, time, created_at]
      );
      return newDropOffStop.rows[0];
    } catch (error) {
      console.log(error);
    }
  }

  async getAllDropOffStops() {
    try {
      const dropOffStops = await pool.query("SELECT * FROM drop_off_stops");
      return dropOffStops.rows;
    } catch (error) {
      console.log(error);
    }
  }

  async getDropOffStopById(id) {
    try {
      const dropOffStop = await pool.query(
        "SELECT * FROM drop_off_stops WHERE id = $1",
        [id]
      );
      return dropOffStop.rows[0];
    } catch (error) {
      console.log(error);
    }
  }

  async deleteDropOffStop(id) {
    try {
      const deletedDropOffStop = await pool.query(
        "DELETE FROM drop_off_stops WHERE id = $1 RETURNING *",
        [id]
      );
      return deletedDropOffStop.rows[0];
    } catch (error) {
      console.log(error);
    }
  }

  async updateDropOffStop(id, updatedFields) {
    try {
      const updatedDropOffStop = await pool.query(
        "UPDATE drop_off_stops SET coordinate = $1, time = $2 WHERE id = $3 RETURNING *",
        [updatedFields.coordinate, updatedFields.time, id]
      );
      return updatedDropOffStop.rows[0];
    } catch (error) {
      console.log(error);
    }
  }
}

export default DropOffStopModel;
