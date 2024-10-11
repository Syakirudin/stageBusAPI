import express from "express";
import FareController from "../controllers/fare.controller.js";

const FareRouter = express.Router();

FareRouter.post("/", FareController.createFare);

FareRouter.get("/", FareController.getAllFares);

FareRouter.put("/:id", FareController.updateFare);

FareRouter.delete("/:id", FareController.deleteFare);

export default FareRouter;
