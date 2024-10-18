import express from "express";
import AuthMiddleware from "../middlewares/auth.middleware.js";
import RouteController from "../controllers/route.controller.js";

const RouteRouter = express.Router();

// Create a new route with stops
RouteRouter.post("/", AuthMiddleware.authenticate, RouteController.createRouteWithStops);

// Retrieve all routes with stops
RouteRouter.get("/", RouteController.getAllRoutesWithStops);

// Update an existing route by route_no
RouteRouter.put("/:route_no", AuthMiddleware.authenticate, RouteController.updateRoute);

// Delete a route by route_no
RouteRouter.delete("/:route_no", AuthMiddleware.authenticate, RouteController.deleteRoute);

export default RouteRouter;
