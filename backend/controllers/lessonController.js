const Lesson = require("../models/LessonModel");
const Course = require("../models/CourseModel");
const Enrollment = require("../models/EnrollmentModel");

// CREATE LESSON
exports.createLesson = async (req, res) => {
  try {
    const {
      course,
      title,
      description,
      videoUrl,
      duration,
      order,
    } = req.body;

    if (!course || !title) {
      return res.status(400).json({
        message: "Course and lesson title are required",
      });
    }

    // Check course exists
    const existingCourse = await Course.findById(course);

    if (!existingCourse) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    // Only course instructor or Admin can create lesson
    if (
      existingCourse.instructor.toString() !==
      req.user._id.toString() &&
      req.user.role !== "Admin"
    ) {
      return res.status(403).json({
        message:
          "You can only add lessons to your own courses",
      });
    }

    const lesson = await Lesson.create({
      course,
      title,
      description,
      videoUrl,
      duration: duration || 0,
      order: order || 1,
    });

    res.status(201).json({
      success: true,
      message: "Lesson created successfully",
      lesson,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

// GET LESSONS BY COURSE
exports.getCourseLessons = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    // Instructor aur Admin apne course ke lessons access kar sakte hain
    if (
      req.user.role !== "Admin" &&
      req.user.role !== "Instructor"
    ) {
      // Student ke liye enrollment check
      const enrollment = await Enrollment.findOne({
        student: req.user._id,
        course: courseId,
      });

      if (!enrollment) {
        return res.status(403).json({
          message:
            "You must be enrolled in this course to access lessons",
        });
      }
    }

    const lessons = await Lesson.find({
      course: courseId,
    }).sort({ order: 1 });

    res.status(200).json({
      success: true,
      count: lessons.length,
      lessons,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

// GET SINGLE LESSON
exports.getLessonById = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);

    if (!lesson) {
      return res.status(404).json({
        message: "Lesson not found",
      });
    }

    res.status(200).json({
      success: true,
      lesson,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

// UPDATE LESSON
exports.updateLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);

    if (!lesson) {
      return res.status(404).json({
        message: "Lesson not found",
      });
    }

    const course = await Course.findById(lesson.course);

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    // Only course instructor or Admin can update
    if (
      course.instructor.toString() !==
      req.user._id.toString() &&
      req.user.role !== "Admin"
    ) {
      return res.status(403).json({
        message:
          "You can only update lessons from your own courses",
      });
    }

    const updatedLesson = await Lesson.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Lesson updated successfully",
      lesson: updatedLesson,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

// DELETE LESSON
exports.deleteLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);

    if (!lesson) {
      return res.status(404).json({
        message: "Lesson not found",
      });
    }

    const course = await Course.findById(lesson.course);

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    // Only course instructor or Admin can delete
    if (
      course.instructor.toString() !==
      req.user._id.toString() &&
      req.user.role !== "Admin"
    ) {
      return res.status(403).json({
        message:
          "You can only delete lessons from your own courses",
      });
    }

    await Lesson.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Lesson deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};