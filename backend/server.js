
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

// Load Passport and Google strategy after environment variables
const passport = require("passport");
require("./config/googleStrategy");

require("./config/githubStrategy");

const connectDB = require("./config/db");

// Routes
const authRoutes = require("./routes/authRoutes");
const courseRoutes = require("./routes/courseRoutes");
const enrollmentRoutes = require("./routes/enrollmentRoutes");
const userRoutes = require("./routes/userRoutes");
const lessonRoutes = require("./routes/lessonRoutes");

const app = express();

// Connect MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/users", userRoutes);
app.use("/api/lessons", lessonRoutes);

// Home Route
app.get("/", (req, res) => {
  res.json({
    message: "LearnHub API is running",
  });
});

// Server
const PORT = process.env.PORT || 5000;

if (process.env.NETLIFY) {
  module.exports.handler = require("serverless-http")(app);
} else {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}