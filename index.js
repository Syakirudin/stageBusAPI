import express from "express";
import { router } from "./routers/index.router.js";
import { mathRouter } from "./routers/math.router.js";
import { errorRouter } from "./routers/error.router.js";
import { pool, testConnection } from "./db/connection.js";
import { createUser } from "./controllers/user.controller/user.controller.js";

const app = express();
const PORT = 5000;

//Middleware
//important for parsing the body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", router);
app.use("/", mathRouter);

//user routes
app.post("/users", createUser);

//GET health controller
app.get("/", function (req, res) {
  const resObj = {
    message: "Server bus stage api is running",
    data: true,
  };
  res.status(200).json(resObj);
});

//not found controller
app.use("*", errorRouter);

//test database connection
testConnection();

// start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
