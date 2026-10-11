const Course = require("../models/CourseModel");
const Enrollment = require("../models/EnrollmentModel");

// GET ALL COURSES
exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate(
      "instructor",
      "name email"
    );

    // Get actual enrollment count for every course
    const coursesWithEnrollmentCount = await Promise.all(
      courses.map(async (course) => {
        const enrolledStudentsCount =
          await Enrollment.countDocuments({
            course: course._id,
          });

        return {
          ...course.toObject(),
          enrolledStudentsCount,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: coursesWithEnrollmentCount.length,
      courses: coursesWithEnrollmentCount,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

// GET SINGLE COURSE
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate(
      "instructor",
      "name email"
    );

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    res.status(200).json({
      success: true,
      course,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

// CREATE COURSE
exports.createCourse = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      price,
      thumbnail,
      level,
    } = req.body;

    if (
      !title ||
      !description ||
      !category ||
      price === undefined
    ) {
      return res.status(400).json({
        message: "Please add all required course fields",
      });
    }

    // Instructor automatically comes from logged-in user
    const instructor = req.user._id;

    const course = await Course.create({
      title,
      description,
      category,
      price,
      instructor,
      thumbnail,
      level,
    });

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      course,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

// UPDATE COURSE
exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    // Instructor can update only their own course
    // Admin can update any course
    if (
      req.user.role !== "Admin" &&
      course.instructor.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "You can only update your own courses",
      });
    }

    const {
      title,
      description,
      category,
      price,
      thumbnail,
      level,
    } = req.body;

    course.title = title ?? course.title;
    course.description = description ?? course.description;
    course.category = category ?? course.category;
    course.price = price ?? course.price;
    course.thumbnail = thumbnail ?? course.thumbnail;
    course.level = level ?? course.level;

    await course.save();

    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      course,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

// DELETE COURSE
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    // Instructor can delete only their own course
    // Admin can delete any course
    if (
      req.user.role !== "Admin" &&
      course.instructor.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "You can only delete your own courses",
      });
    }

    await Course.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};