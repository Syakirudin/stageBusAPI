import express from "express";
import StopController from "../controllers/stopController.js";

const StopRouter = express.Router();

// Route to create a new stop point
StopRouter.post("/stops", StopController.createStop);

// Route to get a stop point by ID
StopRouter.get("/stops/:id", StopController.getStopById);

// Route to update a stop point
StopRouter.put("/stops/:id", StopController.updateStop);

// Route to delete a stop point by ID
StopRouter.delete("/stops/:id", StopController.deleteStop);

// Route to get all stop points
StopRouter.get("/stops", StopController.getAllStops);

export default StopRouter;
