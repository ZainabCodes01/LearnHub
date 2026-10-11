import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  PlusCircle,
  Users,
  Bell,
  Search,
  DollarSign,
  TrendingUp,
  CheckCircle2,
  Eye,
  Edit,
  ShieldCheck,
  Sparkles,
  ArrowRight,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { getCourses } from "../services/courseService";

function InstructorDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [courses, setCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState("");

  const showToast = (message) => {
    setNotification(message);

    setTimeout(() => {
      setNotification("");
    }, 3500);
  };

  // ==============================
  // Fetch Instructor Courses
  // ==============================
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);

        const data = await getCourses();

        const instructorCourses = data.filter((course) => {
          const instructorId =
            typeof course.instructor === "object"
              ? course.instructor?._id
              : course.instructor;

          return instructorId === user?.id;
        });

        setCourses(instructorCourses);
      } catch (error) {
        console.error(
          "FAILED TO FETCH COURSES:",
          error
        );

        showToast(
          error.response?.data?.message ||
            "Unable to load your courses."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [user]);

  // ==============================
  // Search Courses
  // ==============================
  const filteredCourses = courses.filter((course) => {
    const query = searchQuery.toLowerCase();

    return (
      course.title?.toLowerCase().includes(query) ||
      course.category?.toLowerCase().includes(query) ||
      course.level?.toLowerCase().includes(query)
    );
  });

  // ==============================
  // Statistics
  // ==============================
  const totalCourses = courses.length;

  const totalStudents = courses.reduce(
    (total, course) =>
      total + Number(course.enrolledStudentsCount || 0),
    0
  );

  const publishedCourses = courses.filter(
    (course) => course.status !== "Draft"
  ).length;

  const totalRevenue = courses.reduce(
    (total, course) => {
      const students = Number(
        course.enrolledStudentsCount || 0
      );

      const price = Number(course.price || 0);

      return total + students * price;
    },
    0
  );

  const averageRating =
    courses.length > 0
      ? (
          courses.reduce(
            (total, course) =>
              total +
              Number(course.averageRating || 0),
            0
          ) / courses.length
        ).toFixed(1)
      : "0.0";

  // ==============================
  // Loading
  // ==============================
  if (loading) {
    return (
      <div className="container-fluid py-5">
        <div className="text-center py-5">

          <div
            className="spinner-border text-primary"
            role="status"
          >
            <span className="visually-hidden">
              Loading...
            </span>
          </div>

          <p className="text-secondary mt-3 mb-0">
            Loading instructor dashboard...
          </p>

        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-light">

      {/* ==============================
          Toast Notification
      ============================== */}
      {notification && (
        <div
          className="position-fixed top-0 end-0 m-4 bg-dark text-white px-4 py-3 rounded-3 shadow-lg d-flex align-items-center gap-2"
          style={{
            zIndex: 1055,
            maxWidth: "400px",
          }}
        >
          <ShieldCheck
            size={20}
            className="text-info"
          />

          <span className="small fw-semibold">
            {notification}
          </span>
        </div>
      )}

      {/* ==============================
          HEADER
      ============================== */}
      <header className="bg-white border-bottom sticky-top">

        <div className="container-fluid px-4 py-3">

          <div className="d-flex align-items-center justify-content-between gap-3">

            <div>
              <h1 className="h3 fw-bold mb-1">
                Instructor Dashboard
              </h1>

              <p className="text-secondary small mb-0">
                Manage your courses and track your
                teaching performance.
              </p>
            </div>

            <div className="d-flex align-items-center gap-2">

              {/* Search */}
              <div className="input-group d-none d-md-flex">

                <span className="input-group-text bg-light border-end-0">
                  <Search size={17} />
                </span>

                <input
                  type="text"
                  className="form-control bg-light border-start-0"
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) =>
                    setSearchQuery(e.target.value)
                  }
                />

              </div>

              {/* Notification */}
              <button
                type="button"
                className="btn btn-outline-secondary position-relative"
                onClick={() =>
                  showToast(
                    "No new notifications."
                  )
                }
              >
                <Bell size={18} />

                <span className="position-absolute top-0 start-100 translate-middle p-1 bg-info border border-white rounded-circle"></span>
              </button>

              {/* Add Course */}
              <button
                type="button"
                className="btn btn-dark d-flex align-items-center gap-2"
                onClick={() =>
                  navigate("/add-course")
                }
              >
                <PlusCircle size={17} />

                <span className="d-none d-sm-inline">
                  Add Course
                </span>
              </button>

            </div>

          </div>

          {/* Mobile Search */}
          <div className="input-group d-md-none mt-3">

            <span className="input-group-text bg-light border-end-0">
              <Search size={17} />
            </span>

            <input
              type="text"
              className="form-control bg-light border-start-0"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) =>
                setSearchQuery(e.target.value)
              }
            />

          </div>

        </div>

      </header>

      {/* ==============================
          MAIN CONTENT
      ============================== */}
      <main className="p-4 p-xl-5">

        {/* ==============================
            WELCOME BANNER
        ============================== */}
        <section className="bg-dark text-white rounded-4 shadow-lg p-4 p-md-5 mb-4">

          <div className="row align-items-center g-4">

            <div className="col-lg-8">

              <span className="badge bg-info text-dark rounded-pill px-3 py-2 mb-3">

                <Sparkles
                  size={14}
                  className="me-1"
                />

                Welcome back,{" "}
                {user?.name || "Instructor"}!

              </span>

              <h2 className="display-6 fw-bold mb-3">
                Ready to inspire your students
                today?
              </h2>

              <p className="text-secondary mb-0">

                You currently have{" "}

                <span className="text-info fw-bold">
                  {totalStudents}
                </span>{" "}

                students enrolled across your
                courses.

              </p>

            </div>

            <div className="col-lg-4 text-lg-end">

              <button
                type="button"
                className="btn btn-info btn-lg fw-bold d-inline-flex align-items-center gap-2"
                onClick={() =>
                  navigate("/manage-courses")
                }
              >
                Manage Courses
                <ArrowRight size={19} />
              </button>

            </div>

          </div>

        </section>

        {/* ==============================
            STATISTICS
        ============================== */}
        <section className="mb-4">

          <div className="row g-3">

            {/* Total Courses */}
            <div className="col-12 col-sm-6 col-xl-3">

              <div className="card border-0 shadow-sm h-100 rounded-4">

                <div className="card-body p-4">

                  <div className="d-flex justify-content-between align-items-start">

                    <div>

                      <small className="text-secondary fw-bold text-uppercase">
                        Total Courses
                      </small>

                      <h2 className="fw-bold mt-2 mb-1">
                        {totalCourses}
                      </h2>

                      <small className="text-success fw-semibold">
                        Your courses
                      </small>

                    </div>

                    <div className="bg-info bg-opacity-10 text-info rounded-3 p-3">
                      <BookOpen size={25} />
                    </div>

                  </div>

                </div>

              </div>

            </div>

            {/* Students */}
            <div className="col-12 col-sm-6 col-xl-3">

              <div className="card border-0 shadow-sm h-100 rounded-4">

                <div className="card-body p-4">

                  <div className="d-flex justify-content-between align-items-start">

                    <div>

                      <small className="text-secondary fw-bold text-uppercase">
                        Total Students
                      </small>

                      <h2 className="fw-bold mt-2 mb-1">
                        {totalStudents}
                      </h2>

                      <small className="text-success fw-semibold">
                        Enrolled students
                      </small>

                    </div>

                    <div className="bg-primary bg-opacity-10 text-primary rounded-3 p-3">
                      <Users size={25} />
                    </div>

                  </div>

                </div>

              </div>

            </div>

            {/* Published */}
            <div className="col-12 col-sm-6 col-xl-3">

              <div className="card border-0 shadow-sm h-100 rounded-4">

                <div className="card-body p-4">

                  <div className="d-flex justify-content-between align-items-start">

                    <div>

                      <small className="text-secondary fw-bold text-uppercase">
                        Published Courses
                      </small>

                      <h2 className="fw-bold mt-2 mb-1">
                        {publishedCourses}
                      </h2>

                      <small className="text-success fw-semibold">
                        Active courses
                      </small>

                    </div>

                    <div className="bg-success bg-opacity-10 text-success rounded-3 p-3">
                      <CheckCircle2 size={25} />
                    </div>

                  </div>

                </div>

              </div>

            </div>

            {/* Revenue */}
            <div className="col-12 col-sm-6 col-xl-3">

              <div className="card border-0 shadow-sm h-100 rounded-4">

                <div className="card-body p-4">

                  <div className="d-flex justify-content-between align-items-start">

                    <div>

                      <small className="text-secondary fw-bold text-uppercase">
                        Estimated Revenue
                      </small>

                      <h2 className="fw-bold mt-2 mb-1">

                        $
                        {totalRevenue.toLocaleString(
                          "en-US",
                          {
                            maximumFractionDigits: 2,
                          }
                        )}

                      </h2>

                      <small className="text-success fw-semibold">
                        Based on enrollments
                      </small>

                    </div>

                    <div className="bg-warning bg-opacity-10 text-warning rounded-3 p-3">
                      <DollarSign size={25} />
                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </section>

        {/* ==============================
            EXTRA SUMMARY
        ============================== */}
        <section className="mb-4">

          <div className="row g-3">

            <div className="col-md-6">

              <div className="card border-0 shadow-sm rounded-4">

                <div className="card-body p-4 d-flex align-items-center gap-3">

                  <div className="bg-primary bg-opacity-10 text-primary rounded-3 p-3">
                    <TrendingUp size={25} />
                  </div>

                  <div>

                    <small className="text-secondary">
                      Average Course Rating
                    </small>

                    <h4 className="fw-bold mb-0">
                      {averageRating} / 5
                    </h4>

                  </div>

                </div>

              </div>

            </div>

            <div className="col-md-6">

              <div className="card border-0 shadow-sm rounded-4">

                <div className="card-body p-4 d-flex align-items-center gap-3">

                  <div className="bg-success bg-opacity-10 text-success rounded-3 p-3">
                    <CheckCircle2 size={25} />
                  </div>

                  <div>

                    <small className="text-secondary">
                      Course Catalog
                    </small>

                    <h4 className="fw-bold mb-0">
                      {courses.length}{" "}
                      {courses.length === 1
                        ? "Course"
                        : "Courses"}
                    </h4>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </section>

        {/* ==============================
            COURSES
        ============================== */}
        <section className="card border-0 shadow-sm rounded-4 overflow-hidden">

          <div className="card-header bg-white border-bottom p-4">

            <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">

              <div>

                <h3 className="h5 fw-bold mb-1">
                  Recent Courses
                </h3>

                <p className="text-secondary small mb-0">
                  Manage your course catalog and
                  view enrollment information.
                </p>

              </div>

              <button
                type="button"
                className="btn btn-outline-dark d-flex align-items-center justify-content-center gap-2"
                onClick={() =>
                  navigate("/manage-courses")
                }
              >
                View All Courses
                <ArrowRight size={17} />
              </button>

            </div>

          </div>

          {filteredCourses.length === 0 ? (

            <div className="text-center py-5 px-4">

              <BookOpen
                size={45}
                className="text-secondary mb-3"
              />

              <h5 className="fw-bold">

                {courses.length === 0
                  ? "No courses yet"
                  : "No matching courses"}

              </h5>

              <p className="text-secondary">

                {courses.length === 0
                  ? "Create your first course to start teaching students."
                  : "Try a different search term."}

              </p>

              {courses.length === 0 && (

                <button
                  type="button"
                  className="btn btn-dark d-inline-flex align-items-center gap-2"
                  onClick={() =>
                    navigate("/add-course")
                  }
                >
                  <PlusCircle size={18} />
                  Create Course
                </button>

              )}

            </div>

          ) : (

            <div className="table-responsive">

              <table className="table table-hover align-middle mb-0">

                <thead className="table-light">

                  <tr>

                    <th className="px-4 py-3">
                      Course Title
                    </th>

                    <th className="py-3">
                      Category
                    </th>

                    <th className="py-3">
                      Students
                    </th>

                    <th className="py-3">
                      Price
                    </th>

                    <th className="py-3">
                      Rating
                    </th>

                    <th className="py-3">
                      Status
                    </th>

                    <th className="text-end px-4 py-3">
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {filteredCourses
                    .slice(0, 6)
                    .map((course) => (

                      <tr key={course._id}>

                        <td className="px-4 py-3">

                          <div
                            className="fw-bold text-dark text-truncate"
                            style={{
                              maxWidth: "280px",
                            }}
                          >
                            {course.title}
                          </div>

                          <small className="text-secondary">
                            {course.level ||
                              "All Levels"}
                          </small>

                        </td>

                        <td>

                          <span className="badge bg-info-subtle text-info-emphasis rounded-pill">
                            {course.category ||
                              "General"}
                          </span>

                        </td>

                        <td className="fw-semibold">
                          {Number(
                            course.enrolledStudentsCount ||
                              0
                          )}
                        </td>

                        <td className="fw-bold">
                          $
                          {Number(
                            course.price || 0
                          ).toFixed(2)}
                        </td>

                        <td>

                          <span className="fw-semibold">
                            {Number(
                              course.averageRating ||
                                0
                            ).toFixed(1)}
                          </span>

                          <small className="text-secondary">
                            {" "}
                            / 5
                          </small>

                        </td>

                        <td>

                          <span className="badge bg-success-subtle text-success-emphasis rounded-pill">

                            <CheckCircle2
                              size={12}
                              className="me-1"
                            />

                            Active

                          </span>

                        </td>

                        <td className="text-end px-4">

                          <div className="d-flex justify-content-end gap-2">

                            {/* View */}
                            <button
                              type="button"
                              className="btn btn-sm btn-light border"
                              title="View Course"
                              onClick={() =>
                                navigate(
                                  `/courses/${course._id}`
                                )
                              }
                            >
                              <Eye size={16} />
                            </button>

                            {/* Edit */}
                            <button
                              type="button"
                              className="btn btn-sm btn-light border"
                              title="Edit Course"
                              onClick={() =>
                                navigate(
                                  `/edit-course/${course._id}`
                                )
                              }
                            >
                              <Edit size={16} />
                            </button>

                            {/* Manage Lessons */}
                            <button
                              type="button"
                              className="btn btn-sm btn-primary"
                              title="Manage Lessons"
                              onClick={() =>
                                navigate(
                                  `/manage-lessons?courseId=${course._id}`
                                )
                              }
                            >
                              Lessons
                            </button>

                          </div>

                        </td>

                      </tr>

                    ))}

                </tbody>

              </table>

            </div>

          )}

        </section>

      </main>

      {/* Footer */}
      <footer className="bg-white border-top text-center py-4">

        <small className="text-secondary">
          © {new Date().getFullYear()} LearnHub
          Instructor Dashboard & LMS Management
          System.
        </small>

      </footer>

    </div>
  );
}

export default InstructorDashboard;