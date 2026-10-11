const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
      trim: true,
      maxlength: [50, "Name cannot be more than 50 characters"],
    },

    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please add a valid email",
      ],
    },

    password: {
      type: String,
      required: [true, "Please add a password"],
      minlength: [6, "Password must be at least 6 characters"],
    },

    role: {
      type: String,
      enum: ["Student", "Instructor", "Admin"],
      default: "Student",
    },

    avatar: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    },

    enrolledCourses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],

    resetPasswordToken: String,

    resetPasswordExpire: Date,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);