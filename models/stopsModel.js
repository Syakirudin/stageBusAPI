import { pool } from "../db/connection.js";

class StopsModel {
  async getStops(stopData = {}) {
    try {
      const { route_id, location_name, city_name, coordinate } = stopData;
      let query = `SELECT * FROM "StopPoint"`;
      const queryParams = [];
      const conditions = [];

      // Add conditions dynamically
      if (route_id) {
        conditions.push(`route_id = $${conditions.length + 1}`);
        queryParams.push(route_id);
      }

      if (location_name) {
        conditions.push(`location_name = $${conditions.length + 1}`);
        queryParams.push(location_name);
      }

      if (city_name) {
        conditions.push(`city_name = $${conditions.length + 1}`);
        queryParams.push(city_name);
      }

      if (coordinate) {
        conditions.push(`coordinate = $${conditions.length + 1}`);
        queryParams.push(coordinate);
      }

      // Append conditions to query
      if (conditions.length > 0) {
        query += ` WHERE ${conditions.join(" AND ")}`;
      }

      const result = await pool.query(query, queryParams);
      return result.rows;
    } catch (error) {
      console.error("Error retrieving stops from database:", error);
      throw error;
    }
  }

  // Add a new stop
  async addStop(stopData, routeData) {
    try {
      const { no_route } = routeData;
      console.log("Route No:", no_route); // Log the route number

      // Insert into the Route table
      const routeQuery = `INSERT INTO "Route" (no_route) VALUES ($1) RETURNING id;`;
      const routeResult = await pool.query(routeQuery, [no_route]);
      const routeId = routeResult.rows[0].id;

      // Insert into the StopPoint table
      const stopPointQuery = `INSERT INTO "StopPoint" (location_name, city_name, coordinate, route_id) VALUES ($1, $2, $3, $4) RETURNING *;`;
      const results = [];
      for (const stop of stopData) {
        const result = await pool.query(stopPointQuery, [
          stop.location_name,
          stop.city_name,
          stop.coordinate,
          routeId,
        ]);
        results.push(result.rows[0]);
      }

      return results;
    } catch (error) {
      console.error("Error adding stop and route to database:", error);
      throw error;
    }
  }

  async createRouteWithStops(routeData, stopsData) {
    try {
      // Start a transaction
      await pool.query("BEGIN");

      // Insert the route into the Route table
      const routeQuery = `INSERT INTO "Route" (no_route) VALUES ($1) RETURNING id;`;
      const routeResult = await pool.query(routeQuery, [routeData.no_route]);
      const routeId = routeResult.rows[0].id;

      // Insert each stop point into the StopPoint table and then into RouteStopPoint table
      const stopPointQuery = `
        INSERT INTO "StopPoint" (route_id, location_name, city_name, coordinate) 
        VALUES ($1, $2, $3, $4) RETURNING id;
      `;
      const routeStopPointQuery = `
        INSERT INTO "RouteStopPoint" (route_id, stop_point_id, stop_order) 
        VALUES ($1, $2, $3);
      `;

      for (const stop of stopsData) {
        // Insert into StopPoint table
        const stopPointResult = await pool.query(stopPointQuery, [
          routeId,
          stop.location_name,
          stop.city_name,
          stop.coordinate,
        ]);
        const stopPointId = stopPointResult.rows[0].id;

        // Insert into RouteStopPoint table
        await pool.query(routeStopPointQuery, [
          routeId,
          stopPointId,
          stop.stop_order,
        ]);
      }

      // Commit the transaction
      await pool.query("COMMIT");

      return { message: "Route and stops created successfully!" };
    } catch (error) {
      // Rollback the transaction in case of error
      await pool.query("ROLLBACK");
      console.error("Error creating route with stops:", error);
      throw error;
    }
  }
}

export default new StopsModel();
