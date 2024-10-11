import RouteService from "../services/route.service.js";

class RouteController {
  // Create a new route with stops
  static async createRouteWithStops(req, res) {
    console.log("Incoming request body:", req.body);

    if (!req.body || Object.keys(req.body).length === 0) {
      console.error("Request body is empty or missing.");
      return res.status(400).json({ error: "Request body cannot be empty" });
    }

    const { route_no, stops } = req.body;

    if (!route_no || !Array.isArray(stops)) {
      return res.status(400).json({ error: "Invalid route_no or stops" });
    }

    try {
      const newRoute = await RouteService.createRouteWithStops(route_no, stops);
      res.status(201).json(newRoute); // Return the newly created route and stops
    } catch (error) {
      console.error("Error creating route with stops:", error.message);
      res.status(500).json({
        error: "Error creating route with stops",
        details: error.message,
      });
    }
  }
  static async getAllRoutesWithStops(req, res) {
    try {
      console.log("Fetching all routes with stops...");
      const routes = await RouteService.getAllRoutesWithStops();
      console.log("Routes fetched successfully:", routes);

      // Set the Content-Type header explicitly
      res.setHeader("Content-Type", "application/json");

      // Stringify the JSON and log it before sending
      const jsonResponse = JSON.stringify(routes);
      console.log("Sending JSON response:", jsonResponse);

      res.status(200).send(jsonResponse);
    } catch (error) {
      console.error("Error fetching all routes with stops:", error);

      // Set the Content-Type header explicitly
      res.setHeader("Content-Type", "application/json");

      const errorResponse = JSON.stringify({
        error: "Error fetching routes with stops",
        details: error.message,
      });
      console.log("Sending error response:", errorResponse);

      res.status(500).send(errorResponse);
    }
  }

  // In your RouteController.js
  static async updateRoute(req, res) {
    const route_no = req.params.route_no; // Assuming route_no is passed as a URL parameter
    const updatedData = req.body; // The updated data should be in the request body

    console.log("Updating route:", route_no);
    console.log("Updated data:", updatedData);

    try {
      // Validate the updated data
      if (!updatedData || Object.keys(updatedData).length === 0) {
        return res.status(400).json({ error: "No data provided for update." });
      }

      const updatedRoute = await RouteService.updateRoute(
        route_no,
        updatedData
      );
      res.status(200).json(updatedRoute); // Respond with the updated route information
    } catch (error) {
      console.error("Error updating route:", error.message);
      res.status(500).json({
        error: "Error updating route",
        details: error.message,
      });
    }
  }

  // In your RouteController.js
  static async deleteRoute(req, res) {
    const route_no = req.params.route_no; // Assuming route_no is passed as a URL parameter

    console.log("Deleting route:", route_no);

    try {
      const deletedRoute = await RouteService.deleteRoute(route_no);
      res.status(200).json({
        message: "Route deleted successfully",
        route: deletedRoute,
      });
    } catch (error) {
      console.error("Error deleting route:", error.message);
      res.status(500).json({
        error: "Error deleting route",
        details: error.message,
      });
    }
  }
}

export default RouteController;
