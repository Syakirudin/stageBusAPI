import express from "express";
import StopRouter from "./stop.router.js"; 
import RouteRouter from "./route.router.js";
import ScheduleRouter from "./schedule.router.js";

const routers = express.Router();

// Use the StopRouter for routes starting with /stops
routers.use("/stops", StopRouter);

// Use the RouteRouter for routes starting with /routes
routers.use("/routes", RouteRouter);

// Use the ScheduleRouter for routes starting with /schedules
routers.use("/schedules", ScheduleRouter);

export default routers;
