import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema.Types;

const RatingSchema = new mongoose.Schema(
  {
    contentId: {
      type: ObjectId,
      ref: "content",
      required: true,
    },
    userId: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
    },
    deleted: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

const Rating = mongoose.model("content_rating", RatingSchema);

export default Rating;