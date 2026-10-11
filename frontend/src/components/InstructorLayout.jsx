import React from "react";
import {
  LayoutDashboard,
  BookOpen,
  PlusCircle,
  Users,
  User,
} from "lucide-react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function InstructorLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const sidebarItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/instructor-dashboard",
    },
    {
      id: "courses",
      label: "My Courses",
      icon: BookOpen,
      path: "/manage-courses",
    },
    {
      id: "add-course",
      label: "Add Course",
      icon: PlusCircle,
      path: "/add-course",
    },
    {
      id: "students",
      label: "Students",
      icon: Users,
      path: "/instructor-students",
    },
    {
      id: "profile",
      label: "Profile",
      icon: User,
      path: "/profile",
    },
  ];

  const getActiveTab = () => {
    if (location.pathname === "/instructor-dashboard") {
      return "dashboard";
    }

    if (location.pathname === "/manage-courses") {
      return "courses";
    }

    if (location.pathname === "/add-course") {
      return "add-course";
    }

    if (location.pathname === "/instructor-students") {
      return "students";
    }

    if (location.pathname === "/profile") {
      return "profile";
    }

    return "";
  };

  const activeTab = getActiveTab();

  const handleNavigation = (path) => {
    navigate(path);
  };

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .substring(0, 2)
        .toUpperCase()
    : "IN";

  return (
    <div className="min-vh-100 bg-light">

      <div className="container-fluid px-0">

        <div className="row g-0 min-vh-100">

          {/* ================= SIDEBAR ================= */}
          <aside className="col-lg-3 col-xl-2 bg-dark text-white d-none d-lg-flex flex-column justify-content-between">

            <div>

              {/* Brand */}
              <div className="p-4 border-bottom border-secondary">

                <div className="d-flex align-items-center gap-3">

                  <div
                    className="bg-info text-dark rounded-3 d-flex align-items-center justify-content-center fw-bold fs-4"
                    style={{
                      width: "42px",
                      height: "42px",
                    }}
                  >
                    L
                  </div>

                  <div>

                    <div className="fs-5 fw-bold">
                      Learn<span className="text-info">
                        Hub
                      </span>
                    </div>

                    <div
                      className="text-secondary"
                      style={{
                        fontSize: "10px",
                        letterSpacing: "1.5px",
                      }}
                    >
                      INSTRUCTOR PORTAL
                    </div>

                  </div>

                </div>

              </div>

              {/* Navigation */}
              <nav className="p-3">

                {sidebarItems.map((item) => {
                  const Icon = item.icon;

                  const isActive =
                    activeTab === item.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() =>
                        handleNavigation(item.path)
                      }
                      className={`btn w-100 text-start d-flex align-items-center gap-3 mb-2 rounded-3 py-3 ${
                        isActive
                          ? "btn-info text-dark fw-bold"
                          : "text-white bg-transparent border-0"
                      }`}
                    >
                      <Icon size={19} />

                      <span>
                        {item.label}
                      </span>
                    </button>
                  );
                })}

              </nav>

            </div>

            {/* Instructor Info */}
            <div className="p-3 border-top border-secondary">

              <div className="bg-secondary bg-opacity-25 rounded-3 p-3 d-flex align-items-center gap-3">

                <div
                  className="bg-info bg-opacity-25 text-info rounded-circle d-flex align-items-center justify-content-center fw-bold"
                  style={{
                    width: "42px",
                    height: "42px",
                  }}
                >
                  {initials}
                </div>

                <div className="overflow-hidden">

                  <div className="fw-bold text-white text-truncate">
                    {user?.name || "Instructor"}
                  </div>

                  <small className="text-secondary">
                    Instructor
                  </small>

                </div>

              </div>

            </div>

          </aside>

          {/* ================= MAIN CONTENT ================= */}
          <main className="col-lg-9 col-xl-10 bg-light">

            <Outlet />

          </main>

        </div>

      </div>

    </div>
  );
}

export default InstructorLayout;