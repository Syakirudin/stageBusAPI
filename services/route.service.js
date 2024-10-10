import pool from '../../backend/db/db.connection.js';

class RouteService {
  // Create a route and add stops, inserting missing locations into stop_point if necessary
  static async createRouteWithStops(route_no, stops) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Validate input stops
      for (let stop of stops) {
        if (!stop.location_name || typeof stop.latitude !== 'number' || typeof stop.longitude !== 'number' || typeof stop.stop_order !== 'number') {
          throw new Error('Invalid stop data');
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

      // Check and insert stop locations into stop_point
      const insertStopPointQuery = `
        INSERT INTO stop_point (location_name, coordinates, city_name)
        VALUES ($1, $2, $3)
        ON CONFLICT (location_name, coordinates) DO NOTHING;
      `;

      const insertRouteStopQuery = `
        INSERT INTO route_stop (route_no, stop_point_location_name, stop_point_coordinates, stop_order)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
      `;

      for (let i = 0; i < stops.length; i++) {
        const { location_name, latitude, longitude, city_name, stop_order } = stops[i];
        const coordinates = JSON.stringify({ latitude, longitude });

        await client.query(insertStopPointQuery, [location_name, coordinates, city_name]);
        await client.query(insertRouteStopQuery, [route_no, location_name, coordinates, stop_order]);
      }

      await client.query('COMMIT');

      return { route: newRoute, stops };
      
    } catch (error) {
      await client.query('ROLLBACK');
      console.error("Error creating route with stops:", error);
      throw new Error('Failed to create route with stops: ' + error.message);
    } finally {
      client.release();
    }
  }

  static async getRoutesWithStops() {
    const query = `
      
    `;
    
    const res = await pool.query(query);
    return res.rows;
  }
  

      
}

export default RouteService;
