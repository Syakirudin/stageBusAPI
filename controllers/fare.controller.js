import FareService from "../services/fare.service.js";

class FareController {
  // Controller for creating a fare
  static async createFare(req, res) {
    try {
      const fareData = req.body;
      const newFare = await FareService.createFare(fareData);
      return res.status(201).json(newFare);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  // Controller for getting all fares
  static async getAllFares(req, res) {
    try {
      const fares = await FareService.getAllFares();
      return res.status(200).json(fares);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  // Controller for updating a fare by id
  static async updateFare(req, res) {
    try {
      const fareId = req.params.id;
      const fareData = req.body;
      const updatedFare = await FareService.updateFare(fareId, fareData);
      if (!updatedFare) {
        return res.status(404).json({ message: "Fare not found" });
      }
      return res.status(200).json(updatedFare);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  // Controller for deleting a fare by id
  static async deleteFare(req, res) {
    try {
      const fareId = req.params.id;
      const deletedFare = await FareService.deleteFare(fareId);
      if (!deletedFare) {
        return res.status(404).json({ message: "Fare not found" });
      }
      return res.status(200).json(deletedFare);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}

export default FareController;
