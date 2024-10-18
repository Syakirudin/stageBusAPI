import FareService from "../services/fare.service.js";

class FareController {
  // Controller for creating fares
  static async addFares(req, res) {
    try {
      const { route_no, fares } = req.body;

      // Validate that `route_no` and `fares` are provided
      if (!route_no || !Array.isArray(fares) || fares.length === 0) {
        return res.status(400).json({ error: "Invalid data. Ensure 'route_no' and 'fares' are provided." });
      }

      // Adding fares using the service
      const addedFares = await FareService.addFares(route_no, fares);
      return res.status(201).json({
        message: "Fares added successfully",
        fares: addedFares,
      });
    } catch (error) {
      console.error("Error adding fares:", error); // Log the error for debugging
      return res.status(500).json({ error: "Failed to add fares. " + error.message });
    }
  }

  static async getFares(req, res) {
    const { route_no } = req.params;

    try {
      const fares = await FareService.getFares(route_no);
      return res.status(200).json(fares);
    } catch (error) {
      console.error("Error fetching fares:", error);
      return res.status(500).json({ error: "Failed to fetch fares: " + error.message });
    }
  }

  // Controller for getting a fare by ID
  static async getFareById(req, res) {
    const { id } = req.params;

    try {
      const fare = await FareService.getFareById(id);
      return res.status(200).json(fare);
    } catch (error) {
      console.error("Error fetching fare:", error);
      return res.status(404).json({ error: error.message });
    }
  }

  // Controller for updating a fare by ID
  static async updateFareById(req, res) {
    const { id } = req.params;
    const { route_no, from_location_name, to_location_name, amount_of_fare } = req.body;

    try {
      const updatedFare = await FareService.updateFareById(id, route_no, from_location_name, to_location_name, amount_of_fare);
      return res.status(200).json({
        message: "Fare updated successfully",
        fare: updatedFare,
      });
    } catch (error) {
      console.error("Error updating fare:", error);
      return res.status(404).json({ error: error.message });
    }
  }

  // Controller for deleting a fare by ID
  static async deleteFareById(req, res) {
    const { id } = req.params;

    try {
      const deletedFare = await FareService.deleteFareById(id);
      return res.status(200).json({
        message: "Fare deleted successfully",
        fare: deletedFare,
      });
    } catch (error) {
      console.error("Error deleting fare:", error);
      return res.status(404).json({ error: error.message });
    }
  }
  
}

export default FareController;
