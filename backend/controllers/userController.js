const User = require("../models/UserModel");

// GET ALL USERS
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

// GET SINGLE USER
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

// UPDATE USER
exports.updateUser = async (req, res) => {
  try {
    const { name, email, role, avatar } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;
    if (avatar) user.avatar = avatar;

    await user.save();

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Email is already in use",
      });
    }

    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

// DELETE USER
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

// GET ADMIN ANALYTICS
exports.getAnalytics = async (req, res) => {
  try {
    const Enrollment = require("../models/EnrollmentModel");
    const Course = require("../models/CourseModel");

    const totalUsers = await User.countDocuments();

    const totalStudents = await User.countDocuments({
      role: "Student",
    });

    const totalInstructors = await User.countDocuments({
      role: "Instructor",
    });

    const totalAdmins = await User.countDocuments({
      role: "Admin",
    });

    const totalCourses = await Course.countDocuments();

    const totalEnrollments = await Enrollment.countDocuments();

    res.status(200).json({
      success: true,
      analytics: {
        totalUsers,
        totalStudents,
        totalInstructors,
        totalAdmins,
        totalCourses,
        totalEnrollments,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};