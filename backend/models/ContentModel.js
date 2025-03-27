import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema.Types;

const ContentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    userId: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
    deleted: {
      type: Boolean,
      default: false
    },
    mediaUrl: {
      type: String,
      required: true,
    }
  },
  { timestamps: true }
);

const Content = mongoose.model("content", ContentSchema);

export default Content;