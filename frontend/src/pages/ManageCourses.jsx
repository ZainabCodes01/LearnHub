import React, { useEffect, useState } from "react";
import {
  Bell,
  ShieldCheck,
  Search,
  Edit3,
  Trash2,
  BookMarked,
  AlertCircle,
  PlusCircle,
  Users,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import API_URL from "../services/api";

const COURSES_URL = `${API_URL}/api/courses`;

export default function ManageCourses() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState("All");

  const [notification, setNotification] = useState("");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalCourse, setDeleteModalCourse] =
    useState(null);

  // ==============================
  // Toast
  // ==============================
  const showToast = (message) => {
    setNotification(message);

    setTimeout(() => {
      setNotification("");
    }, 3500);
  };

  // ==============================
  // Fetch Courses
  // ==============================
  const fetchCourses = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await axios.get(COURSES_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCourses(response.data.courses || []);
    } catch (error) {
      console.error("Fetch courses error:", error);

      showToast(
        error.response?.data?.message ||
          "Unable to load courses."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // ==============================
  // Delete Course
  // ==============================
  const handleDeleteCourse = async () => {
    if (!deleteModalCourse) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `${COURSES_URL}/${deleteModalCourse._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCourses((prev) =>
        prev.filter(
          (course) =>
            course._id !== deleteModalCourse._id
        )
      );

      setDeleteModalCourse(null);

      showToast("Course successfully deleted.");
    } catch (error) {
      console.error(
        "Delete course error:",
        error
      );

      showToast(
        error.response?.data?.message ||
          "Unable to delete course."
      );
    }
  };

  // ==============================
  // Filter Courses
  // ==============================
  const filteredCourses = courses.filter(
    (course) => {
      const title =
        course.title?.toLowerCase() || "";

      const category =
        course.category?.toLowerCase() || "";

      const search =
        searchQuery.toLowerCase();

      const matchesSearch =
        title.includes(search) ||
        category.includes(search);

      const matchesCategory =
        selectedCategory === "All" ||
        course.category === selectedCategory;

      return (
        matchesSearch &&
        matchesCategory
      );
    }
  );

  return (
    <div className="min-vh-100 bg-light text-dark">

      {/* ==============================
          Toast
      ============================== */}
      {notification && (
        <div
          className="position-fixed top-0 end-0 m-4 bg-dark text-white rounded-3 shadow-lg px-4 py-3 d-flex align-items-center gap-3"
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

          <button
            type="button"
            className="btn btn-sm btn-link text-white p-0 ms-2"
            onClick={() =>
              setNotification("")
            }
          >
            <X size={18} />
          </button>
        </div>
      )}

      {/* ==============================
          Delete Modal
      ============================== */}
      {deleteModalCourse && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{
            backgroundColor:
              "rgba(15, 23, 42, 0.65)",
          }}
        >
          <div className="modal-dialog modal-dialog-centered">

            <div className="modal-content border-0 rounded-4 shadow-lg">

              <div className="modal-body p-4 p-md-5 text-center">

                <div
                  className="bg-danger-subtle text-danger rounded-circle d-flex align-items-center justify-content-center mx-auto mb-4"
                  style={{
                    width: "56px",
                    height: "56px",
                  }}
                >
                  <AlertCircle size={26} />
                </div>

                <h4 className="fw-bold mb-3">
                  Delete Course
                </h4>

                <p className="text-secondary small mb-4">

                  Are you sure you want to delete{" "}

                  <strong className="text-dark">
                    "{deleteModalCourse.title}"
                  </strong>

                  ? This action cannot be undone.

                </p>

                <div className="d-flex gap-2 justify-content-center">

                  <button
                    type="button"
                    className="btn btn-light border px-4"
                    onClick={() =>
                      setDeleteModalCourse(null)
                    }
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    className="btn btn-danger px-4"
                    onClick={
                      handleDeleteCourse
                    }
                  >
                    Yes, Delete
                  </button>

                </div>

              </div>

            </div>

          </div>
        </div>
      )}

      {/* ==============================
          Main Content
      ============================== */}
      <main>

        {/* ==============================
            Header
        ============================== */}
        <header className="bg-white border-bottom sticky-top">

          <div className="container-fluid px-4 px-md-5 py-3">

            <div className="d-flex align-items-center justify-content-between">

              <div>

                <div className="text-uppercase text-secondary fw-bold small">
                  Instructor Dashboard
                </div>

                <h1 className="h3 fw-bold mb-0">
                  Manage Courses
                </h1>

              </div>

              <div className="d-flex align-items-center gap-3">

                <button
                  type="button"
                  className="btn btn-light border rounded-3 position-relative"
                  onClick={() =>
                    showToast(
                      "No new notifications"
                    )
                  }
                >
                  <Bell size={19} />

                  <span className="position-absolute top-0 start-100 translate-middle p-1 bg-info border border-white rounded-circle"></span>
                </button>

                <div className="border-start ps-3 d-none d-sm-block">

                  <div
                    className="bg-dark text-info rounded-3 d-flex align-items-center justify-content-center fw-bold"
                    style={{
                      width: "40px",
                      height: "40px",
                    }}
                  >
                    {user?.name
                      ?.slice(0, 2)
                      .toUpperCase() ||
                      "IN"}
                  </div>

                </div>

              </div>

            </div>

          </div>

        </header>

        {/* ==============================
            Body
        ============================== */}
        <div className="container-fluid px-4 px-md-5 py-4">

          {/* Toolbar */}
          <div className="card border-0 shadow-sm rounded-4 mb-4">

            <div className="card-body p-4">

              <div className="row g-3 align-items-center">

                {/* Search */}
                <div className="col-md-5">

                  <div className="input-group">

                    <span className="input-group-text bg-light border-end-0">
                      <Search size={17} />
                    </span>

                    <input
                      type="text"
                      className="form-control bg-light border-start-0"
                      placeholder="Search courses..."
                      value={searchQuery}
                      onChange={(e) =>
                        setSearchQuery(
                          e.target.value
                        )
                      }
                    />

                  </div>

                </div>

                {/* Category */}
                <div className="col-md-4">

                  <select
                    className="form-select bg-light"
                    value={selectedCategory}
                    onChange={(e) =>
                      setSelectedCategory(
                        e.target.value
                      )
                    }
                  >

                    <option value="All">
                      All Categories
                    </option>

                    <option value="Web Development">
                      Web Development
                    </option>

                    <option value="Data Science">
                      Data Science
                    </option>

                    <option value="Mobile Development">
                      Mobile Development
                    </option>

                    <option value="UI/UX Design">
                      UI/UX Design
                    </option>

                    <option value="Cloud Computing">
                      Cloud Computing
                    </option>

                    <option value="Cybersecurity">
                      Cybersecurity
                    </option>

                  </select>

                </div>

                {/* Add Course */}
                <div className="col-md-3">

                  <button
                    type="button"
                    className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2"
                    onClick={() =>
                      navigate(
                        "/add-course"
                      )
                    }
                  >
                    <PlusCircle size={18} />
                    Add New Course
                  </button>

                </div>

              </div>

            </div>

          </div>

          {/* ==============================
              Courses Table
          ============================== */}
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden">

            <div className="card-header bg-white border-bottom py-3 px-4">

              <div className="d-flex justify-content-between align-items-center">

                <div className="fw-bold">
                  My Courses
                </div>

                <span className="badge bg-primary-subtle text-primary">
                  {filteredCourses.length}{" "}
                  Courses
                </span>

              </div>

            </div>

            <div className="table-responsive">

              <table className="table table-hover align-middle mb-0">

                <thead className="table-light">

                  <tr>

                    <th className="px-4 py-3">
                      Course Details
                    </th>

                    <th>Category</th>

                    <th>Price</th>

                    <th>Students</th>

                    <th>Level</th>

                    <th className="text-end px-4">
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {/* Loading */}
                  {loading ? (

                    <tr>

                      <td
                        colSpan="6"
                        className="text-center py-5"
                      >

                        <div
                          className="spinner-border text-primary"
                          role="status"
                        >
                          <span className="visually-hidden">
                            Loading...
                          </span>
                        </div>

                        <div className="small text-secondary mt-2">
                          Loading courses...
                        </div>

                      </td>

                    </tr>

                  ) : filteredCourses.length >
                    0 ? (

                    filteredCourses.map(
                      (course) => (

                        <tr
                          key={course._id}
                        >

                          {/* Course */}
                          <td className="px-4 py-3">

                            <div className="d-flex align-items-center gap-3">

                              <img
                                src={
                                  course.thumbnail ||
                                  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=400"
                                }
                                alt={
                                  course.title
                                }
                                className="rounded-3 object-fit-cover"
                                style={{
                                  width: "70px",
                                  height: "48px",
                                }}
                              />

                              <div>

                                <div className="fw-bold text-dark">
                                  {course.title}
                                </div>

                                <div className="small text-secondary">

                                  {course.description?.slice(
                                    0,
                                    55
                                  )}

                                  {course
                                    .description
                                    ?.length >
                                  55
                                    ? "..."
                                    : ""}

                                </div>

                              </div>

                            </div>

                          </td>

                          {/* Category */}
                          <td>

                            <span className="badge bg-light text-dark border">
                              {course.category}
                            </span>

                          </td>

                          {/* Price */}
                          <td className="fw-bold">

                            $
                            {Number(
                              course.price ||
                                0
                            ).toFixed(2)}

                          </td>

                          {/* Students */}
                          <td>

                            <div className="d-flex align-items-center gap-2">

                              <Users
                                size={16}
                                className="text-primary"
                              />

                              {course.enrolledStudentsCount ||
                                0}

                            </div>

                          </td>

                          {/* Level */}
                          <td>

                            <span className="badge bg-info-subtle text-info-emphasis">
                              {course.level ||
                                "Beginner"}
                            </span>

                          </td>

                          {/* Actions */}
                          <td className="text-end px-4">

                            <div className="d-flex justify-content-end gap-2">

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
                                <Edit3
                                  size={16}
                                />
                              </button>

                              <button
                                type="button"
                                className="btn btn-sm btn-light border text-danger"
                                title="Delete Course"
                                onClick={() =>
                                  setDeleteModalCourse(
                                    course
                                  )
                                }
                              >
                                <Trash2
                                  size={16}
                                />
                              </button>

                            </div>

                          </td>

                        </tr>

                      )
                    )

                  ) : (

                    <tr>

                      <td
                        colSpan="6"
                        className="text-center py-5"
                      >

                        <BookMarked
                          size={45}
                          className="text-secondary opacity-50 mb-3"
                        />

                        <h5 className="fw-bold">
                          No courses found
                        </h5>

                        <p className="text-secondary small mb-3">
                          You haven't created
                          any courses yet.
                        </p>

                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={() =>
                            navigate(
                              "/add-course"
                            )
                          }
                        >
                          <PlusCircle
                            size={17}
                            className="me-2"
                          />
                          Create Your First
                          Course
                        </button>

                      </td>

                    </tr>

                  )}

                </tbody>

              </table>

            </div>

            {/* Footer */}
            <div className="card-footer bg-light border-top px-4 py-3">

              <div className="d-flex justify-content-between align-items-center">

                <small className="text-secondary">

                  Showing{" "}

                  <strong className="text-dark">
                    {filteredCourses.length}
                  </strong>{" "}

                  of{" "}

                  <strong className="text-dark">
                    {courses.length}
                  </strong>{" "}

                  courses

                </small>

                <small className="text-secondary">
                  LearnHub Instructor Portal
                </small>

              </div>

            </div>

          </div>

        </div>

      </main>

      {/* ==============================
          Footer
      ============================== */}
      <footer className="bg-white border-top py-4 text-center">

        <small className="text-secondary">
          © {new Date().getFullYear()} LearnHub
          Instructor Portal. All rights reserved.
        </small>

      </footer>

    </div>
  );
}