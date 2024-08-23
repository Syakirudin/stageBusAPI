import express from "express";
import cors from "cors";
import { errorRouter } from "./routers/error.router.js";
import { testConnection } from "./db/connection.js";
import UserRouter from "./routers/userRouter.js";


const app = express();
// const PORT = process.env.PORT || 5000;





// CORS configuration
app.use(
  cors({
    origin: process.env.ORIGIN || "http://localhost:3000", // Allow only the React frontend
  })
);

// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route handlers
app.use("/", UserRouter);


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


app.listen(process.env.PORT , () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
