import express from "express";
import UserController from "../controllers/user.controller.js";
import AuthMiddleware from "../middlewares/auth.middleware.js";

const UserRouter = express.Router();

UserRouter.post("/register", UserController.register);
UserRouter.post("/login", UserController.login);
UserRouter.post("/reset-password", UserController.resetPassword);

// Promote to admin - Only accessible by super-admins
UserRouter.patch(
  "/promote/:userId",
  AuthMiddleware.authenticate,
  AuthMiddleware.verifyRole(["super-admin"]),
  UserController.promoteToAdmin
);

UserRouter.patch(
    "/promote/:userId/super-admin",
    AuthMiddleware.authenticate,
    AuthMiddleware.verifyRole(["super-admin"]),
    UserController.promoteToSuperAdmin
  );

export default UserRouter;
