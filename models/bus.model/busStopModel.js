import { pool } from "../../db/connection.js";

class BusStopModel {
    async create(route_id, city_name, stop_order, create_at, coordinate, stop_name, stop_type) {
        const query = `
            INSERT INTO stops (route_id, city_name, stop_order, created_at, coordinate, stop_name, stop_type)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *;
        `;
        try {
            const dbRes = await pool.query(query, [
                route_id,
                city_name,
                stop_order,
                create_at,
                coordinate,
                stop_name,
                stop_type
            ]);
            return dbRes.rows[0];
        } catch (error) {
            console.error('Error details:', error);  // Log the full error object
            throw new Error(`Unable to create bus stop: ${error.message}`);  // Provide detailed error message
        }
    }
    

  async findAll() {
    const query = `SELECT * FROM stops;`;
    try {
      const dbRes = await pool.query(query);
      return dbRes.rows;
    } catch (error) {
      throw new Error("Unable to fetch bus stop");
    }
  }

  async findById(id) {
    const query = `SELECT * FROM bus_stop WHERE id = $1;`;
    try {
      const dbRes = await pool.query(query, [id]);
      return dbRes.rows[0];
    } catch (error) {
      throw new Error("Bus stop not found");
    }
  }

  async update(id, updatedFields) {
    const {
      route_id,
      city_name,
      stop_order,
      create_at,
      coordinate,
      stop_name,
      stop_type,
    } = updatedFields;
    const query = `
                UPDATE bus_stop SET 
                route_id = $1, 
                city_name = $2,
                stop_order = $3,
                create_at = $4,
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
        create_at,
        coordinate,
        stop_name,
        stop_type,
        id,
      ]);
      return dbRes.rows[0];
    } catch (error) {
      throw new Error("Unable to update bus stop");
    }
  }

  async delete(id) {
    const query = `DELETE FROM bus_stop WHERE id = $1 RETURNING *;`;
    try {
      const dbRes = await pool.query(query, [id]);
      return dbRes.rows[0];
    } catch (error) {
      throw new Error("Unable to delete bus stop");
    }
  }
  async findByRouteIdAndStopOrder(route_id, stop_order) {
    const query = `SELECT * FROM stops WHERE route_id = $1 AND stop_order = $2;`;
    try {
        const dbRes = await pool.query(query, [route_id, stop_order]);
        return dbRes.rows[0];
    } catch (error) {
        console.error('Error while finding bus stop:', error.message);
        throw new Error("Unable to find bus stop");
    }

    
}

async create(route_id, city_name, stop_order, created_at, coordinate, stop_name, stop_type) {
    try {
        // Check if the bus stop already exists
        const existingStop = await this.findByRouteIdAndStopOrder(route_id, stop_order);
        if (existingStop) {
            throw new Error("Bus stop with this route_id and stop_order already exists");
        }

        const query = `
            INSERT INTO stops (route_id, city_name, stop_order, created_at, coordinate, stop_name, stop_type) 
            VALUES ($1, $2, $3, $4, $5, $6, $7) 
            RETURNING *;`;
        const dbRes = await pool.query(query, [
            route_id, 
            city_name,
            stop_order,
            created_at,
            coordinate,
            stop_name,
            stop_type
        ]);
        return dbRes.rows[0];
    } catch (error) {
        console.error('Error while creating bus stop:', error.message);
        throw new Error("Unable to create bus stop");
    }
}

async update(route_id, stop_order, updateFields) {
    const { city_name, created_at, coordinate, stop_name, stop_type } = updateFields;

    // Construct the query with the fields that need to be updated
    const query = `
        UPDATE stops SET 
        city_name = $1,
        created_at = $2,
        coordinate = $3,
        stop_name = $4,
        stop_type = $5
        WHERE route_id = $6 AND stop_order = $7
        RETURNING *;`;

    try {
        const dbRes = await pool.query(query, [
            city_name,     // $1
            created_at,    // $2
            coordinate,    // $3
            stop_name,     // $4
            stop_type,     // $5
            route_id,      // $6
            stop_order     // $7
        ]);
        
        // Return the updated row
        return dbRes.rows[0];
    } catch (error) {
        console.error('Error while updating bus stop:', error.message); // Log error details
        throw new Error("Unable to update bus stop");
    }
}




}

export default new BusStopModel();
