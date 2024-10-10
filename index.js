import express from 'express';
import cors from 'cors';
import StopModel from './models/stop.model.js';
import RouteModel from './models/route.model.js';
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

app.use(express.json({ limit: '10mb' }));

// Example endpoint
app.use('/api', routers);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ message: "Server is healthy" });
});

// Global error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ error: "Something went wrong!" });
// });

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
