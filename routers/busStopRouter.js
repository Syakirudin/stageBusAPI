import express from "express";
import BusStopController from ".././controllers/busStopController.js";

const BusStopRouter = express.Router();

// Routes for user CRUD operations
BusStopRouter.post("/busStops", BusStopController.createBusStop);
BusStopRouter.get("/busStops/:id", BusStopController.getBusStopById);
BusStopRouter.get("/busStops", BusStopController.getAllBusStops);
BusStopRouter.put("/busStops/:id", BusStopController.updateBusStop);
BusStopRouter.delete("/busStops/:id", BusStopController.deleteBusStop);

export default BusStopRouter;