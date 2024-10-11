import express from "express";
import RouteController from "../controllers/route.controller.js";

const RouteRouter = express.Router();

RouteRouter.post("/", RouteController.createRouteWithStops);

RouteRouter.get("/", RouteController.getAllRoutesWithStops);

RouteRouter.put("/:route_no", RouteController.updateRoute);

RouteRouter.delete("/:route_no", RouteController.deleteRoute);

export default RouteRouter;
