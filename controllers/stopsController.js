import StopsModel from "../models/stopsModel.js";

class StopsController {
  async addStop(req, res) {
    try {
      console.log("Received routeData:", req.body.routeData); // Log received data
      const stop = await StopsModel.addStop(
        req.body.stopData,
        req.body.routeData
      );
      res.status(201).json(stop);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getStops(req, res) {
    try {
      const stops = await StopsModel.getStops(req.query);
      res.status(200).json(stops);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async createRouteWithStops(req, res) {
    try {
      const { routeData, stopsData } = req.body;
      const result = await StopsModel.createRouteWithStops(
        routeData,
        stopsData
      );
      res.status(201).json(result);
    } catch (error) {
      console.error("Error creating route with stops:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

export default new StopsController();
