import pool from "../db/db.connection.js";

class ScheduleService {
  // Create a new schedule and associated trips
  static async createSchedule(route_no, from_location_name, from_coordinates, to_location_name, to_coordinates, trips) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // Check if from and to locations exist
      const fromStopQuery = `
        SELECT * FROM stop_point WHERE location_name = $1 AND coordinates = $2;
      `;
      const toStopQuery = `
        SELECT * FROM stop_point WHERE location_name = $1 AND coordinates = $2;
      `;

      const fromStopResult = await client.query(fromStopQuery, [from_location_name, from_coordinates]);
      const toStopResult = await client.query(toStopQuery, [to_location_name, to_coordinates]);

      if (fromStopResult.rowCount === 0 || toStopResult.rowCount === 0) {
        throw new Error("From or To stop locations do not exist in the database.");
      }

      // Insert into schedule table
      const insertScheduleQuery = `
        INSERT INTO schedule (route_no, from_stop_location_name, from_stop_coordinates, to_stop_location_name, to_stop_coordinates)
        VALUES ($1, $2, $3, $4, $5) RETURNING id;
      `;

      const scheduleResult = await client.query(insertScheduleQuery, [
        route_no, from_location_name, from_coordinates, to_location_name, to_coordinates
      ]);

      const scheduleId = scheduleResult.rows[0].id;

      // Insert trips into trip_time table
      const insertTripQuery = `
        INSERT INTO trip_time (schedule_id, trip_name, trip_time)
        VALUES ($1, $2, UNNEST($3::TIME[]));
      `;

      for (const trip of trips) {
        const { trip_name, trip_times } = trip;
        await client.query(insertTripQuery, [scheduleId, trip_name, trip_times]);
      }

      await client.query("COMMIT");
      return { message: "Schedule and trips created successfully." };
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
        s.id as schedule_id,
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

      // Group the data into a structured JSON response
      const groupedData = schedules.reduce((acc, curr) => {
        const { schedule_id, route_no, from_stop_location_name, from_stop_coordinates, to_stop_location_name, to_stop_coordinates, trip_name, trip_time } = curr;

        let scheduleEntry = acc.find(item => item.schedule_id === schedule_id);
        if (!scheduleEntry) {
          scheduleEntry = {
            schedule_id,
            route_no,
            from_stop: { location_name: from_stop_location_name, coordinates: from_stop_coordinates },
            to_stop: { location_name: to_stop_location_name, coordinates: to_stop_coordinates },
            trips: []
          };
          acc.push(scheduleEntry);
        }

        let tripEntry = scheduleEntry.trips.find(trip => trip.trip_name === trip_name);
        if (!tripEntry) {
          tripEntry = { trip_name, trip_times: [] };
          scheduleEntry.trips.push(tripEntry);
        }

        tripEntry.trip_times.push(trip_time);

        return acc;
      }, []);

      return groupedData;
    } catch (error) {
      console.error("Error retrieving schedules:", error);
      throw new Error("Failed to retrieve schedules");
    }
  }

  static async updateSchedule(schedule_id, route_no, from_location_name, from_coordinates, to_location_name, to_coordinates, trips) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // Check if from and to locations exist
      const fromStopQuery = `
        SELECT * FROM stop_point WHERE location_name = $1 AND coordinates = $2;
      `;
      const toStopQuery = `
        SELECT * FROM stop_point WHERE location_name = $1 AND coordinates = $2;
      `;

      const fromStopResult = await client.query(fromStopQuery, [from_location_name, from_coordinates]);
      const toStopResult = await client.query(toStopQuery, [to_location_name, to_coordinates]);

      if (fromStopResult.rowCount === 0 || toStopResult.rowCount === 0) {
        throw new Error("From or To stop locations do not exist in the database.");
      }

      // Update the schedule details
      const updateScheduleQuery = `
        UPDATE schedule
        SET route_no = $1, 
            from_stop_location_name = $2, 
            from_stop_coordinates = $3, 
            to_stop_location_name = $4, 
            to_stop_coordinates = $5
        WHERE id = $6;
      `;

      await client.query(updateScheduleQuery, [
        route_no, from_location_name, from_coordinates, to_location_name, to_coordinates, schedule_id
      ]);

      // Delete existing trips for this schedule
      const deleteTripsQuery = `DELETE FROM trip_time WHERE schedule_id = $1;`;
      await client.query(deleteTripsQuery, [schedule_id]);

      // Insert new trips into trip_time table
      const insertTripQuery = `
        INSERT INTO trip_time (schedule_id, trip_name, trip_time)
        VALUES ($1, $2, UNNEST($3::TIME[]));
      `;

      for (const trip of trips) {
        const { trip_name, trip_times } = trip;
        await client.query(insertTripQuery, [schedule_id, trip_name, trip_times]);
      }

      await client.query("COMMIT");
      return { message: "Schedule updated successfully." };
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("Error updating schedule:", error);
      throw new Error("Failed to update schedule: " + error.message);
    } finally {
      client.release();
    }
  }

  // Delete a schedule by ID
  static async deleteSchedule(schedule_id) {
    const query = `
      DELETE FROM schedule WHERE id = $1;
    `;

    try {
      await pool.query(query, [schedule_id]);
      return { message: "Schedule deleted successfully." };
    } catch (error) {
      console.error("Error deleting schedule:", error);
      throw new Error("Failed to delete schedule");
    }
  }

  static async getScheduleById(schedule_id) {
    const query = `
      SELECT 
        s.id AS schedule_id,
        s.route_no,
        s.from_stop_location_name,
        s.from_stop_coordinates,
        s.to_stop_location_name,
        s.to_stop_coordinates,
        json_agg(json_build_object(
          'trip_name', t.trip_name,
          'trip_times', t.trip_time
        )) AS trips
      FROM schedule s
      LEFT JOIN trip_time t ON s.id = t.schedule_id
      WHERE s.id = $1
      GROUP BY s.id;
    `;

    try {
      const result = await pool.query(query, [schedule_id]);
      if (result.rowCount === 0) {
        return { message: "Schedule not found." };
      }
      return result.rows[0];
    } catch (error) {
      console.error("Error retrieving schedule:", error);
      throw new Error("Failed to retrieve schedule");
    }
  }

  // Fetch all schedules
  // static async getAllSchedules() {
  //   const query = `
  //     SELECT 
  //       s.id AS schedule_id,
  //       s.route_no,
  //       s.from_stop_location_name,
  //       s.from_stop_coordinates,
  //       s.to_stop_location_name,
  //       s.to_stop_coordinates,
  //       json_agg(json_build_object(
  //         'trip_name', t.trip_name,
  //         'trip_times', t.trip_time
  //       )) AS trips
  //     FROM schedule s
  //     LEFT JOIN trip_time t ON s.id = t.schedule_id
  //     GROUP BY s.id;
  //   `;

  //   try {
  //     const result = await pool.query(query);
  //     return result.rows;
  //   } catch (error) {
  //     console.error("Error retrieving schedules:", error);
  //     throw new Error("Failed to retrieve schedules");
  //   }
  // }
}

export default ScheduleService;
