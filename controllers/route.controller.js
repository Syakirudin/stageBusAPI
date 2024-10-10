import RouteService from "../services/route.service.js";

class RouteController {
  // Get all routes with their stops
  // Get all routes with their stops
  static async getRoutesWithStops(req, res) {
    try {
      const routesWithStops = await RouteService.getRoutesWithStops();

      console.log(
        `Routes fetched from database: ${routesWithStops.length} routes`
      );

      if (routesWithStops.length === 0) {
        console.log("No routes found, returning an empty array.");
        return res.status(200).json([]); // Return an empty array if no routes found
      }

      res.status(200).json(routesWithStops); // Return routes with a 200 status
    } catch (error) {
      console.error("Error fetching routes with stops:", error);
      res.status(500).json({ error: "Internal Server Error" }); // Ensure this is valid JSON
    }
  }

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
}

export default RouteController;
