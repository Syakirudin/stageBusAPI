import { pool } from "../db/connection.js";


class RoutesModel {
    async create(route_name,created_at) {
        const query = `
            INSERT INTO routes (route_name,created_at)
            VALUES ($1, $2)
            RETURNING *;
        `;
        try {
            const dbRes = await pool.query(query, [route_name,created_at]);
            return dbRes.rows[0];   
        } catch (error) {
            throw new Error("Unable to create route");
        }
    }

    async findById(id) {
        const query = `SELECT * FROM routes WHERE id = $1;`;
        try {
            const dbRes = await pool.query(query, [id]);
            return dbRes.rows[0];
        } catch (error) {
            throw new Error("Route not found");
        }
    }

    async findAll() {
        const query = `SELECT * FROM routes;`;
        try {
            const dbRes = await pool.query(query);
            return dbRes.rows;
        } catch (error) {
            throw new Error("Unable to fetch routes");
        }    
    }

    async update(id, route_name) {
        const query = `
            UPDATE routes
            SET route_name = $1
            WHERE id = $2
            RETURNING *;
        `;
        try {
            const dbRes = await pool.query(query, [route_name, id]);
            return dbRes.rows[0];
        } catch (error) {
            throw new Error("Unable to update route");
        }
    }

    async delete(id) {
        const query = `DELETE FROM routes WHERE id = $1 RETURNING *;`;
        try {
            const dbRes = await pool.query(query, [id]);
            return dbRes.rows[0];
        } catch (error) {
            throw new Error("Unable to delete route");
        }
    }
}

export default new RoutesModel();