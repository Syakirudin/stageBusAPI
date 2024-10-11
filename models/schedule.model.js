import pool from "../db/db.connection.js";

class ScheduleModel {
  static async createScheduleTable() {
    const query = `       
            CREATE TABLE IF NOT EXISTS schedule (
                id SERIAL PRIMARY KEY,
                route_no VARCHAR(50) NOT NULL REFERENCES route(route_no) ON DELETE CASCADE,  
                from_stop_location_name VARCHAR(255),
                from_stop_coordinates JSONB,
                to_stop_location_name VARCHAR(255),
                to_stop_coordinates JSONB,
                FOREIGN KEY (from_stop_location_name, from_stop_coordinates) REFERENCES stop_point(location_name, coordinates),
                FOREIGN KEY (to_stop_location_name, to_stop_coordinates) REFERENCES stop_point(location_name, coordinates)

            );

            CREATE TABLE IF NOT EXISTS trip_time (
                id SERIAL PRIMARY KEY,
                schedule_id INT NOT NULL REFERENCES schedule(id) ON DELETE CASCADE,  -- Foreign key to schedule
                trip_name VARCHAR(50) NOT NULL,                                   -- The name of the trip
                trip_time TIME [] NOT NULL                                           -- The trip time (e.g., 06:30)
            );




        `;

    try {
      const res = await pool.query(query);
      console.log("Schedule table created or already exists."); // Log the result of the query
    } catch (error) {
      console.error("Error creating Schedule table:", error.message); // Log the error message
    }
  }
}

// Call the method to create the table
ScheduleModel.createScheduleTable();

export default ScheduleModel;
