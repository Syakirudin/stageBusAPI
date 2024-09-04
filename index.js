import express from "express";
import cors from "cors";
import { errorRouter } from "./routers/error.router.js";
import { testConnection } from "./db/connection.js";
import UserRouter from "./routers/userRouter.js";
import StopsRoutes from "./routers/stopsRoutes.js";

// Import dotenv using ES module syntax
if (process.env.NODE_ENV !== "production") {
  import("dotenv").then((dotenv) => dotenv.config());
}

const app = express();

// CORS configuration based on environment
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? process.env.ORIGIN
        : "http://localhost:3000",
  })
);

// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route handlers
app.use("/", UserRouter);
app.use("/", StopsRoutes);

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
const PORT = process.env.SERVER_PORT || 5000;
app.listen(PORT, () => {
  console.log(
    `Server running on ${
      process.env.NODE_ENV === "production"
        ? process.env.ORIGIN
        : "http://localhost:" + PORT
    }`
  );
});
