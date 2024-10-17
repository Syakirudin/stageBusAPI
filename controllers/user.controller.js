import UserService from "../services/user.service.js";
import jwt from "jsonwebtoken";

class UserController {
  static async register(req, res) {
    const { username, email, password } = req.body;
    try {
      const user = await UserService.register(username, email, password);
      res.status(201).json({ message: "User registered successfully.", user });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async login(req, res) {
    const { identifier, password } = req.body; // Identifier can be username or email
    try {
      const user = await UserService.login(identifier, password);
      const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
      res.status(200).json({ message: "Login successful.", token });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async resetPassword(req, res) {
    const { email, newPassword } = req.body;
    try {
      await UserService.resetPassword(email, newPassword);
      res.status(200).json({ message: "Password reset successfully." });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async promoteToAdmin(req, res) {
    const { userId } = req.params;
    try {
      const updatedUser = await UserService.promoteUserToAdmin(userId);
      res.status(200).json({ message: "User promoted to admin successfully.", user: updatedUser });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async promoteToSuperAdmin(req, res) {
    const { userId } = req.params;
    try {
      const updatedUser = await UserService.promoteUserToSuperAdmin(userId);
      res.status(200).json({ message: "User promoted to super-admin successfully.", user: updatedUser });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  
}

export default UserController;
