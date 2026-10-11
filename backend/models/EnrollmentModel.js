const mongoose = require("mongoose");

const enrollmentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Enrollment must belong to a student"],
    },

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "Enrollment must reference a course"],
    },

    progress: {
      type: Number,
      required: true,
      min: [0, "Progress cannot be less than 0%"],
      max: [100, "Progress cannot exceed 100%"],
      default: 0,
    },

    status: {
      type: String,
      enum: ["In Progress", "Completed", "Dropped"],
      default: "In Progress",
    },

    completedAt: {
      type: Date,
    },

    certificateIssued: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate enrollment
enrollmentSchema.index(
  { student: 1, course: 1 },
  { unique: true }
);

module.exports = mongoose.model("Enrollment", enrollmentSchema);