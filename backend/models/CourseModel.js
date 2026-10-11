const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please add a course title"],
      trim: true,
      maxlength: [100, "Course title cannot be more than 100 characters"],
    },

    description: {
      type: String,
      required: [true, "Please add a course description"],
      maxlength: [2000, "Description cannot be more than 2000 characters"],
    },

    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Course must have an instructor"],
    },

    category: {
      type: String,
      required: [true, "Please select a course category"],
      enum: [
        "Web Development",
        "Data Science",
        "Mobile Development",
        "UI/UX Design",
        "Cloud Computing",
        "Cybersecurity",
      ],
    },

    price: {
      type: Number,
      required: [true, "Please add a course price"],
      min: [0, "Price cannot be negative"],
      default: 0,
    },

    thumbnail: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800",
    },

    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced", "All Levels"],
      default: "All Levels",
    },

    enrolledStudentsCount: {
      type: Number,
      default: 0,
    },

    averageRating: {
      type: Number,
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot be more than 5"],
      default: 4.5,
    },
  },
  {
    timestamps: true,
  }
);

// Text index for searching courses
courseSchema.index({
  title: "text",
  description: "text",
});

module.exports = mongoose.model("Course", courseSchema);