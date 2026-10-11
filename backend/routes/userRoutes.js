const express = require("express");

const {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getAnalytics,
} = require("../controllers/userController");

const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

router.get(
  "/analytics",
  protect,
  authorizeRoles("Admin"),
  getAnalytics
);

// Admin only
router.get(
  "/",
  protect,
  authorizeRoles("Admin"),
  getUsers
);

router.get(
  "/:id",
  protect,
  authorizeRoles("Admin"),
  getUserById
);

router.put(
  "/:id",
  protect,
  authorizeRoles("Admin"),
  updateUser
);

router.delete(
  "/:id",
  protect,
  authorizeRoles("Admin"),
  deleteUser
);

module.exports = router;