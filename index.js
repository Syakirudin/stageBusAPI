import express from "express";
import { errorRouter } from "./routers/error.router.js";
import { pool, testConnection } from "./db/connection.js";
import UserRouter from "./routers/user.router/userRouter.js";
import BusStopRouter from "./routers/bus.stop.router/busStopRouter.js";

const app = express();
const PORT = 5000;

//Middleware
//important for parsing the body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//user routes
app.use("/user", UserRouter);
app.use("/busStop", BusStopRouter);


//not found controller
app.use("*", errorRouter);




//GET health controller
app.get("/", function (req, res) {
  const resObj = {
    message: "Server bus stage api is running",
    data: true,
  };
  res.status(200).json(resObj);
});



//test database connection
testConnection();

// start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
