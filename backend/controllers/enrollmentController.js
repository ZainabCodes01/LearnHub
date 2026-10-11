const Enrollment = require("../models/EnrollmentModel");
const Course = require("../models/CourseModel");

// ENROLL IN COURSE

// ENROLL IN COURSE
exports.enrollCourse = async (req, res) => {
  try {
    const { course } = req.body;

    // Logged-in student ki ID JWT se aa rahi hai
    const student = req.user._id;

    if (!course) {
      return res.status(400).json({
        message: "Course is required",
      });
    }

    const existingCourse = await Course.findById(course);

    if (!existingCourse) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    const alreadyEnrolled = await Enrollment.findOne({
      student,
      course,
    });

    if (alreadyEnrolled) {
      return res.status(400).json({
        message: "Student is already enrolled in this course",
      });
    }

    // Create enrollment
    const enrollment = await Enrollment.create({
      student,
      course,
      progress: 0,
    });

    // Increase enrolled students count
    await Course.findByIdAndUpdate(course, {
      $inc: {
        enrolledStudentsCount: 1,
      },
    });

    const populatedEnrollment = await Enrollment.findById(
      enrollment._id
    )
      .populate("student", "name email")
      .populate("course", "title description price");

    res.status(201).json({
      success: true,
      message: "Course enrolled successfully",
      enrollment: populatedEnrollment,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

// GET MY COURSES
exports.getMyCourses = async (req, res) => {
  try {
    // Logged-in student ki ID JWT se
    const student = req.user._id;

    const enrollments = await Enrollment.find({
      student,
    })
      .populate(
        "course",
        "title description category price instructor"
      )
      .populate("student", "name email");

    res.status(200).json({
      success: true,
      count: enrollments.length,
      courses: enrollments,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

// UPDATE COURSE PROGRESS
exports.updateProgress = async (req, res) => {
  try {
    const { progress } = req.body;

    if (progress === undefined) {
      return res.status(400).json({
        message: "Progress is required",
      });
    }

    if (progress < 0 || progress > 100) {
      return res.status(400).json({
        message: "Progress must be between 0 and 100",
      });
    }

    const enrollment = await Enrollment.findById(req.params.id);

    if (!enrollment) {
      return res.status(404).json({
        message: "Enrollment not found",
      });
    }

    // Make sure student can update only their own enrollment
    if (enrollment.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You can only update your own course progress",
      });
    }

    enrollment.progress = progress;

    if (progress === 100) {
      enrollment.status = "Completed";
      enrollment.completedAt = new Date();
    }

    await enrollment.save();

    res.status(200).json({
      success: true,
      message: "Course progress updated successfully",
      enrollment,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

// GET INSTRUCTOR STUDENTS
exports.getInstructorStudents = async (req, res) => {
  try {
    const instructor = req.user._id;

    // Find courses created by logged-in instructor
    const instructorCourses = await Course.find({
      instructor,
    }).select("_id title");

    const courseIds = instructorCourses.map(
      (course) => course._id
    );

    // Find enrollments for instructor's courses
    const enrollments = await Enrollment.find({
      course: { $in: courseIds },
    })
      .populate("student", "name email")
      .populate("course", "title");

    res.status(200).json({
      success: true,
      count: enrollments.length,
      students: enrollments,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};