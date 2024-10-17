import bcrypt from "bcryptjs";
import UserModel from "../models/user.model.js";

class UserService {
  static async register(username, email, password) {
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if the username or email already exists
    const existingUser = await UserModel.getUserByUsernameOrEmail(username, email);
    if (existingUser.rowCount > 0) {
      throw new Error("Username or Email already exists.");
    }

    return await UserModel.createUser(username, email, hashedPassword);
  }

  static async login(identifier, password) {
    const user = await UserModel.getUserByUsernameOrEmail(identifier, identifier);
    if (user.rowCount === 0) {
      throw new Error("Invalid username or password.");
    }

    const isPasswordMatch = await bcrypt.compare(password, user.rows[0].password);
    if (!isPasswordMatch) {
      throw new Error("Invalid username or password.");
    }

    return user.rows[0];
  }

  static async resetPassword(email, newPassword) {
    const user = await UserModel.getUserByEmail(email);
    if (user.rowCount === 0) {
      throw new Error("No account found with this email.");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await UserModel.updatePassword(user.rows[0].id, hashedPassword);
  }

  static async promoteUserToAdmin(userId) {
    const result = await UserModel.getUserById(userId);
    if (result.rowCount === 0) {
      throw new Error("User not found.");
    }

    const user = result.rows[0];
    if (user.role === "admin" || user.role === "super-admin") {
      throw new Error("User is already an admin or super-admin.");
    }

    return await UserModel.updateUserRole(userId, "admin");
  }

  static async promoteUserToSuperAdmin(userId) {
    const result = await UserModel.getUserById(userId);
    if (result.rowCount === 0) {
      throw new Error("User not found.");
    }

    const user = result.rows[0];
    if (user.role === "super-admin") {
      throw new Error("User is already a super-admin.");
    }

    return await UserModel.updateUserRole(userId, "super-admin");
  }
}

export default UserService;
