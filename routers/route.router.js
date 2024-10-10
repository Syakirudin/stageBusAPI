import express from "express";
import RouteController from "../controllers/route.controller.js";

const RouteRouter = express.Router();

// Get all routes with their stops
RouteRouter.get("/", RouteController.getRoutesWithStops);

// Create a new route and add stops to it simultaneously
RouteRouter.post("/", RouteController.createRouteWithStops);

export default RouteRouter;
