import express from "express";
// import AuthMiddleware from "../middlewares/auth.middleware.js";
import FareController from "../controllers/fare.controller.js";

const FareRouter = express.Router();

// Route for adding fares
FareRouter.post("/", FareController.addFares);

// Route for getting all fares
FareRouter.get("/", FareController.getAllFares);

// Route for getting all fares for a specific route
FareRouter.get("/:route_no", FareController.getFares);

// Route for getting a fare by ID
FareRouter.get("/fare/:id", FareController.getFareById);

// Route for updating a fare by ID
FareRouter.put("/fare/:id", FareController.updateFareById);

// Route for deleting a fare by ID
FareRouter.delete("/fare/:id", FareController.deleteFareById);

export default FareRouter;
