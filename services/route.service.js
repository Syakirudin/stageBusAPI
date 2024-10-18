import pool from "../db/db.connection.js";

class RouteService {
  // Create a route and add stops, inserting missing locations into stop_point if necessary
  static async createRouteWithStops(route_no, stops) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // Validate input stops
      for (let stop of stops) {
        if (
          !stop.location_name ||
          typeof stop.latitude !== "number" ||
          typeof stop.longitude !== "number" ||
          typeof stop.stop_order !== "number"
        ) {
          throw new Error("Invalid stop data");
        }
      }

      // Insert the route
      const insertRouteQuery = `
        INSERT INTO route (route_no)
        VALUES ($1)
        ON CONFLICT (route_no) DO NOTHING
        RETURNING *;
      `;
      const routeRes = await client.query(insertRouteQuery, [route_no]);
      const newRoute = routeRes.rows[0] || { route_no };

      // Insert stop locations into stop_point
      const insertStopPointQuery = `
        INSERT INTO stop_point (location_name, coordinates, city_name)
        VALUES ($1, $2, $3)
        ON CONFLICT (location_name) DO NOTHING; // Adjusted for unique constraint
      `;

      const insertRouteStopQuery = `
        INSERT INTO route_stop (route_no, stop_point_location_name, stop_point_coordinates, stop_order)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
      `;

      for (let stop of stops) {
        const { location_name, latitude, longitude, city_name, stop_order } = stop;
        const coordinates = JSON.stringify({ latitude, longitude });

        // Insert or ignore stop points first
        await client.query(insertStopPointQuery, [
          location_name,
          coordinates,
          city_name,
        ]);
        
        // Insert route stop after ensuring stop point exists
        await client.query(insertRouteStopQuery, [
          route_no,
          location_name,
          coordinates,
          stop_order,
        ]);
      }

      await client.query("COMMIT");

      return { route: newRoute, stops };
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("Error creating route with stops:", error);
      throw new Error("Failed to create route with stops: " + error.message);
    } finally {
      client.release();
    }
  }

  // Retrieve all routes with their stops
  static async getAllRoutesWithStops() {
    const query = `
      SELECT 
        r.route_no,
        sp.location_name,
        rs.stop_point_coordinates ->> 'latitude' AS latitude,
        rs.stop_point_coordinates ->> 'longitude' AS longitude,
        sp.city_name,
        rs.stop_order
      FROM route r
      LEFT JOIN route_stop rs ON r.route_no = rs.route_no
      LEFT JOIN stop_point sp ON rs.stop_point_location_name = sp.location_name
      ORDER BY r.route_no, rs.stop_order;
    `;

    try {
      const res = await pool.query(query);

      if (res.rows.length === 0) {
        return [];
      }

      const routes = {};

      res.rows.forEach((row) => {
        const {
          route_no,
          location_name,
          latitude,
          longitude,
          city_name,
          stop_order,
        } = row;

        if (!routes[route_no]) {
          routes[route_no] = {
            route_no,
            stops: [],
          };
        }

        routes[route_no].stops.push({
          location_name,
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          city_name,
          stop_order,
        });
      });

      return Object.values(routes);
    } catch (error) {
      console.error("Error fetching routes with stops:", error);
      throw error;
    }
  }

  // Update route
  static async updateRoute(route_no, updatedData) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const updateRouteQuery = `
      UPDATE route
      SET route_no = $1
      WHERE route_no = $2
      RETURNING *;
    `;
      const res = await client.query(updateRouteQuery, [
        updatedData.route_no,
        route_no,
      ]);
      const updatedRoute = res.rows[0];

      if (!updatedRoute) {
        throw new Error("Route not found");
      }

      // Optionally update stops if provided
      if (updatedData.stops) {
        const deleteStopsQuery = `DELETE FROM route_stop WHERE route_no = $1;`;
        await client.query(deleteStopsQuery, [route_no]);

        const insertRouteStopQuery = `
        INSERT INTO route_stop (route_no, stop_point_location_name, stop_point_coordinates, stop_order)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
      `;

        const updateStopPointQuery = `
        UPDATE stop_point
        SET coordinates = $1, city_name = $2
        WHERE location_name = $3
        RETURNING *;
      `;

        for (let stop of updatedData.stops) {
          const coordinates = JSON.stringify({
            latitude: stop.latitude,
            longitude: stop.longitude,
          });

          // Update stop_point if it exists
          await client.query(updateStopPointQuery, [
            coordinates,
            stop.city_name,
            stop.location_name,
          ]);

          // Insert route stop
          await client.query(insertRouteStopQuery, [
            updatedData.route_no,
            stop.location_name,
            coordinates,
            stop.stop_order,
          ]);
        }
      }

      await client.query("COMMIT");
      return { route: updatedRoute, stops: updatedData.stops };
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("Error updating route:", error);
      throw error;
    } finally {
      client.release();
    }
  }

  // Delete route
  static async deleteRoute(route_no) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // Get stops associated with the route before deletion
      const getStopsQuery = `SELECT stop_point_location_name FROM route_stop WHERE route_no = $1;`;
      const stopsRes = await client.query(getStopsQuery, [route_no]);
      const stopLocations = stopsRes.rows.map(
        (stop) => stop.stop_point_location_name
      );

      // Delete stops associated with the route
      const deleteStopsQuery = `DELETE FROM route_stop WHERE route_no = $1;`;
      await client.query(deleteStopsQuery, [route_no]);

      // Delete the route
      const deleteRouteQuery = `DELETE FROM route WHERE route_no = $1 RETURNING *;`;
      const res = await client.query(deleteRouteQuery, [route_no]);
      const deletedRoute = res.rows[0];

      // If you want to delete stop points that are not referenced by any other route
      const deleteStopPointsQuery = `
      DELETE FROM stop_point
      WHERE location_name = ANY($1)
      AND NOT EXISTS (
        SELECT 1 FROM route_stop WHERE stop_point_location_name = location_name
      );
    `;
      await client.query(deleteStopPointsQuery, [stopLocations]);

      await client.query("COMMIT");
      return deletedRoute; // Return the deleted route info (if needed)
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("Error deleting route:", error);
      throw error;
    } finally {
      client.release();
    }
  }
}

export default RouteService;
