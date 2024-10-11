import ScheduleService from "../services/schedule.service.js";

class ScheduleController {
  // Create a new schedule
  static async createSchedule(req, res) {
    const { route_no, from_location_name, from_coordinates, to_location_name, to_coordinates, trip_name, trip_times } = req.body;

    try {
      const result = await ScheduleService.createSchedule(route_no, from_location_name, from_coordinates, to_location_name, to_coordinates, trip_name, trip_times);
      return res.status(201).json(result);
    } catch (error) {
      console.error("Error in createSchedule:", error);
      return res.status(500).json({ message: error.message });
    }
  }

  // Get all schedules
  static async getAllSchedules(req, res) {
    try {
      const schedules = await ScheduleService.getAllSchedules();
      return res.status(200).json(schedules);
    } catch (error) {
      console.error("Error in getAllSchedules:", error);
      return res.status(500).json({ message: error.message });
    }
  }

   // Update an existing schedule
   static async updateSchedule(req, res) {
    const { id } = req.params; // Get the schedule ID from the request parameters
    const { route_no, from_location_name, from_coordinates, to_location_name, to_coordinates } = req.body;

    try {
      const updatedSchedule = await ScheduleService.updateSchedule(
        id,
        route_no,
        from_location_name,
        from_coordinates,
        to_location_name,
        to_coordinates
      );
      res.status(200).json(updatedSchedule); // Respond with the updated schedule
    } catch (error) {
      console.error("Error updating schedule:", error.message);
      res.status(500).json({ error: "Failed to update schedule", details: error.message });
    }
  }

  // Delete a schedule
  static async deleteSchedule(req, res) {
    const { id } = req.params; // Get the schedule ID from the request parameters

    try {
      const deletedSchedule = await ScheduleService.deleteSchedule(id);
      res.status(200).json({
        message: "Schedule deleted successfully",
        schedule: deletedSchedule,
      }); // Respond with a success message
    } catch (error) {
      console.error("Error deleting schedule:", error.message);
      res.status(500).json({ error: "Failed to delete schedule", details: error.message });
    }
  }
}

export default ScheduleController;
