import StopsModel from '../models/stopsModel.js';

class StopsController {
  // Get stops with optional filtering
  async getStops(req, res) {
    try {
      const stops = await StopsModel.getStops(req.query);
      res.status(200).json(stops);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  
}

export default new StopsController();
