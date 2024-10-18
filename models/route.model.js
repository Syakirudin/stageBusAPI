import pool from "../db/db.connection.js";

class RouteModel {
  static async createRouteTable() {
    const query = `
        CREATE TABLE IF NOT EXISTS route (
            route_no VARCHAR(50) PRIMARY KEY,                            
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS route_stop (
            route_no VARCHAR(50) REFERENCES route(route_no) ON DELETE CASCADE,  -- Foreign key to route table (by route_no)
            stop_point_location_name VARCHAR(255) NOT NULL,                     -- Location name from stop_point
            stop_point_coordinates JSONB NOT NULL,                              -- Coordinates from stop_point
            stop_order INT NOT NULL,                                            -- Stop order on the route

            PRIMARY KEY (route_no, stop_point_location_name, stop_point_coordinates), -- Composite primary key
            FOREIGN KEY (stop_point_location_name, stop_point_coordinates) 
            REFERENCES stop_point(location_name, coordinates) ON DELETE CASCADE  -- Foreign key to stop_point
        );
    `;

    try {
      await pool.query(query);
      console.log("Route table created or already exists."); // Log the result of the query
    } catch (error) {
      console.error("Error creating Route table:", error.message); // Log the error message
    }
  }
}

// Call the method to create the table
RouteModel.createRouteTable();

export default RouteModel;
