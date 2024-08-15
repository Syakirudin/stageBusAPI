import express from "express";
import RoutesController from ".././controllers/routesController.js";

const RoutesRouter = express.Router();

// Routes for user CRUD operations
RoutesRouter.post("/routes", RoutesController.createRoute);
RoutesRouter.get("/routes/:id", RoutesController.getRouteById);
RoutesRouter.get("/routes", RoutesController.getAllRoutes);
RoutesRouter.put("/routes/:id", RoutesController.updateRoute);
RoutesRouter.delete("/routes/:id", RoutesController.deleteRoute);

export default RoutesRouter;