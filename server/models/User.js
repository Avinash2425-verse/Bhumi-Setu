import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    profile: {
      type: String,
      enum: ["regional_officer", "project_agency", "ministry_apex"],
      required: true,
      default: "regional_officer"
    },
    isMinistryLocked: {
      type: Boolean,
      default: false
    },
    lastLogin: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
