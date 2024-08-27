import RouteStopPointsModel from '../models/routeStopModel.js';

class RouteStopPointsController {
  // Create a new route-stop point entry
  async create(req, res) {
    try {
      const newRouteStopPoint = await RouteStopPointsModel.create(req.body);
      res.status(201).json(newRouteStopPoint);
    } catch (error) {
      console.error("Error creating route-stop point:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // Find a route-stop point by ID
  async findById(req, res) {
    try {
      const routeStopPoint = await RouteStopPointsModel.findById(req.params.id);
      if (routeStopPoint) {
        res.status(200).json(routeStopPoint);
      } else {
        res.status(404).json({ message: "Route-Stop Point not found" });
      }
    } catch (error) {
      console.error("Error finding route-stop point by ID:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // Update a route-stop point
  async update(req, res) {
    try {
      const updatedRouteStopPoint = await RouteStopPointsModel.update(req.params.id, req.body);
      if (updatedRouteStopPoint) {
        res.status(200).json(updatedRouteStopPoint);
      } else {
        res.status(404).json({ message: "Route-Stop Point not found" });
      }
    } catch (error) {
      console.error("Error updating route-stop point:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // Delete a route-stop point by ID
  async delete(req, res) {
    try {
      const deletedRouteStopPoint = await RouteStopPointsModel.delete(req.params.id);
      if (deletedRouteStopPoint) {
        res.status(200).json(deletedRouteStopPoint);
      } else {
        res.status(404).json({ message: "Route-Stop Point not found" });
      }
    } catch (error) {
      console.error("Error deleting route-stop point:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // Retrieve all route-stop points
  async findAll(req, res) {
    try {
      const routeStopPoints = await RouteStopPointsModel.findAll();
      res.status(200).json(routeStopPoints);
    } catch (error) {
      console.error("Error retrieving route-stop points:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

export default new RouteStopPointsController();
