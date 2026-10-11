
import React, { useState } from "react";
import {
  Lock,
  Mail,
  User,
  ArrowRight,
  ShieldCheck,
  GraduationCap,
  CheckCircle2,
  Eye,
  EyeOff,
  Briefcase,
} from "lucide-react";
import { registerUser } from "../services/authService";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("student");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [notification, setNotification] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const showToast = (message) => {
    setNotification(message);

    setTimeout(() => {
      setNotification(null);
    }, 3500);
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!fullName || !email || !password || !confirmPassword) {
      showToast("Please fill in all required fields.");
      return;
    }

    if (password !== confirmPassword) {
      showToast("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      showToast("Password must be at least 6 characters.");
      return;
    }

    if (!agreeTerms) {
      showToast("Please agree to the Terms of Service.");
      return;
    }

    try {
      setIsLoading(true);

      const backendRole =
        role === "instructor" ? "Instructor" : "Student";

      console.log("Selected role:", role);
      console.log("Backend role:", backendRole);

      const data = await registerUser(
        fullName,
        email,
        password,
        backendRole
      );

      console.log("Registration response:", data);

      showToast("Account created successfully!");

      setFullName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setAgreeTerms(false);
      setRole("student");
    } catch (error) {
      console.error("Registration error:", error);

      const message =
        error.response?.data?.message ||
        "Registration failed. Please try again.";

      showToast(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-page min-vh-100 d-flex bg-light text-dark position-relative overflow-hidden">

      {/* Toast Notification */}
      {notification && (
        <div
          className="position-fixed top-0 end-0 m-4 bg-dark text-white px-4 py-3 rounded-3 shadow-lg d-flex align-items-center gap-3"
          style={{ zIndex: 1055 }}
        >
          <ShieldCheck size={20} className="text-info" />
          <span className="small fw-medium">{notification}</span>
        </div>
      )}

      {/* LEFT PANEL */}
      <div className="d-none d-lg-flex col-lg-6 bg-dark text-white flex-column justify-content-between p-5 position-relative overflow-hidden">

        {/* Decorative background */}
        <div className="register-pattern position-absolute top-0 start-0 w-100 h-100"></div>

        <div className="register-glow register-glow-one position-absolute"></div>
        <div className="register-glow register-glow-two position-absolute"></div>

        {/* Logo */}
        <div
          className="position-relative d-flex align-items-center gap-3"
          style={{ zIndex: 2 }}
        >
          <div className="register-logo-box rounded-3 d-flex align-items-center justify-content-center fw-bold fs-4">
            L
          </div>

          <div>
            <div className="fs-4 fw-bold">
              Learn<span className="text-info">Hub</span>
            </div>

            <div className="text-secondary small text-uppercase fw-semibold">
              MERN Platform
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div
          className="position-relative my-auto py-5"
          style={{ zIndex: 2, maxWidth: "560px" }}
        >
          <div className="register-badge d-inline-flex align-items-center gap-2 px-3 py-2 rounded-pill mb-4">
            <GraduationCap size={17} />
            <span>Join 120,000+ Learners</span>
          </div>

          <h1 className="display-5 fw-bold lh-sm mb-4">
            Start Your Journey.
            <br />
            <span className="text-info">
              Master In-Demand Skills.
            </span>
          </h1>

          <p className="text-secondary fs-6 lh-lg mb-4">
            Create your account to unlock world-class full-stack
            courses, engage with expert instructors, and build
            professional projects with real-time feedback.
          </p>

          {/* Features */}
          <div className="d-flex flex-column gap-3">
            {[
              "Unlimited access to beginner and advanced courses",
              "Collaborative peer community and discussion forums",
              "Verified certificates upon course completion",
            ].map((feature, index) => (
              <div
                key={index}
                className="d-flex align-items-center gap-3 text-secondary"
              >
                <div className="register-check rounded-circle d-flex align-items-center justify-content-center flex-shrink-0">
                  <CheckCircle2 size={14} />
                </div>

                <span className="small">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div
          className="position-relative border-top border-secondary pt-4 d-flex justify-content-between small text-secondary"
          style={{ zIndex: 2 }}
        >
          <span>
            © {new Date().getFullYear()} LearnHub Inc.
          </span>

          <div className="d-flex gap-4">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="col-12 col-lg-6 d-flex align-items-center justify-content-center bg-white p-4 p-sm-5 p-lg-5 overflow-auto">

        <div className="w-100 register-form-wrapper">

          {/* Mobile Logo */}
          <div className="d-flex d-lg-none align-items-center gap-3 mb-4">
            <div className="register-mobile-logo rounded-3 d-flex align-items-center justify-content-center fw-bold fs-5">
              L
            </div>

            <span className="fs-4 fw-bold">
              Learn<span className="text-info">Hub</span>
            </span>
          </div>

          {/* Heading */}
          <div className="mb-4">
            <h2 className="display-6 fw-bold mb-2">
              Create Your Account
            </h2>

            <p className="text-secondary mb-0">
              Start learning today with LearnHub's professional platform.
            </p>
          </div>

          {/* Social Buttons */}
          <div className="row g-3 mb-4">

            <div className="col-6">
              <button
                type="button"
                onClick={() =>
                  showToast("Google Authentication simulation")
                }
                className="btn btn-outline-secondary w-100 py-2 d-flex align-items-center justify-content-center gap-2"
              >
                <span className="fw-bold">G</span>
                Google
              </button>
            </div>

            <div className="col-6">
              <button
                type="button"
                onClick={() =>
                  showToast("GitHub Authentication simulation")
                }
                className="btn btn-outline-secondary w-100 py-2 d-flex align-items-center justify-content-center gap-2"
              >
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                GitHub
              </button>
            </div>

          </div>

          {/* Divider */}
          <div className="d-flex align-items-center gap-3 mb-4">
            <div className="flex-grow-1 border-top"></div>

            <span className="small text-secondary text-uppercase fw-semibold text-nowrap">
              Or register with email
            </span>

            <div className="flex-grow-1 border-top"></div>
          </div>

          {/* Form */}
          <form onSubmit={handleRegister}>

            {/* Full Name */}
            <div className="mb-3">
              <label className="form-label small fw-bold text-uppercase">
                Full Name
              </label>

              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <User size={17} />
                </span>

                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  className="form-control bg-light border-start-0 py-2"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="mb-3">
              <label className="form-label small fw-bold text-uppercase">
                Email Address
              </label>

              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <Mail size={17} />
                </span>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="form-control bg-light border-start-0 py-2"
                  required
                />
              </div>
            </div>

            {/* Passwords */}
            <div className="row g-3">

              {/* Password */}
              <div className="col-12 col-sm-6">
                <label className="form-label small fw-bold text-uppercase">
                  Password
                </label>

                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">
                    <Lock size={15} />
                  </span>

                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="form-control bg-light border-start-0 border-end-0 py-2"
                    required
                  />

                  <button
                    type="button"
                    className="btn btn-light border border-start-0"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={15} />
                    ) : (
                      <Eye size={15} />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="col-12 col-sm-6">
                <label className="form-label small fw-bold text-uppercase">
                  Confirm Password
                </label>

                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">
                    <Lock size={15} />
                  </span>

                  <input
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    value={confirmPassword}
                    onChange={(e) =>
                      setConfirmPassword(e.target.value)
                    }
                    placeholder="••••••••"
                    className="form-control bg-light border-start-0 border-end-0 py-2"
                    required
                  />

                  <button
                    type="button"
                    className="btn btn-light border border-start-0"
                    onClick={() =>
                      setShowConfirmPassword(
                        !showConfirmPassword
                      )
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={15} />
                    ) : (
                      <Eye size={15} />
                    )}
                  </button>
                </div>
              </div>

            </div>

            {/* Role */}
            <div className="mt-3 mb-3">
              <label className="form-label small fw-bold text-uppercase">
                I want to join as
              </label>

              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <Briefcase size={17} />
                </span>

                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="form-select bg-light border-start-0 py-2"
                >
                  <option value="student">
                    Student (Looking to learn skills)
                  </option>

                  <option value="instructor">
                    Instructor (Looking to teach & create courses)
                  </option>
                </select>
              </div>
            </div>

            {/* Terms */}
            <div className="form-check mb-4">
              <input
                type="checkbox"
                id="terms"
                checked={agreeTerms}
                onChange={(e) =>
                  setAgreeTerms(e.target.checked)
                }
                className="form-check-input"
              />

              <label
                htmlFor="terms"
                className="form-check-label small text-secondary"
              >
                I agree to the{" "}
                <span className="text-info fw-semibold">
                  Terms of Service
                </span>{" "}
                and{" "}
                <span className="text-info fw-semibold">
                  Privacy Policy
                </span>
                .
              </label>
            </div>

            {/* Register Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-dark w-100 py-3 fw-bold d-flex align-items-center justify-content-center gap-2"
            >
              {isLoading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                  ></span>

                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight size={17} />
                </>
              )}
            </button>

          </form>

          {/* Login */}
          <div className="text-center mt-4">
            <p className="small text-secondary mb-0">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-info fw-bold text-decoration-none"
              >
                Login
              </a>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
