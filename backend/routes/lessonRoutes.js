const express = require("express");

const {
  createLesson,
  getCourseLessons,
  getLessonById,
  updateLesson,
  deleteLesson,
} = require("../controllers/lessonController");

const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

// Create lesson
router.post(
  "/",
  protect,
  authorizeRoles("Instructor", "Admin"),
  createLesson
);

// Get all lessons of a course
router.get(
  "/course/:courseId",
  protect,
  getCourseLessons
);

// Get single lesson
router.get(
  "/:id",
  getLessonById
);

// Update lesson
router.put(
  "/:id",
  protect,
  authorizeRoles("Instructor", "Admin"),
  updateLesson
);

// Delete lesson
router.delete(
  "/:id",
  protect,
  authorizeRoles("Instructor", "Admin"),
  deleteLesson
);

module.exports = router;