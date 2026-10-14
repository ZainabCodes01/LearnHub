
const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");


const {
  registerUser,
  loginUser,
} = require("../controllers/authController");

const router = express.Router();

// Existing email/password authentication
router.post("/register", registerUser);
router.post("/login", loginUser);

// Start Google login
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

// Google callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "http://localhost:5173/login?error=google",
  }),
  (req, res) => {
    const user = req.user;

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    };

    const params = new URLSearchParams({
      token,
      user: JSON.stringify(userData),
    });

    res.redirect(`http://localhost:5173/oauth-success?${params}`);
  }
);


router.get(
  "/github",
  passport.authenticate("github", {
    scope: ["user:email"],
    session: false,
  })
);

router.get(
  "/github/callback",
  passport.authenticate("github", {
    session: false,
    failureRedirect: "http://localhost:5173/login?error=github",
  }),
  (req, res) => {
    const user = req.user;

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    };

    const params = new URLSearchParams({
      token,
      user: JSON.stringify(userData),
    });

    res.redirect(`http://localhost:5173/oauth-success?${params}`);
  }
);

module.exports = router;
