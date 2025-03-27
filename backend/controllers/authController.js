import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import { status } from "../utils/statusCode.js";
import { logError } from "../utils/logger.js";
import { generateToken } from "../utils/generateToken.js";

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(status.BAD_REQUEST).json({ status: status.BAD_REQUEST, message: "User already exists" });

    // Create user
    const user = new User(req.body);

    // Generate token
    const token = generateToken(user._id);

    user.token = token;
    await user.save();

    const sanitizedUser = user.toObject();
    delete sanitizedUser.password;
    delete sanitizedUser.token;

    res.status(status.CREATED).json({ status: status.CREATED, data: sanitizedUser, token });
  } catch (error) {
    console.error("error", error);
    logError("registerUser", error);
    res.status(status.INTERNAL_SERVER_ERROR).json({ status: status.INTERNAL_SERVER_ERROR, message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    let user = await User.findOne({ email });
    if (!user) return res.status(status.BAD_REQUEST).json({ status: status.BAD_REQUEST, message: "Invalid credentials" });

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(status.BAD_REQUEST).json({ status: status.BAD_REQUEST, message: "Invalid credentials" });

    // Generate token
    const token = generateToken(user._id);

    user.token = token;
    await user.save();

    user = user.toObject();
    delete user.password;
    delete user.token;

    res.status(status.OK).json({ status: status.OK, data: user, token });
  } catch (error) {
    logError("loginUser", error);
    res.status(status.INTERNAL_SERVER_ERROR).json({ status: status.INTERNAL_SERVER_ERROR, message: error.message });
  }
};

// @desc    Get My Profile
// @route   GET /api/user/profile
// @access  Private
const getMyProfile = (req, res) => {
  try {
    res.status(status.OK).json({ status: status.OK, data: req.user });
  } catch (error) {
    logError("getMyProfile", error);
    res.status(status.INTERNAL_SERVER_ERROR).json({ status: status.INTERNAL_SERVER_ERROR, message: error.message });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
const logoutUser = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { token: "" }, { new: true, runValidators: true });

    res.status(200).json({ status: 200, message: "Logout successfully" });
  } catch (error) {
    logError("logoutUser", error);
    res.status(status.INTERNAL_SERVER_ERROR).json({ status: status.INTERNAL_SERVER_ERROR, message: error.message });
  }
};

// @desc    Update user profile
// @route   PATCH /api/user/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {

    let avatar = req.user.avatar || "";
    if (req.file) {
      avatar = `/uploads/${req.file.fieldname}/${req.file.filename}`;
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name: req.body.name, avatar },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(status.NOT_FOUND).json({
        status: status.NOT_FOUND,

        message: 'User not found'
      });
    }

    res.status(status.OK).json({
      status: status.OK,

      data: user
    });
  } catch (error) {
    logError("updateProfile", error);
    res.status(status.INTERNAL_SERVER_ERROR).json({
      status: status.INTERNAL_SERVER_ERROR,

      message: error.message
    });
  }
};

export { registerUser, loginUser, getMyProfile, logoutUser, updateProfile };
