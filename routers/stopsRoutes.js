import express from 'express';
import StopsController from '../controllers/stopsController.js';

const StopsRoutes = express.Router();

// Get all stops or filter by query parameters
StopsRoutes.get('/stops', StopsController.getStops);



export default StopsRoutes;
