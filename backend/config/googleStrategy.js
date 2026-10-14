
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/UserModel");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;

        if (!email) {
          return done(new Error("Google account email not available"));
        }

        let user = await User.findOne({
          $or: [
            { googleId: profile.id },
            { email: email.toLowerCase() },
          ],
        });

        if (!user) {
          user = await User.create({
            name: profile.displayName || "Google User",
            email: email.toLowerCase(),
            googleId: profile.id,
            avatar: profile.photos?.[0]?.value,
            role: "Student",
          });
        } else if (!user.googleId) {
          user.googleId = profile.id;
          if (profile.photos?.[0]?.value) {
            user.avatar = profile.photos[0].value;
          }
          await user.save();
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);
