import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getMyProfile,
  updateProfile,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validateUserLogin, validateUserRegistration } from "../middleware/validateRequest.js";
import upload from "../middleware/uploadMiddleware.js";

const authRouter = express.Router();

authRouter.post("/auth/register/v1", validateUserRegistration, registerUser);
authRouter.post("/auth/login/v1", validateUserLogin, loginUser);
authRouter.get("/user/profile/v1", protect, getMyProfile);
authRouter.post("/user/logout/v1", protect, logoutUser);
authRouter.put("/user/profile/v1", protect, upload.single('avatar'), updateProfile);

export default authRouter;
