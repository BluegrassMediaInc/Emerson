import { body, validationResult } from "express-validator";
import { status } from "../utils/statusCode.js";
import { logError } from "../utils/logger.js";
import mongoose from "mongoose";

const { ObjectId } = mongoose.Types;

export const validateUserRegistration = [
  body("name").not().isEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Invalid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(status.BAD_REQUEST).json({ status: status.BAD_REQUEST, success: false, error: errors.array() });
    }
    next();
  },
];

export const validateUserLogin = [
  body("email").isEmail().withMessage("Invalid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(status.BAD_REQUEST).json({ status: status.BAD_REQUEST, success: false, errors: errors.array() });
    }
    next();
  },
];

export const validateObjectId = (id) => {
  return ObjectId.isValid(id);
};

export const validateAddContent = [
  body("title").not().isEmpty().withMessage("Please add title"),
  body("description").not().isEmpty().withMessage("Please add description"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(status.BAD_REQUEST).json({ status: status.BAD_REQUEST, success: false, errors: errors.array() });
    }
    next();
  },
];

export const validateAddRating = [
  body("rating").not().isEmpty().withMessage("Please add rating"),
  body("comment").not().isEmpty().withMessage("Please add comment"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(status.BAD_REQUEST).json({ status: status.BAD_REQUEST, success: false, errors: errors.array() });
    }
    next();
  },
];