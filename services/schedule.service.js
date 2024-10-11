import pool from "../db/db.connection.js";

class ScheduleService {
  // Create a new schedule
  static async createSchedule(route_no, from_location_name, from_coordinates, to_location_name, to_coordinates, trip_name, trip_times) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // Check if the from stop exists
      const fromCheckQuery = `SELECT * FROM stop_point WHERE location_name = $1 AND coordinates = $2;`;
      const fromCheckResult = await client.query(fromCheckQuery, [from_location_name, from_coordinates]);
      if (fromCheckResult.rowCount === 0) {
        throw new Error(`From stop with name '${from_location_name}' and coordinates '${JSON.stringify(from_coordinates)}' does not exist.`);
      }

      // Check if the to stop exists
      const toCheckQuery = `SELECT * FROM stop_point WHERE location_name = $1 AND coordinates = $2;`;
      const toCheckResult = await client.query(toCheckQuery, [to_location_name, to_coordinates]);
      if (toCheckResult.rowCount === 0) {
        throw new Error(`To stop with name '${to_location_name}' and coordinates '${JSON.stringify(to_coordinates)}' does not exist.`);
      }

      // Insert new schedule
      const insertScheduleQuery = `
        INSERT INTO schedule (route_no, from_stop_location_name, from_stop_coordinates, to_stop_location_name, to_stop_coordinates)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id;
      `;
      const scheduleResult = await client.query(insertScheduleQuery, [route_no, from_location_name, from_coordinates, to_location_name, to_coordinates]);
      const scheduleId = scheduleResult.rows[0].id;

      // Insert trip times
      const insertTripTimesQuery = `
        INSERT INTO trip_time (schedule_id, trip_name, trip_time)
        VALUES ($1, $2, $3);
      `;
      for (const time of trip_times) {
        await client.query(insertTripTimesQuery, [scheduleId, trip_name, time]);
      }

      await client.query("COMMIT");
      return { message: "Schedule created successfully." };
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("Error creating schedule:", error);
      throw new Error("Failed to create schedule: " + error.message);
    } finally {
      client.release();
    }
  }

  // Get all schedules
  static async getAllSchedules() {
    const query = `
      SELECT 
        s.route_no, 
        s.from_stop_location_name, 
        s.from_stop_coordinates, 
        s.to_stop_location_name, 
        s.to_stop_coordinates, 
        t.trip_name, 
        t.trip_time
      FROM schedule s
      JOIN trip_time t ON s.id = t.schedule_id;
    `;

    try {
      const result = await pool.query(query);
      const schedules = result.rows;

      // Transform the result into the required JSON structure
      const response = schedules.reduce((acc, curr) => {
        let scheduleEntry = acc.find(entry => entry.route_no === curr.route_no && 
                                               entry.from_stop_location_name === curr.from_stop_location_name &&
                                               entry.to_stop_location_name === curr.to_stop_location_name);
        
        if (!scheduleEntry) {
          scheduleEntry = {
            route_no: curr.route_no,
            from_stop_location_name: curr.from_stop_location_name,
            from_stop_coordinates: curr.from_stop_coordinates,
            to_stop_location_name: curr.to_stop_location_name,
            to_stop_coordinates: curr.to_stop_coordinates,
            trips: []
          };
          acc.push(scheduleEntry);
        }

        let trip = scheduleEntry.trips.find(trip => trip.trip_name === curr.trip_name);
        if (!trip) {
          trip = {
            trip_name: curr.trip_name,
            times: []
          };
          scheduleEntry.trips.push(trip);
        }

        trip.times.push(curr.trip_time);
        return acc;
      }, []);

      return response;
    } catch (error) {
      console.error("Error fetching schedules:", error);
      throw new Error("Failed to retrieve schedules");
    }
  }

  // Update an existing schedule
  static async updateSchedule(id, route_no, from_location_name, from_coordinates, to_location_name, to_coordinates) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // Check if the schedule exists
      const scheduleCheckQuery = `SELECT * FROM schedule WHERE id = $1;`;
      const scheduleCheckRes = await client.query(scheduleCheckQuery, [id]);

      if (scheduleCheckRes.rowCount === 0) {
        throw new Error("Schedule does not exist.");
      }

      // Update schedule
      const updateScheduleQuery = `
        UPDATE schedule
        SET route_no = $1,
            from_stop_location_name = $2,
            from_stop_coordinates = $3,
            to_stop_location_name = $4,
            to_stop_coordinates = $5
        WHERE id = $6
        RETURNING *;  -- Return the updated schedule
      `;
      const updatedRes = await client.query(updateScheduleQuery, [route_no, from_location_name, from_coordinates, to_location_name, to_coordinates, id]);

      await client.query("COMMIT");
      return updatedRes.rows[0]; // Return the updated schedule

    } catch (error) {
      await client.query("ROLLBACK");
      console.error("Error updating schedule:", error);
      throw new Error("Failed to update schedule: " + error.message);
    } finally {
      client.release();
    }
  }

  // Delete a schedule
  static async deleteSchedule(id) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // Check if the schedule exists
      const scheduleCheckQuery = `SELECT * FROM schedule WHERE id = $1;`;
      const scheduleCheckRes = await client.query(scheduleCheckQuery, [id]);

      if (scheduleCheckRes.rowCount === 0) {
        throw new Error("Schedule does not exist.");
      }

      const deleteScheduleQuery = `
        DELETE FROM schedule
        WHERE id = $1
        RETURNING *;  -- Optionally return the deleted schedule
      `;
      const deletedRes = await client.query(deleteScheduleQuery, [id]);
      await client.query("COMMIT");
      return deletedRes.rows[0]; // Return the deleted schedule

    } catch (error) {
      await client.query("ROLLBACK");
      console.error("Error deleting schedule:", error);
      throw new Error("Failed to delete schedule: " + error.message);
    } finally {
      client.release();
    }
  }
}

export default ScheduleService;
