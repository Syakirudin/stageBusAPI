import express from "express";
import AuthMiddleware from "../middlewares/auth.middleware.js";
import ScheduleController from "../controllers/schedule.controller.js";

const ScheduleRouter = express.Router();

ScheduleRouter.get("/", ScheduleController.getAllSchedules);

ScheduleRouter.post("/", AuthMiddleware.authenticate, ScheduleController.createSchedule);

ScheduleRouter.put("/:id", AuthMiddleware.authenticate, ScheduleController.updateSchedule);

ScheduleRouter.delete("/:id", AuthMiddleware.authenticate, ScheduleController.deleteSchedule);

ScheduleRouter.get("/:id", ScheduleController.getScheduleById);

export default ScheduleRouter;
