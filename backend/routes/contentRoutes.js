import express from "express";
import {
  createContent,
  getContentById,
  updateContent,
  deleteContent,
  addRating,
  listRatings,
  listContent
} from "../controllers/contentController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import { validateAddContent, validateAddRating } from "../middleware/validateRequest.js";

const contentRouter = express.Router();

contentRouter.post("/create/content/v1", protect, upload.single('content'), createContent);
contentRouter.get("/content/:id/v1", protect, getContentById);
contentRouter.put("/content/:id/v1", protect, upload.single('content'), updateContent);
contentRouter.delete("/content/:id/v1", protect, deleteContent);
contentRouter.get("/contents/v1", protect, listContent);

// rating
contentRouter.post("/create/rating/:id/v1", protect, validateAddRating, addRating);
contentRouter.get("/list/rating/:id/v1", protect, listRatings);

export default contentRouter;
