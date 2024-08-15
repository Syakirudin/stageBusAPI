// backend/routers/userRouter.js

import express from "express";
import UserController from ".././controllers/userController.js";

const UserRouter = express.Router();

// Routes for user CRUD operations
UserRouter.post("/users", UserController.createUser);
UserRouter.get("/users/:id", UserController.getUser);
UserRouter.get("/users", UserController.getAllUsers);
UserRouter.put("/users/:id", UserController.updateUser);
UserRouter.delete("/users/:id", UserController.deleteUser);

export default UserRouter;
