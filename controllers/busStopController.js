import BusStopModel from "../models/busStopModel.js";

class BusStopController {
  // Create a new bus stop
  async createBusStop(req, res) {
    const {
      route_id,
      city_name,
      stop_order,
      created_at,  // Changed to match other usages
      coordinate,
      stop_name,
      stop_type,
    } = req.body;

    // Input validation could be added here

    try {
      const newBusStop = await BusStopModel.create(
        route_id,
        city_name,
        stop_order,
        created_at,
        coordinate,
        stop_name,
        stop_type
      );
      res.status(201).json({
        message: "Bus stop created successfully",
        bus_stop: newBusStop,
      });
    } catch (error) {
      console.error("Error creating bus stop:", error); 
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // Get all bus stops
  async getAllBusStops(req, res) {
    try {
      const busStops = await BusStopModel.findAll();
      res.status(200).json(busStops);
    } catch (error) {
      console.error("Error fetching bus stops:", error.message);
      res.status(500).json({
        message: "Internal server error",
      });
    }
  }

  // Get a bus stop by ID
  async getBusStopById(req, res) {
    const id = req.params.id;
    try {
      const busStop = await BusStopModel.findById(id);
      if (!busStop) {
        return res.status(404).json({
          message: "Bus stop not found",
        });
      }
      res.status(200).json(busStop);
    } catch (error) {
      console.error("Error fetching bus stop by ID:", error.message);
      res.status(500).json({
        message: "Internal server error",
      });
    }
  }

  // Update a bus stop
  async updateBusStop(req, res) {
    const id = req.params.id;
    const updatedFields = req.body;

    // Input validation could be added here

    try {
      const updatedBusStop = await BusStopModel.update(id, updatedFields);
      if (!updatedBusStop) {
        return res.status(404).json({
          message: "Bus stop not found",
        });
      }
      res.status(200).json({
        message: "Bus stop updated successfully",
        bus_stop: updatedBusStop,
      });
    } catch (error) {
      console.error("Error updating bus stop:", error.message);
      res.status(500).json({
        message: "Internal server error",
      });
    }
  }

  // Delete a bus stop
  async deleteBusStop(req, res) {
    const id = req.params.id;
    try {
      const deletedBusStop = await BusStopModel.delete(id);
      if (!deletedBusStop) {
        return res.status(404).json({
          message: "Bus stop not found",
        });
      }
      res.status(200).json({
        message: "Bus stop deleted successfully",
        bus_stop: deletedBusStop,
      });
    } catch (error) {
      console.error("Error while deleting bus stop:", error);
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  }
}

export default new BusStopController();
