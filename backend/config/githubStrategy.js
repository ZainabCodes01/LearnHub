
const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;
const User = require("../models/UserModel");

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/api/auth/github/callback",
      scope: ["user:email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.find(
          (item) => item.primary
        )?.value || profile.emails?.[0]?.value;

        if (!email) {
          return done(
            new Error("GitHub account email is not available"),
            null
          );
        }

        const normalizedEmail = email.toLowerCase();

        let user = await User.findOne({
          $or: [
            { githubId: profile.id },
            { email: normalizedEmail },
          ],
        });

        if (!user) {
          user = await User.create({
            name: profile.displayName || profile.username || "GitHub User",
            email: normalizedEmail,
            githubId: profile.id,
            avatar: profile.photos?.[0]?.value,
            role: "Student",
          });
        } else if (!user.githubId) {
          user.githubId = profile.id;

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

module.exports = passport;
