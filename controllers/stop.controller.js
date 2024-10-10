import StopService from '../services/stop.service.js';

class StopController {
  // Get all stop points
  static async getStop(req, res) {
    try {
      const stops = await StopService.getStop();
      res.json(stops);
    } catch (error) {
      console.error('Error fetching stops:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  // Create a new stop point
  static async createStop(req, res) {
    const { location_name, latitude, longitude, city_name } = req.body;
    try {
      const newStop = await StopService.createStop(location_name, latitude, longitude, city_name);
      res.status(201).json(newStop);
    } catch (error) {
      console.error('Error creating stop point:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

export default StopController;
