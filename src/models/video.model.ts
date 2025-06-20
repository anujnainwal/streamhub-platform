// models/Video.ts
import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },

    fileId: { type: String, required: true },
    modifiedFileName: { type: String },
    originalFileName: { type: String },
    duration: { type: Number },

    tags: [{ type: String }],
    category: { type: String },
    model: { type: String }, // "user", "admin", or system source

    uploadSessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UploadSession",
    },
    // channelId: { type: mongoose.Schema.Types.ObjectId, ref: "Channel" },

    visibility: {
      type: String,
      enum: ["public", "private", "unlisted"],
      default: "public",
    },
    status: {
      type: String,
      enum: ["processing", "ready", "error"],
      default: "processing",
    },

    trailerUrl: {
      type: String,
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.models.Videos || mongoose.model("Videos", videoSchema);
