import { pool } from "../../db/connection.js";

class BusStopModel {
    async create(route_id, city_name,stop_order,create_at,coordinate,stop_name,stop_type) {
        const query = `
                INSERT INTO stops (route_id, city_name,stop_order,create_at,coordinate,stop_name,stop_type) 
                VALUES ($1, $2,$3,$4,$5,$6,$7) 
                RETURNING *;`;
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
            throw new Error("Unable to create bus stop");
        }
    
    
    }

    async findAll() {
        const query = `SELECT * FROM bus_stop;`;
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
        const { route_id, city_name,stop_order,create_at,coordinate,stop_name,stop_type } =
          updatedFields;
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





}

export default new BusStopModel ();