import express from 'express';
import UserController from '../controllers/userController.js';

const UserRouter = express.Router();

UserRouter.post('/users', UserController.createUser);        // Create
UserRouter.get('/users/:id', UserController.getUserById);    // Read (by ID)
UserRouter.put('/users/:id', UserController.updateUser);     // Update
UserRouter.delete('/users/:id', UserController.deleteUser);  // Delete
UserRouter.get('/users', UserController.getAllUsers);        // Read (all)

export default UserRouter;
