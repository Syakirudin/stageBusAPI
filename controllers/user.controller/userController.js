// backend/controllers/userController.js

import UserModel from "../../models/user.model/userModel.js";

class UserController {
  async createUser(req, res) {
    const { full_name, email, password_hash, phone_number, role } = req.body;

    try {
      const newUser = await UserModel.create(
        full_name,
        email,
        password_hash,
        phone_number,
        role
      );
      res.status(201).json({
        message: "User created successfully",
        user: newUser,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Internal server error",
      });
    }
  }

  async getUser(req, res) {
    const userId = req.params.id;
    try {
      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(user);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async getAllUsers(req, res) {
    try {
      const users = await UserModel.findAll();
      res.status(200).json(users);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async updateUser(req, res) {
    const userId = req.params.id;
    const updatedFields = req.body;

    try {
      const updatedUser = await UserModel.update(userId, updatedFields);
      res.status(200).json({
        message: "User updated successfully",
        user: updatedUser,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Internal server error",
      });
    }
  }

  async deleteUser(req, res) {
    const userId = req.params.id;

    try {
      const deletedUser = await UserModel.delete(userId);
      res.status(200).json({
        message: "User deleted successfully",
        user: deletedUser,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Internal server error",
      });
    }
  }
}

export default new UserController();
