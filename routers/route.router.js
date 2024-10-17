import express from "express";
import AuthMiddleware from "../middlewares/auth.middleware.js";
import RouteController from "../controllers/route.controller.js";

const RouteRouter = express.Router();

RouteRouter.post("/", AuthMiddleware.authenticate, RouteController.createRouteWithStops);

RouteRouter.get("/", RouteController.getAllRoutesWithStops);

RouteRouter.put("/:route_no", AuthMiddleware.authenticate, RouteController.updateRoute);

RouteRouter.delete("/:route_no", AuthMiddleware.authenticate, RouteController.deleteRoute);

export default RouteRouter;
