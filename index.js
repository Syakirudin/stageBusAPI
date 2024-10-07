import express from "express";
import cors from "cors";


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
