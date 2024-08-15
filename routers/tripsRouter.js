import express from "express";
import TripsController from ".././controllers/tripsController.js";

const TripsRouter = express.Router();

// Routes for user CRUD operations
TripsRouter.post("/trips", TripsController.createTrip);
TripsRouter.get("/trips/:id", TripsController.getTripById);
TripsRouter.get("/trips", TripsController.getAllTrips);
TripsRouter.put("/trips/:id", TripsController.updateTrip);
TripsRouter.delete("/trips/:id", TripsController.deleteTrip);

export default TripsRouter;
