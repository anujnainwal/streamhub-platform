// models/UploadSession.ts
import mongoose from "mongoose";

const partSchema = new mongoose.Schema({
  partNumber: { type: Number, required: true },
  sha1: { type: String, required: true },
});

const uploadSessionSchema = new mongoose.Schema(
  {
    uploadId: { type: String, required: true, unique: true },
    fileId: { type: String, required: true },
    fileName: { type: String, required: true },
    modifiedFileName: { type: String },
    bucketId: { type: String, required: true },
    mimeType: { type: String },

    model: { type: String }, // e.g., 'video', 'thumbnail'
    title: { type: String },
    tags: [{ type: String }],

    uploadedParts: [partSchema],
    totalParts: { type: Number },
    size: { type: Number },

    status: {
      type: String,
      enum: ["in-progress", "completed", "canceled", "error"],
      default: "in-progress",
    },

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.models.UploadSession ||
  mongoose.model("UploadSession", uploadSessionSchema);
