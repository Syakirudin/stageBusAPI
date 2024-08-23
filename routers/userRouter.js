import express from 'express';
import UserController from '../controllers/UserController.js';

const router = express.Router();

router.post('/users', UserController.createUser);        // Create
router.get('/users/:id', UserController.getUserById);    // Read (by ID)
router.put('/users/:id', UserController.updateUser);     // Update
router.delete('/users/:id', UserController.deleteUser);  // Delete
router.get('/users', UserController.getAllUsers);        // Read (all)

export default router;
