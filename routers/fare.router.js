import express from "express";
import AuthMiddleware from "../middlewares/auth.middleware.js";
import FareController from "../controllers/fare.controller.js";


const FareRouter = express.Router();

FareRouter.post("/", AuthMiddleware.authenticate, FareController.createFare);

FareRouter.get("/", FareController.getAllFares);

FareRouter.put("/:id", AuthMiddleware.authenticate, FareController.updateFare);

FareRouter.delete("/:id", AuthMiddleware.authenticate, FareController.deleteFare);

export default FareRouter;
