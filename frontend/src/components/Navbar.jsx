import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  LayoutDashboard,
  BookOpen,
  User,
  LogOut,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeMobileMenu();
    navigate("/login");
  };

  const goTo = (path) => {
    closeMobileMenu();
    navigate(path);
  };

  const getProfilePath = () => {
    if (user?.role === "Admin") return "/admin-dashboard";
    if (user?.role === "Instructor") return "/instructor-dashboard";
    if (user?.role === "Student") return "/student-dashboard";
    return "/login";
  };

  return (
    <header className="navbar-learnhub sticky-top">
      <div className="container-xl">
        <div className="d-flex align-items-center justify-content-between navbar-inner">

          {/* BRAND */}
          <Link
            to="/"
            className="brand-link text-decoration-none"
            onClick={closeMobileMenu}
          >
            <div className="brand-logo">L</div>

            <div className="d-flex flex-column">
              <span className="brand-name">
                Learn<span>Hub</span>
              </span>

              <span className="brand-subtitle">
                MERN Platform
              </span>
            </div>
          </Link>

          {/* DESKTOP NAV */}
          <nav className="desktop-nav d-none d-md-flex align-items-center gap-4">

            <Link to="/" className="nav-link">
              Home
            </Link>

            <Link to="/courses" className="nav-link">
              Courses
            </Link>

            <a href="/#features" className="nav-link">
              About
            </a>

            <a href="/#stats" className="nav-link">
              Stats
            </a>

            {/* STUDENT */}
            {isAuthenticated && user?.role === "Student" && (
              <>
                <Link
                  to="/my-courses"
                  className="nav-link d-flex align-items-center gap-1"
                >
                  <BookOpen size={16} />
                  My Courses
                </Link>

                <Link
                  to="/student-dashboard"
                  className="nav-link d-flex align-items-center gap-1"
                >
                  <LayoutDashboard size={16} />
                  Dashboard
                </Link>
              </>
            )}

            {/* INSTRUCTOR */}
            {isAuthenticated && user?.role === "Instructor" && (
              <>
                <Link
                  to="/manage-courses"
                  className="nav-link"
                >
                  Manage Courses
                </Link>

                <Link
                  to="/instructor-dashboard"
                  className="nav-link d-flex align-items-center gap-1"
                >
                  <LayoutDashboard size={16} />
                  Dashboard
                </Link>
              </>
            )}

            {/* ADMIN */}
            {isAuthenticated && user?.role === "Admin" && (
              <Link
                to="/admin-dashboard"
                className="nav-link d-flex align-items-center gap-1"
              >
                <LayoutDashboard size={16} />
                Dashboard
              </Link>
            )}
          </nav>

          {/* DESKTOP ACTIONS */}
          <div className="desktop-actions d-none d-md-flex align-items-center gap-2">

            {!isAuthenticated ? (
              <>
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="btn btn-signin"
                >
                  Sign In
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/register")}
                  className="btn btn-register"
                >
                  Register Free
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                 onClick={() => navigate("/profile")}
                  className="btn btn-signin d-flex align-items-center gap-1"
                  style={{ position: "relative", zIndex: 99999, pointerEvents: "auto" }}
                >
                  <User size={17} />
                  Profile
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="btn btn-register d-flex align-items-center gap-1"
                >
                  <LogOut size={17} />
                  Logout
                </button>
              </>
            )}
          </div>

          {/* MOBILE BUTTON */}
          <button
            type="button"
            className="mobile-menu-button d-md-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? (
              <X size={25} />
            ) : (
              <Menu size={25} />
            )}
          </button>
        </div>

        {/* MOBILE MENU */}
        {mobileMenuOpen && (
          <div className="mobile-menu d-md-none">

            <Link to="/" onClick={closeMobileMenu}>
              Home
            </Link>

            <Link to="/courses" onClick={closeMobileMenu}>
              Courses
            </Link>

            <a href="/#features" onClick={closeMobileMenu}>
              About
            </a>

            <a href="/#stats" onClick={closeMobileMenu}>
              Stats
            </a>

            {/* STUDENT MOBILE */}
            {isAuthenticated && user?.role === "Student" && (
              <>
                <Link
                  to="/my-courses"
                  onClick={closeMobileMenu}
                >
                  My Courses
                </Link>

                <Link
                  to="/student-dashboard"
                  onClick={closeMobileMenu}
                >
                  Dashboard
                </Link>
              </>
            )}

            {/* INSTRUCTOR MOBILE */}
            {isAuthenticated && user?.role === "Instructor" && (
              <>
                <Link
                  to="/manage-courses"
                  onClick={closeMobileMenu}
                >
                  Manage Courses
                </Link>

                <Link
                  to="/instructor-dashboard"
                  onClick={closeMobileMenu}
                >
                  Dashboard
                </Link>
              </>
            )}

            {/* ADMIN MOBILE */}
            {isAuthenticated && user?.role === "Admin" && (
              <Link
                to="/admin-dashboard"
                onClick={closeMobileMenu}
              >
                Admin Dashboard
              </Link>
            )}

            <div className="mobile-actions">

              {!isAuthenticated ? (
                <>
                  <button
                    type="button"
                    onClick={() => goTo("/login")}
                    className="btn btn-light w-100"
                  >
                    Sign In
                  </button>

                  <button
                    type="button"
                    onClick={() => goTo("/register")}
                    className="btn btn-dark w-100"
                  >
                    Register Free
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => goTo("/profile")}
                    className="btn btn-signin d-flex align-items-center gap-1"
                  >
                    <User size={17} />
                    Profile
                  </button>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="btn btn-dark w-100 d-flex align-items-center justify-content-center gap-2"
                  >
                    <LogOut size={17} />
                    Logout
                  </button>
                </>
              )}

            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;