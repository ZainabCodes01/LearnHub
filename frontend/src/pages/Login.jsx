import { loginUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import React, { useState } from "react";
import {
  BookOpen,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  GraduationCap,
  CheckCircle2,
  Eye,
  EyeOff,
} from "lucide-react";

function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [notification, setNotification] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const showToast = (message) => {
    setNotification(message);

    setTimeout(() => {
      setNotification("");
    }, 3500);
  };

  const handleLogin = async (e) => {
  e.preventDefault();

  if (!email || !password) {
    showToast("Please enter both email and password.");
    return;
  }

  try {
    setIsLoading(true);

    const data = await loginUser(email, password);

    console.log("Login response:", data);

    login(data.user, data.token);

    showToast("Login successful! Welcome back.");

  } catch (error) {
    console.error("Login error:", error);

    const message =
      error.response?.data?.message ||
      "Login failed. Please check your email and password.";

    showToast(message);
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="login-page min-vh-100 bg-light">
      {/* Notification */}
      {notification && (
        <div
          className="position-fixed top-0 end-0 m-4 bg-dark text-white px-4 py-3 rounded-3 shadow-lg d-flex align-items-center gap-2"
          style={{ zIndex: 1050 }}
        >
          <ShieldCheck size={20} className="text-info" />
          <span className="small fw-medium">{notification}</span>
        </div>
      )}

      <div className="container-fluid min-vh-100 p-0">
        <div className="row min-vh-100 g-0">

          {/* LEFT SIDE */}
          <div className="col-lg-6 d-none d-lg-flex login-left-panel text-white flex-column justify-content-between p-5 position-relative overflow-hidden">
            
            <div className="position-relative z-2">

              {/* Logo */}
              <div
                className="d-flex align-items-center gap-3"
                style={{ cursor: "pointer" }}
                onClick={() => showToast("LearnHub Platform")}
              >
                <div className="login-logo-box">
                  <BookOpen size={22} />
                </div>

                <div>
                  <div className="fs-4 fw-bold">
                    Learn<span className="text-info">Hub</span>
                  </div>

                  <div className="small text-secondary text-uppercase">
                    MERN Platform
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="login-left-content">

                <div className="login-badge mb-4">
                  <GraduationCap size={18} />
                  <span>Next-Gen Online Academy</span>
                </div>

                <h1 className="display-4 fw-bold lh-sm mb-4">
                  Learn Skills.
                  <br />
                  <span className="text-info">
                    Build Your Future.
                  </span>
                </h1>

                <p className="text-light opacity-75 lh-lg mb-4">
                  Access 2,500+ expert-led courses in full-stack
                  development, cloud architecture, and modern UI/UX
                  design. Empower your career with certified mastery.
                </p>

                {/* Features */}
                <div className="d-flex flex-column gap-3">

                  {[
                    "Interactive hands-on coding environments",
                    "Globally recognized professional certificates",
                    "Lifetime access to course updates and community",
                  ].map((feature, index) => (
                    <div
                      key={index}
                      className="d-flex align-items-center gap-3"
                    >
                      <div className="login-check-icon">
                        <CheckCircle2 size={15} />
                      </div>

                      <span className="small text-light opacity-75">
                        {feature}
                      </span>
                    </div>
                  ))}

                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="position-relative z-2 border-top border-secondary pt-3 d-flex justify-content-between small text-secondary">
              <span>
                © {new Date().getFullYear()} LearnHub Inc.
              </span>

              <div className="d-flex gap-3">
                <span>Privacy Policy</span>
                <span>Terms of Service</span>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="col-lg-6 d-flex align-items-center justify-content-center bg-white p-4 p-md-5">

            <div className="w-100" style={{ maxWidth: "460px" }}>

              {/* Mobile Logo */}
              <div className="d-flex d-lg-none align-items-center gap-2 mb-5">
                <div className="login-mobile-logo">
                  <BookOpen size={19} />
                </div>

                <span className="fs-4 fw-bold">
                  Learn<span className="text-info">Hub</span>
                </span>
              </div>

              {/* Heading */}
              <div className="mb-4">
                <h2 className="display-6 fw-bold mb-2">
                  Welcome Back
                </h2>

                <p className="text-secondary mb-0">
                  Continue your learning journey and explore new skills.
                </p>
              </div>

              {/* Social Login */}
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
                    <span className="fw-bold">GH</span>
                    GitHub
                  </button>
                </div>

              </div>

              {/* Divider */}
              <div className="d-flex align-items-center gap-3 mb-4">
                <div className="flex-grow-1 border-top"></div>

                <span className="small text-secondary text-nowrap">
                  OR CONTINUE WITH EMAIL
                </span>

                <div className="flex-grow-1 border-top"></div>
              </div>

              {/* Login Form */}
              <form onSubmit={handleLogin}>

                {/* Email */}
                <div className="mb-3">
                  <label className="form-label fw-semibold small">
                    EMAIL ADDRESS
                  </label>

                  <div className="input-group">
                    <span className="input-group-text bg-light">
                      <Mail size={17} className="text-secondary" />
                    </span>

                    <input
                      type="email"
                      className="form-control form-control-lg bg-light"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="mb-3">

                  <div className="d-flex justify-content-between align-items-center">
                    <label className="form-label fw-semibold small">
                      PASSWORD
                    </label>

                    <button
                      type="button"
                      className="btn btn-link btn-sm text-info text-decoration-none p-0"
                      onClick={() =>
                        showToast("Password reset link sent to your email.")
                      }
                    >
                      Forgot Password?
                    </button>
                  </div>

                  <div className="input-group">
                    <span className="input-group-text bg-light">
                      <Lock size={17} className="text-secondary" />
                    </span>

                    <input
                      type={showPassword ? "text" : "password"}
                      className="form-control form-control-lg bg-light"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />

                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() =>
                        setShowPassword(!showPassword)
                      }
                    >
                      {showPassword ? (
                        <EyeOff size={17} />
                      ) : (
                        <Eye size={17} />
                      )}
                    </button>
                  </div>

                </div>

                {/* Remember Me */}
                <div className="form-check mb-4">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={(e) =>
                      setRememberMe(e.target.checked)
                    }
                  />

                  <label
                    htmlFor="rememberMe"
                    className="form-check-label text-secondary"
                  >
                    Remember me
                  </label>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn btn-dark btn-lg w-100 d-flex align-items-center justify-content-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm"
                        role="status"
                      ></span>

                      Logging in...
                    </>
                  ) : (
                    <>
                      Login to LearnHub
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>

              </form>

              {/* Register */}
              <div className="text-center mt-4">
                <span className="text-secondary">
                  Don't have an account?{""}
                </span>

                <button
                  type="button"
                  className="btn btn-link text-info fw-bold text-decoration-none p-0"
                  onClick={() =>
                    showToast("Redirecting to registration page...")
                  }
                >
                  Register
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Login;