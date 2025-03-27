import { validateObjectId } from "../middleware/validateRequest.js";
import Content from "../models/contentModel.js";
import Rating from "../models/RatingModel.js";
import { logError } from "../utils/logger.js";
import { status } from "../utils/statusCode.js";
import mongoose from "mongoose";

const { ObjectId } = mongoose.Types;

// @desc    Create new content
// @route   POST /api/content
// @access  Private
const createContent = async (req, res) => {
  try {
    const { title, description } = req.body;

    let mediaUrl = "";
    if (req.file) {
      mediaUrl = `/uploads/${req.file.fieldname}/${req.file.filename}`;
    } else {
      return res.status(status.BAD_REQUEST).json({ status: status.BAD_REQUEST, message: "Please select content image" });
    }

    const content = await Content.create({
      userId: req.user._id,
      title,
      description,
      mediaUrl
    });

    res.status(status.CREATED).json({ status: status.CREATED, data: content });
  } catch (error) {
    logError("createContent", error);
    res.status(status.INTERNAL_SERVER_ERROR).json({ status: status.INTERNAL_SERVER_ERROR, message: error.message });
  }
};

// @desc    Get content details by ID
// @route   GET /api/content/:id
// @access  Public
const getContentById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!validateObjectId(id)) {
      return res.status(status.BAD_REQUEST).json({
        status: status.BAD_REQUEST,

        message: "Invalid content ID",
      });
    }

    const data = await Content.aggregate([
      {
        $match: {
          _id: new ObjectId(id)
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userDetails"
        }
      },
      {
        $addFields: {
          userDetails: {
            $arrayElemAt: ['$userDetails', 0]
          }
        }
      },
      {
        $lookup: {
          from: "content_ratings",
          localField: "_id",
          foreignField: "contentId",
          as: "ratings",
          pipeline: [
            {
              $sort: {
                createdAt: -1
              }
            },
            {
              $limit: 5
            },
            {
              $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "userDetails"
              }
            },
            {
              $addFields: {
                userDetails: {
                  $arrayElemAt: ['$userDetails', 0]
                }
              }
            }
          ]
        }
      }
    ]);

    if (!data[0]) {
      res.status(status.NOT_FOUND).json({ status: status.NOT_FOUND, message: "Content not found" });
    }

    res.status(status.OK).json({ status: status.OK, data: data[0] });
  } catch (error) {
    logError("getContentById", error);
    res.status(status.INTERNAL_SERVER_ERROR).json({ status: status.INTERNAL_SERVER_ERROR, message: error.message });
  }
};

// @desc    Update content
// @route   PUT /api/content/:id
// @access  Private
const updateContent = async (req, res) => {
  try {
    const { id } = req.params;

    if (!validateObjectId(id)) {
      return res.status(status.BAD_REQUEST).json({
        status: status.BAD_REQUEST,

        message: "Invalid content ID",
      });
    }

    const content = await Content.findOne({ _id: id, userId: req.user._id });
    if (!content) return res.status(status.NOT_FOUND).json({ status: status.NOT_FOUND, message: "Content not found" });

    let mediaUrl = content.mediaUrl;
    if (req.file) {
      mediaUrl = `/uploads/${req.file.fieldname}/${req.file.filename}`;
    }

    const updateContent = await Content.findByIdAndUpdate(id, { ...req.body, mediaUrl }, { new: true, runValidators: true });

    res.status(status.OK).json({ status: status.OK, data: updateContent });
  } catch (error) {
    logError("updateContent", error);
    res.status(status.INTERNAL_SERVER_ERROR).json({ status: status.INTERNAL_SERVER_ERROR, message: error.message });
  }
};

// @desc    Delete content
// @route   DELETE /api/content/:id
// @access  Private
const deleteContent = async (req, res) => {
  try {
    const { id } = req.params;

    if (!validateObjectId(id)) {
      return res.status(status.BAD_REQUEST).json({
        status: status.BAD_REQUEST,

        message: "Invalid content ID",
      });
    }

    const content = await Content.findOne({ _id: id, userId: req.user._id });
    if (!content) return res.status(status.NOT_FOUND).json({ status: status.NOT_FOUND, message: "Content not found" });

    content.deleted = true;
    await content.save();

    res.status(status.NO_CONTENT).json({ status: status.NO_CONTENT, });
  } catch (error) {
    logError("updateContent", error);
    res.status(status.INTERNAL_SERVER_ERROR).json({ status: status.INTERNAL_SERVER_ERROR, message: error.message });
  }
};

