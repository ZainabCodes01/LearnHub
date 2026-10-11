import React, { useEffect, useState } from "react";
import {
  Users,
  GraduationCap,
  UserRoundCheck,
  ShieldCheck,
  BookOpen,
  UserCheck,
  RefreshCw,
  Loader2,
  AlertCircle,
  UserCog,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function AdminDashboard() {
  const { user, token } = useAuth();

  const [analytics, setAnalytics] = useState({
    totalUsers: 0,
    totalStudents: 0,
    totalInstructors: 0,
    totalAdmins: 0,
    totalCourses: 0,
    totalEnrollments: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/users/analytics",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load analytics"
        );
      }

      setAnalytics(data.analytics);
    } catch (err) {
      console.error("Analytics error:", err);

      setError(
        err.message || "Unable to load dashboard analytics."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchAnalytics();
    }
  }, [token]);

  const stats = [
    {
      title: "Total Users",
      value: analytics.totalUsers,
      icon: Users,
      bg: "bg-primary-subtle",
      text: "text-primary",
    },
    {
      title: "Students",
      value: analytics.totalStudents,
      icon: GraduationCap,
      bg: "bg-success-subtle",
      text: "text-success",
    },
    {
      title: "Instructors",
      value: analytics.totalInstructors,
      icon: UserRoundCheck,
      bg: "bg-info-subtle",
      text: "text-info",
    },
    {
      title: "Admins",
      value: analytics.totalAdmins,
      icon: ShieldCheck,
      bg: "bg-warning-subtle",
      text: "text-warning-emphasis",
    },
    {
      title: "Total Courses",
      value: analytics.totalCourses,
      icon: BookOpen,
      bg: "bg-danger-subtle",
      text: "text-danger",
    },
    {
      title: "Enrollments",
      value: analytics.totalEnrollments,
      icon: UserCheck,
      bg: "bg-secondary-subtle",
      text: "text-secondary",
    },
  ];

  return (
    <div className="min-vh-100 bg-light">
      {/* Header */}
      <header className="bg-white border-bottom sticky-top">
        <div className="container-fluid px-4 py-3">
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <h1 className="h4 fw-bold mb-1">
                Admin Dashboard
              </h1>

              <p className="text-muted mb-0">
                Welcome back, {user?.name || "Admin"}
              </p>
            </div>

            <button
              type="button"
              className="btn btn-outline-primary d-flex align-items-center gap-2"
              onClick={fetchAnalytics}
              disabled={loading}
            >
              {loading ? (
                <Loader2 size={17} className="spin" />
              ) : (
                <RefreshCw size={17} />
              )}

              Refresh
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container-fluid px-4 py-4">
        {/* Error */}
        {error && (
          <div className="alert alert-danger d-flex align-items-center gap-2">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body text-center py-5">
              <Loader2
                size={40}
                className="text-primary mb-3"
              />

              <h5 className="fw-semibold">
                Loading dashboard...
              </h5>

              <p className="text-muted mb-0">
                Fetching the latest platform statistics.
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Welcome */}
            <div className="card border-0 shadow-sm rounded-4 mb-4">
              <div className="card-body p-4">
                <h2 className="h5 fw-bold mb-2">
                  LearnHub Overview
                </h2>

                <p className="text-muted mb-0">
                  Monitor users, courses and student
                  enrollments from the admin panel.
                </p>
              </div>
            </div>


            {/* Quick Actions */}
            <div className="row g-4 mb-4">

              {/* Users Management */}
              <div className="col-12 col-md-6 col-xl-4">
                <Link to="/admin-users" className="text-decoration-none">
                  <div
                    className="card border-0 shadow-sm rounded-4 h-100"
                    style={{
                      background:
                        "linear-gradient(135deg, #023859 0%, #011C40 60%, #54ACBF 100%)",
                      transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    }}
                  >
                    <div className="card-body p-4 text-white">
                      <div className="d-flex align-items-center justify-content-between mb-4">
                        <div
                          className="rounded-4 p-3"
                          style={{ background: "rgba(255,255,255,0.15)" }}
                        >
                          <UserCog size={30} />
                        </div>
                        <ArrowRight size={22} />
                      </div>

                      <h3 className="h5 fw-bold mb-2">Users Management</h3>
                      <p className="mb-3 small text-white-50">
                        View users, manage roles and control user accounts.
                      </p>
                      <span className="small fw-semibold">Manage Users →</span>
                    </div>
                  </div>
                </Link>
              </div>

              {/* Courses Management */}
              <div className="col-12 col-md-6 col-xl-4">
                <Link to="/admin-courses" className="text-decoration-none">
                  <div
                    className="card border-0 shadow-sm rounded-4 h-100"
                    style={{
                      background:
                        "linear-gradient(135deg, #023859 0%, #011C40 60%, #54ACBF 100%)",
                      transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    }}
                  >
                    <div className="card-body p-4 text-white">
                      <div className="d-flex align-items-center justify-content-between mb-4">
                        <div
                          className="rounded-4 p-3"
                          style={{ background: "rgba(255,255,255,0.15)" }}
                        >
                          <BookOpen size={30} />
                        </div>
                        <ArrowRight size={22} />
                      </div>

                      <h3 className="h5 fw-bold mb-2">Courses Management</h3>
                      <p className="mb-3 small text-white-50">
                        View courses, add new courses, edit details and manage courses.
                      </p>
                      <span className="small fw-semibold">Manage Courses →</span>
                    </div>
                  </div>
                </Link>
              </div>

            </div>

            {/* Statistics */}
            <div className="row g-4">
              {stats.map((stat) => {
                const Icon = stat.icon;

                return (
                  <div
                    className="col-12 col-sm-6 col-xl-4"
                    key={stat.title}
                  >
                    <div className="card border-0 shadow-sm rounded-4 h-100">
                      <div className="card-body p-4">
                        <div className="d-flex align-items-center justify-content-between">
                          <div>
                            <p className="text-muted mb-2">
                              {stat.title}
                            </p>

                            <h2 className="fw-bold mb-0">
                              {stat.value}
                            </h2>
                          </div>

                          <div
                            className={`${stat.bg} ${stat.text} rounded-4 p-3`}
                          >
                            <Icon size={28} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary */}
            <div className="card border-0 shadow-sm rounded-4 mt-4">
              <div className="card-body p-4">
                <h3 className="h5 fw-bold mb-3">
                  Platform Summary
                </h3>

                <div className="row g-3">
                  <div className="col-md-4">
                    <div className="p-3 bg-light rounded-3">
                      <small className="text-muted d-block">
                        Students per Instructor
                      </small>

                      <strong className="fs-4">
                        {analytics.totalInstructors > 0
                          ? (
                            analytics.totalStudents /
                            analytics.totalInstructors
                          ).toFixed(1)
                          : "0"}
                      </strong>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="p-3 bg-light rounded-3">
                      <small className="text-muted d-block">
                        Enrollments per Course
                      </small>

                      <strong className="fs-4">
                        {analytics.totalCourses > 0
                          ? (
                            analytics.totalEnrollments /
                            analytics.totalCourses
                          ).toFixed(1)
                          : "0"}
                      </strong>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="p-3 bg-light rounded-3">
                      <small className="text-muted d-block">
                        Admin Accounts
                      </small>

                      <strong className="fs-4">
                        {analytics.totalAdmins}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      <footer className="bg-white border-top py-3 text-center mt-5">
        <small className="text-muted">
          © {new Date().getFullYear()} LearnHub Admin Panel.
          All rights reserved.
        </small>
      </footer>
    </div>
  );
}

export default AdminDashboard;
