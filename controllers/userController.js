import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import validator from "validator";
import UserModel from "../models/userModel.js";

const JWT_SECRET = "your_jwt_secret"; // Store this in an environment variable

class UserController {
  async createUser(req, res) {
    try {
      const { username, email, password, gender, residence } = req.body;

      // Validate email
      if (!validator.isEmail(email)) {
        return res.status(400).json({ message: "Invalid email format" });
      }

      // Check if email is already in use
      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "Email already in use" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const createdUser = await UserModel.create({
        username,
        email,
        password: hashedPassword,
        gender,
        residence,
        created_at: new Date(),
      });

      // Generate JWT token
      const token = jwt.sign(
        { id: createdUser.id, email: createdUser.email },
        JWT_SECRET,
        {
          expiresIn: "1h",
        }
      );

      // Send response
      res.status(201).json({
        message: "User created successfully",
        user: {
          id: createdUser.id,
          username: createdUser.username,
          email: createdUser.email,
          gender: createdUser.gender,
          residence: createdUser.residence,
          created_at: createdUser.created_at,
        },
        token,
      });
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  async loginUser(req, res) {
    try {
      const { email, password } = req.body;

      // Validate email
      if (!validator.isEmail(email)) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      // Find user by email
      const user = await UserModel.findByEmail(email);
      if (!user) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      // Generate JWT token
      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
        expiresIn: "1h",
      });

      // Send response
      res.status(200).json({
        message: "Login successful",
        token,
      });
    } catch (error) {
      console.error("Error logging in user:", error);
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  async getUserById(req, res) {
    try {
      const user = await UserModel.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: "Internal server error", error: error.message });
    }
  }

  async updateUser(req, res) {
    try {
      const updatedUser = await UserModel.update(req.params.id, req.body);
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json({
        message: "User updated successfully",
        user: updatedUser
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error", error: error.message });
    }
  }

  async deleteUser(req, res) {
    try {
      const deletedUser = await UserModel.delete(req.params.id);
      if (!deletedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json({
        message: "User deleted successfully",
        user: deletedUser
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error", error: error.message });
    }
  }

  async getAllUsers(req, res) {
    try {
      const users = await UserModel.findAll();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: "Internal server error", error: error.message });
    }
  }
}

export default new UserController();
