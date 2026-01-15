// backend/models/Event.js

const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    date: {
      type: String,
      required: [true, "Date is required"],
      match: [/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"],
    },
    startTime: {
      type: String,
      required: [true, "Start time is required"],
      match: [/^\d{2}:\d{2}$/, "Start time must be in HH:mm format"],
    },
    startMinutes: {
      type: Number,
      required: true,
      min: [0, "Start minutes must be >= 0"],
      max: [1439, "Start minutes must be < 1440"],
    },
    endTime: {
      type: String,
      required: [true, "End time is required"],
      match: [/^\d{2}:\d{2}$/, "End time must be in HH:mm format"],
    },
    endMinutes: {
      type: Number,
      required: true,
      min: [0, "End minutes must be >= 0"],
      max: [1440, "End minutes must be < 1440"],
    },
    createdBy: {
      type: String,
      default: "admin",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = mongoose.model("Event", eventSchema);
