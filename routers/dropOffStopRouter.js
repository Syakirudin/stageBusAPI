import express from "express";
import DropOffStopController from ".././controllers/dropOffStopController.js";

const DropOffStopRouter = express.Router();

// Routes for user CRUD operations
DropOffStopRouter.post("/dropOffStops", DropOffStopController.createDropOffStop);
DropOffStopRouter.get("/dropOffStops/:id", DropOffStopController.getDropOffStopById);
DropOffStopRouter.get("/dropOffStops", DropOffStopController.getAllDropOffStops);
DropOffStopRouter.put("/dropOffStops/:id", DropOffStopController.updateDropOffStop);
DropOffStopRouter.delete("/dropOffStops/:id", DropOffStopController.deleteDropOffStop);

export default DropOffStopRouter;
