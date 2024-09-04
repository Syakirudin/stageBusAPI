import express from "express";
import StopsController from "../controllers/stopsController.js";

const StopsRoutes = express.Router();

// Get all stops or filter by query parameters
StopsRoutes.get("/stops", StopsController.getStops);

// Route to add a new stop
StopsRoutes.post("/stops", StopsController.addStop);

// Route to create a new route with associated stops
StopsRoutes.post("/route-stop", StopsController.createRouteWithStops);

export default StopsRoutes;
