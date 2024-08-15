import express from "express";
import { errorRouter } from "./routers/error.router.js";
import { pool, testConnection } from "./db/connection.js";
import UserRouter from "./routers/user.router/userRouter.js";
import BusStopRouter from "./routers/bus.stop.router/busStopRouter.js";
import cors from "cors";



const app = express();
const PORT = 5000;


//cors dependency
app.use(cors({
  origin: 'http://localhost:3000', // Allow only the React frontend
}));

// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route handlers
app.use("/api", UserRouter);
app.use("/api", BusStopRouter);






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
