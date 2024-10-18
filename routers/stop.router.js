import express from "express";
import AuthMiddleware from "../middlewares/auth.middleware.js";
import StopController from "../controllers/stop.controller.js";

const StopRouter = express.Router();

// Get all stop points - accessible to all authenticated users
StopRouter.get("/", StopController.getStop);

// Create a new stop point - accessible only to authenticated users with specific roles
StopRouter.post("/", AuthMiddleware.authenticate, AuthMiddleware.verifyRole(["admin", "super-admin"]), StopController.createStop);

export default StopRouter;