// @desc    Add a rating & review to content
// @route   POST /api/content/:id/ratings
// @access  Private
const addRating = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const { id } = req.params;
    if (!validateObjectId(id)) {
      return res.status(status.BAD_REQUEST).json({
        status: status.BAD_REQUEST,

        message: "Invalid content ID",
      });
    }

    const content = await Content.findOne({ _id: id, userId: { $ne: req.user._id } });
    if (!content) {
      return res.status(status.NOT_FOUND).json({ status: status.NOT_FOUND, message: "Content not found" });
    }

    const findRating = await Rating.findOne({ contentId: id, userId: req.user._id });
    if (findRating) {
      return res.status(status.BAD_REQUEST).json({ status: status.BAD_REQUEST, message: "You have already rated this content. Each user can only rate once" });
    }

    let newRating = new Rating({ contentId: id, userId: req.user._id, rating, comment });
    newRating = await newRating.save();

    res.status(status.CREATED).json({ status: status.CREATED, data: newRating });
  } catch (error) {
    logError("addRating", error);
    res.status(status.INTERNAL_SERVER_ERROR).json({ status: status.INTERNAL_SERVER_ERROR, message: error.message });
  }
};

// @desc    Get all ratings for a specific content
// @route   GET /api/content/:id/ratings
// @access  Public
const listRatings = async (req, res) => {
  try {
    const { id } = req.params;
    if (!validateObjectId(id)) {
      return res.status(status.BAD_REQUEST).json({
        status: status.BAD_REQUEST,

        message: "Invalid content ID",
      });
    }

    const ratingsData = await Rating.aggregate([
      {
        $match: {
          contentId: new ObjectId(id),
          deleted: false,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userDetails"
        }
      },
      {
        $addFields: {
          userDetails: {
            $arrayElemAt: ['$userDetails', 0]
          }
        }
      },
      {
        $facet: {
          list: [{ $sort: { createdAt: -1 } }],
          stats: [
            {
              $group: {
                _id: null,
                averageRating: { $avg: "$rating" },
                totalRatings: { $sum: 1 },
              },
            },
          ],
        },
      },
    ]);

    if (!ratingsData || ratingsData.length === 0) {
      return res.status(status.NOT_FOUND).json({
        status: status.NOT_FOUND,

        message: "No ratings found for this content",
      });
    }

    const { list = [], stats = [] } = ratingsData[0];
    const averageRating = stats.length > 0 ? stats[0].averageRating : null;
    const totalRatings = stats.length > 0 ? stats[0].totalRatings : 0;

    return res.status(status.OK).json({
      status: status.OK,

      ratings: list,
      averageRating,
      totalRatings,
    });
  } catch (error) {
    logError("listRatings", error);
    return res.status(status.INTERNAL_SERVER_ERROR).json({
      status: status.INTERNAL_SERVER_ERROR,

      message: error.message,
    });
  }
};

// @desc    Get all ratings for a specific content
// @route   GET /api/contents/v1
// @access  Private
const listContent = async (req, res) => {
  try {
    let { skip, limit, search } = req.query;
    skip = skip ? Number(skip) : 0;
    limit = limit ? Number(limit) : 10;

    const list = await Content.aggregate([
      {
        $match: {
          deleted: false,
          title: {
            $regex: search, $options: 'i'
          }
        }
      },
      {
        $sort: {
          createdAt: -1
        }
      },
      {
        $skip: (skip) * limit
      },
      {
        $limit: limit
      },
      {
        $lookup: {
          from: 'users',
          localField: "userId",
          foreignField: "_id",
          as: "userDetails",
          pipeline: [
            {
              $project: {
                password: 0,
                token: 0
              }
            }
          ]
        }
      },
      {
        $lookup: {
          from: 'content_ratings',
          localField: "_id",
          foreignField: "contentId",
          as: "ratings",
          pipeline: [
            {
              $match: {
                deleted: false
              }
            }
          ]
        }
      },
      {
        $addFields: {
          userDetails: { $arrayElemAt: ["$userDetails", 0] },
          avgRating: { $avg: "$ratings.rating" }
        }
      },
      {
        $project: {
          ratings: 0
        }
      }
    ]);

    res.status(status.OK).json({ status: status.OK, data: list });
  } catch (error) {
    console.error("error", error);
    logError("listContent", error);
    return res.status(status.INTERNAL_SERVER_ERROR).json({
      status: status.INTERNAL_SERVER_ERROR,

      message: error.message,
    });
  }
};

export {
  createContent,
  getContentById,
  updateContent,
  deleteContent,
  addRating,
  listRatings,
  listContent
};
