import express from "express";
import AuthMiddleware from "../middlewares/auth.middleware.js";
import StopController from "../controllers/stop.controller.js";

const StopRouter = express.Router();

StopRouter.get("/", StopController.getStop);

StopRouter.post("/", AuthMiddleware.authenticate, StopController.createStop);

//StopRouter.post("/", AuthMiddleware.authenticate, StopController.createStop);

export default StopRouter;
