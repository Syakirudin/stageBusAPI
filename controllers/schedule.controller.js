import ScheduleService from "../services/schedule.service.js";

class ScheduleController {
  // Create a new schedule with trips
  static async createSchedule(req, res) {
    try {
      const {
        route_no,
        from_stop_location_name,
        from_stop_coordinates,
        to_stop_location_name,
        to_stop_coordinates,
        trips // Expecting an array of trips with trip_name and trip_times
      } = req.body;

      const schedule = await ScheduleService.createSchedule(
        route_no,
        from_stop_location_name,
        from_stop_coordinates,
        to_stop_location_name,
        to_stop_coordinates,
        trips
      );

      return res.status(201).json({
        message: "Schedule created successfully.",
        schedule,
      });
    } catch (error) {
      console.error("Error creating schedule:", error);
      return res.status(500).json({ error: "Failed to create schedule." });
    }
  }

  // Get all schedules
  static async getAllSchedules(req, res) {
    try {
      const schedules = await ScheduleService.getAllSchedules();
      return res.status(200).json(schedules);
    } catch (error) {
      console.error("Error fetching schedules:", error);
      return res.status(500).json({ error: "Failed to fetch schedules." });
    }
  }

  // Get a specific schedule by ID
  static async getScheduleById(req, res) {
    try {
      const { id } = req.params;
      const schedule = await ScheduleService.getScheduleById(id);

      if (!schedule) {
        return res.status(404).json({ message: "Schedule not found." });
      }

      return res.status(200).json(schedule);
    } catch (error) {
      console.error("Error fetching schedule:", error);
      return res.status(500).json({ error: "Failed to fetch schedule." });
    }
  }

  // Update a schedule
  static async updateSchedule(req, res) {
    try {
      const { id } = req.params;
      const {
        route_no,
        from_stop_location_name,
        from_stop_coordinates,
        to_stop_location_name,
        to_stop_coordinates,
        trips // Expecting updated trips as well
      } = req.body;

      const updatedSchedule = await ScheduleService.updateSchedule(
        id,
        route_no,
        from_stop_location_name,
        from_stop_coordinates,
        to_stop_location_name,
        to_stop_coordinates,
        trips
      );

      if (!updatedSchedule) {
        return res.status(404).json({ message: "Schedule not found." });
      }

      return res.status(200).json({
        message: "Schedule updated successfully.",
        schedule: updatedSchedule,
      });
    } catch (error) {
      console.error("Error updating schedule:", error);
      return res.status(500).json({ error: "Failed to update schedule." });
    }
  }

  // Delete a schedule
  static async deleteSchedule(req, res) {
    try {
      const { id } = req.params;
      const deleted = await ScheduleService.deleteSchedule(id);

      if (!deleted) {
        return res.status(404).json({ message: "Schedule not found." });
      }

      return res.status(200).json({ message: "Schedule deleted successfully." });
    } catch (error) {
      console.error("Error deleting schedule:", error);
      return res.status(500).json({ error: "Failed to delete schedule." });
    }
  }
}

export default ScheduleController;
