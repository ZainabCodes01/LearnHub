const express = require("express");

const {
  enrollCourse,
  getMyCourses,
  updateProgress,
  getInstructorStudents,
} = require("../controllers/enrollmentController");

const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

// Student enrollment
router.post(
  "/enroll",
  protect,
  authorizeRoles("Student"),
  enrollCourse
);

// Student's enrolled courses
router.get(
  "/my-courses",
  protect,
  authorizeRoles("Student"),
  getMyCourses
);

router.get(
  "/instructor-students",
  protect,
  authorizeRoles("Instructor"),
  getInstructorStudents
);

// Update course progress
router.put(
  "/:id/progress",
  protect,
  authorizeRoles("Student"),
  updateProgress
);

module.exports = router;