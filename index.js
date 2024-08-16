import express from "express";
import cors from "cors";
import { errorRouter } from "./routers/error.router.js";
import { testConnection } from "./db/connection.js";
import UserRouter from "./routers/userRouter.js";
import BusRouter from "./routers/busRouter.js";
import BusStopRouter from "./routers/busStopRouter.js";
import RoutesRouter from "./routers/routesRouter.js";
import TripsRouter from "./routers/tripsRouter.js";
import DropOffStopRouter from "./routers/dropOffStopRouter.js";

const app = express();
const PORT = process.env.PORT || 5000;



// CORS configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000", // Allow only the React frontend
  })
);

// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route handlers
app.use("/api/users", UserRouter);
app.use("/api/busStops", BusStopRouter);
app.use("/api/buses", BusRouter);
app.use("/api/routes", RoutesRouter);
app.use("/api/trips", TripsRouter);
app.use("/api/dropOffStops", DropOffStopRouter);

// Health check endpoint
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Server bus stage API is running",
    data: true,
  });
});

// Catch-all route for non-existent endpoints
app.use("*", errorRouter);

// Test database connection
testConnection().catch((err) => {
  console.error("Database connection failed:", err);
  process.exit(1);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
