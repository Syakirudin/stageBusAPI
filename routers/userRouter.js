import express from "express";
import UserController from "../controllers/userController.js";

const UserRouter = express.Router();

// Routes for user CRUD operations
// POST /users - Create a new user
UserRouter.post("/users", UserController.createUser);

// GET /users/:id - Get a user by ID
UserRouter.get("/users/:id", UserController.getUser);

// GET /users - Get all users
UserRouter.get("/users", UserController.getAllUsers);

// PUT /users/:id - Update a user by ID
UserRouter.put("/users/:id", UserController.updateUser);

// DELETE /users/:id - Delete a user by ID
UserRouter.delete("/users/:id", UserController.deleteUser);

export default UserRouter;
