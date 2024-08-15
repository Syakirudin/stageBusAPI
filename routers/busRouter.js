import express from "express";
import BusController from ".././controllers/busController.js";

const BusRouter = express.Router();

// Routes for user CRUD operations
BusRouter.post("/bus", BusController.createBus);
BusRouter.get("/bus/:id", BusController.getBusById);
BusRouter.get("/bus", BusController.getAllBuses);
BusRouter.put("/bus/:id", BusController.updateBus);
BusRouter.delete("/bus/:id", BusController.deleteBus);

export default BusRouter;
