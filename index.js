import express from 'express';
import cors from 'cors';
import pool from './db/db.connection.js';
import StopModel from './models/stop.model.js';
import RouteModel from './models/route.model.js';
import ScheduleModel from './models/schedule.model.js';
import FareModel from './models/fare.model.js';
import UserModel from './models/user.model.js';
import routers from './routers/index.routers.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();

// Middleware for CORS
app.use(cors({
  origin: 'http://localhost:3000', // Adjust based on your frontend URL
}));

// Middleware for parsing JSON

app.use(express.json());

// Example endpoint
app.use('/api', routers);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ message: "Server is healthy" });
});

// Centralized error handler
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error
  const status = err.status || 500; // Set default status
  const message = err.message || 'Internal Server Error'; // Set default message
  res.status(status).json({ error: message });
});



// Start server
const PORT = process.env.SERVER_PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log("Shutting down gracefully...");
  // Perform any necessary cleanup here
  process.exit(0);
});
