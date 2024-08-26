import StopModel from "../models/stopsModel.js";

class StopController {
  // Create a new stop point
  async createStop(req, res) {
    try {
      const { location_name, city_name, coordinate } = req.body;

      // Create stop point
      const createdStop = await StopModel.create({
        location_name,
        city_name,
        coordinate,
      });

      // Send response
      res.status(201).json({
        message: "Stop point created successfully",
        stop: createdStop,
      });
    } catch (error) {
      console.error("Error creating stop point:", error);
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // Get a stop point by ID
  async getStopById(req, res) {
    try {
      const stop = await StopModel.findById(req.params.id);
      if (!stop) {
        return res.status(404).json({ message: "Stop point not found" });
      }
      res.status(200).json(stop);
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // Update a stop point
  async updateStop(req, res) {
    try {
      const updatedStop = await StopModel.update(req.params.id, req.body);
      if (!updatedStop) {
        return res.status(404).json({ message: "Stop point not found" });
      }
      res.status(200).json({
        message: "Stop point updated successfully",
        stop: updatedStop,
      });
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // Delete a stop point by ID
  async deleteStop(req, res) {
    try {
      const deletedStop = await StopModel.delete(req.params.id);
      if (!deletedStop) {
        return res.status(404).json({ message: "Stop point not found" });
      }
      res.status(200).json({
        message: "Stop point deleted successfully",
        stop: deletedStop,
      });
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // Get all stop points
  async getAllStops(req, res) {
    try {
      const stops = await StopModel.findAll();
      res.status(200).json(stops);
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  }
}

export default new StopController();
