import mongoose from "mongoose";

const storySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    url: { type: String, required: true, unique: true },
    points: { type: Number, default: 0 },
    author: { type: String, default: "unknown" },
    postedAt: { type: String, default: "" }
  },
  { timestamps: true }
);

export const Story = mongoose.model("Story", storySchema);
