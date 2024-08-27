import express from 'express';
import routeStopController from '../controllers/routeStopController.js'; // Adjust the path as needed

const RouteStopRouter = express.Router();

// Route to create a new route-stop point
RouteStopRouter.post('/', routeStopController.create);

// Route to get a route-stop point by ID
RouteStopRouter.get('/:id', routeStopController.findById);

// Route to update a route-stop point by ID
RouteStopRouter.put('/:id', routeStopController.update);

// Route to delete a route-stop point by ID
RouteStopRouter.delete('/:id', routeStopController.delete);

// Route to get all route-stop points
RouteStopRouter.get('/', routeStopController.findAll);

export default RouteStopRouter;
