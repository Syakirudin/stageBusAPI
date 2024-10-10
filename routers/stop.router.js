import express from "express";
import StopController from "../controllers/stop.controller.js";

const StopRouter = express.Router();

// Get all stop points
StopRouter.get("/", StopController.getStop);

// Create a new stop point
StopRouter.post("/", StopController.createStop);

// Add more routes for updating and deleting stops as needed

export default StopRouter;
