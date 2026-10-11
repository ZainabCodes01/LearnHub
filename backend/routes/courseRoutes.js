const express = require("express");

const {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/courseController");

const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

// Public routes
router.get("/", getCourses);
router.get("/:id", getCourseById);

// Instructor and Admin routes
router.post(
  "/",
  protect,
  authorizeRoles("Instructor", "Admin"),
  createCourse
);

router.put(
  "/:id",
  protect,
  authorizeRoles("Instructor", "Admin"),
  updateCourse
);

router.delete(
  "/:id",
  protect,
  authorizeRoles("Instructor", "Admin"),
  deleteCourse
);

module.exports = router;