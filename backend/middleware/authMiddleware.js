import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import { status } from "../utils/statusCode.js";
import { logError } from "../utils/logger.js";

// Middleware to protect routes
export const protect = async (req, res, next) => {
  let token = req.headers.authorization;

  if (!token || !token.startsWith("Bearer ")) {
    return res.status(status.UNAUTHORIZED).json({ status: status.UNAUTHORIZED, success: false, message: "Not authorized, no token" });
  }

  try {
    token = token.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user and ensure it exists
    let user = await User.findById(decoded.id).select("-password").lean();
    if (!user) {
      return res.status(status.UNAUTHORIZED).json({ status: status.UNAUTHORIZED, success: false, message: "Not authorized, user not found" });
    }

    if (user.token !== token) {
      return res.status(status.UNAUTHORIZED).json({ status: status.UNAUTHORIZED, success: false, message: "Un Authorized" });
    }

    delete user.token;

    req.user = user;
    next();
  } catch (error) {
    logError("protect middleware", error);
    res.status(status.UNAUTHORIZED).json({ status: status.UNAUTHORIZED, success: false, message: error.message });
  }
};