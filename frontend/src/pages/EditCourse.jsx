import React, { useEffect, useState } from "react";
import {
  BookOpen,
  PlusCircle,
  Users,
  User,
  Bell,
  ShieldCheck,
  Eye,
  Sparkles,
  Tag,
  FileText,
  Image as ImageIcon,
  Save,
  Send,
  HelpCircle,
  ArrowLeft,
  DollarSign,
  RefreshCw,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import API_URL from "../services/api";

function EditCourse() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();

  const [notification, setNotification] = useState("");
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const [courseData, setCourseData] = useState({
    title: "",
    description: "",
    category: "Web Development",
    price: "",
    instructorName: user?.name || "",
    thumbnail: "",
    level: "Beginner",
  });

  const showToast = (message) => {
    setNotification(message);

    setTimeout(() => {
      setNotification("");
    }, 3500);
  };

  // ==============================
  // GET COURSE
  // ==============================
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);

        const response = await axios.get(
          `${API_URL}/api/courses/${id}`
        );

        const course = response.data.course || response.data;

        setCourseData({
          title: course.title || "",
          description: course.description || "",
          category: course.category || "Web Development",
          price: course.price ?? "",
          instructorName:
            course.instructor?.name || user?.name || "",
          thumbnail: course.thumbnail || "",
          level: course.level || "Beginner",
        });
      } catch (error) {
        console.error("Fetch course error:", error);

        showToast(
          error.response?.data?.message ||
            "Unable to load course."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCourse();
    }
  }, [id, user]);

  // ==============================
  // INPUT CHANGE
  // ==============================
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setCourseData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==============================
  // UPDATE COURSE
  // ==============================
  const handleUpdate = async () => {
    if (!courseData.title.trim()) {
      showToast("Please enter a course title.");
      return;
    }

    if (!courseData.description.trim()) {
      showToast("Please enter a course description.");
      return;
    }

    if (courseData.price === "" || Number(courseData.price) < 0) {
      showToast("Please enter a valid course price.");
      return;
    }

    try {
      setIsUpdating(true);

      const token = localStorage.getItem("token");

      if (!token) {
        showToast("Please login first.");
        navigate("/login");
        return;
      }

      const response = await axios.put(
        `${API_URL}/api/courses/${id}`,
        {
          title: courseData.title,
          description: courseData.description,
          category: courseData.category,
          price: Number(courseData.price),
          thumbnail: courseData.thumbnail,
          level: courseData.level,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Course updated:", response.data);

      showToast("Course successfully updated!");

      setTimeout(() => {
        navigate("/manage-courses");
      }, 1200);
    } catch (error) {
      console.error("Update course error:", error);

      const message =
        error.response?.data?.message ||
        "Unable to update course. Please try again.";

      showToast(message);
    } finally {
      setIsUpdating(false);
    }
  };

  // ==============================
  // CANCEL
  // ==============================
  const handleCancel = () => {
    navigate("/manage-courses");
  };

  // ==============================
  // LOADING
  // ==============================
  if (loading) {
    return (
      <div className="container py-5">
        <div className="d-flex justify-content-center align-items-center py-5">
          <div
            className="spinner-border text-primary"
            role="status"
          >
            <span className="visually-hidden">
              Loading...
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-light">

      {/* Toast */}
      {notification && (
        <div
          className="position-fixed top-0 end-0 m-4 bg-dark text-white px-4 py-3 rounded-3 shadow-lg d-flex align-items-center gap-2"
          style={{ zIndex: 1055 }}
        >
          <ShieldCheck size={20} className="text-info" />
          <span className="small fw-semibold">
            {notification}
          </span>
        </div>
      )}

      {/* Main */}
      <div className="container-fluid py-4">

        <div className="container-xl">

          {/* Header */}
          <div className="bg-white border rounded-4 shadow-sm p-3 p-md-4 mb-4">

            <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">

              <div className="d-flex align-items-center gap-3">

                <button
                  type="button"
                  onClick={handleCancel}
                  className="btn btn-outline-secondary d-flex align-items-center gap-2"
                >
                  <ArrowLeft size={17} />
                  Back
                </button>

                <div>
                  <div className="small fw-bold text-secondary text-uppercase">
                    Course Management
                  </div>

                  <h1 className="h3 fw-bold mb-0">
                    Edit Course
                  </h1>
                </div>

              </div>

              <div className="d-flex align-items-center gap-3">

                <span className="badge bg-success-subtle text-success border border-success-subtle px-3 py-2 rounded-pill">
                  <span className="d-inline-block bg-success rounded-circle me-2"
                    style={{
                      width: "8px",
                      height: "8px",
                    }}
                  />
                  Active
                </span>

                <button
                  type="button"
                  onClick={() =>
                    showToast("No new notifications")
                  }
                  className="btn btn-outline-secondary position-relative"
                >
                  <Bell size={18} />

                  <span
                    className="position-absolute top-0 start-100 translate-middle p-1 bg-info border border-white rounded-circle"
                  />
                </button>

                <div className="border-start ps-3">
                  <div
                    className="bg-dark text-info rounded-3 d-flex align-items-center justify-content-center fw-bold"
                    style={{
                      width: "42px",
                      height: "42px",
                    }}
                  >
                    {user?.name
                      ? user.name
                          .split(" ")
                          .map((word) => word[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()
                      : "IN"}
                  </div>
                </div>

              </div>

            </div>
          </div>

          {/* Content */}
          <div className="row g-4">

            {/* LEFT */}
            <div className="col-lg-8">

              <div className="card border-0 rounded-4 shadow-sm">

                <div className="card-body p-4 p-md-5">

                  {/* Section Header */}
                  <div className="d-flex align-items-center justify-content-between border-bottom pb-4 mb-4">

                    <div>
                      <h2 className="h4 fw-bold mb-2">
                        Course Metadata & Curriculum
                      </h2>

                      <p className="text-secondary small mb-0">
                        Modify your course information,
                        pricing and description.
                      </p>
                    </div>

                    <div className="bg-info-subtle text-info rounded-3 p-3 d-none d-sm-block">
                      <RefreshCw size={24} />
                    </div>

                  </div>

                  {/* Course Title */}
                  <div className="mb-4">

                    <label className="form-label fw-bold d-flex align-items-center gap-2">
                      <FileText
                        size={17}
                        className="text-info"
                      />
                      Course Title
                      <span className="text-danger">*</span>
                    </label>

                    <input
                      type="text"
                      name="title"
                      value={courseData.title}
                      onChange={handleInputChange}
                      className="form-control form-control-lg"
                      placeholder="Enter course title"
                    />

                  </div>

                  {/* Description */}
                  <div className="mb-4">

                    <label className="form-label fw-bold d-flex align-items-center gap-2">
                      <HelpCircle
                        size={17}
                        className="text-info"
                      />
                      Course Description
                      <span className="text-danger">*</span>
                    </label>

                    <textarea
                      name="description"
                      rows="5"
                      value={courseData.description}
                      onChange={handleInputChange}
                      className="form-control"
                      placeholder="Enter course description"
                    />

                  </div>

                  {/* Category + Price */}
                  <div className="row g-4 mb-4">

                    <div className="col-md-6">

                      <label className="form-label fw-bold d-flex align-items-center gap-2">
                        <Tag
                          size={17}
                          className="text-info"
                        />
                        Category
                        <span className="text-danger">*</span>
                      </label>

                      <select
                        name="category"
                        value={courseData.category}
                        onChange={handleInputChange}
                        className="form-select form-select-lg"
                      >
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

                    <div className="col-md-6">

                      <label className="form-label fw-bold d-flex align-items-center gap-2">
                        <DollarSign
                          size={17}
                          className="text-info"
                        />
                        Price (USD)
                        <span className="text-danger">*</span>
                      </label>

                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        name="price"
                        value={courseData.price}
                        onChange={handleInputChange}
                        className="form-control form-control-lg"
                        placeholder="0.00"
                      />

                    </div>

                  </div>

                  {/* Instructor + Level */}
                  <div className="row g-4 mb-4">

                    <div className="col-md-6">

                      <label className="form-label fw-bold d-flex align-items-center gap-2">
                        <User
                          size={17}
                          className="text-info"
                        />
                        Instructor Name
                      </label>

                      <input
                        type="text"
                        name="instructorName"
                        value={courseData.instructorName}
                        onChange={handleInputChange}
                        className="form-control form-control-lg"
                        disabled
                      />

                    </div>

                    <div className="col-md-6">

                      <label className="form-label fw-bold d-flex align-items-center gap-2">
                        <BookOpen
                          size={17}
                          className="text-info"
                        />
                        Course Level
                      </label>

                      <select
                        name="level"
                        value={courseData.level}
                        onChange={handleInputChange}
                        className="form-select form-select-lg"
                      >
                        <option value="Beginner">
                          Beginner
                        </option>
                        <option value="Intermediate">
                          Intermediate
                        </option>
                        <option value="Advanced">
                          Advanced
                        </option>
                        <option value="All Levels">
                          All Levels
                        </option>
                      </select>

                    </div>

                  </div>

                  {/* Thumbnail */}
                  <div className="mb-4">

                    <label className="form-label fw-bold d-flex align-items-center gap-2">
                      <ImageIcon
                        size={17}
                        className="text-info"
                      />
                      Course Thumbnail
                    </label>

                    <div className="bg-light border rounded-4 p-3">

                      <div className="row g-3 align-items-center">

                        <div className="col-sm-auto">

                          {courseData.thumbnail ? (
                            <img
                              src={courseData.thumbnail}
                              alt="Course Thumbnail"
                              className="rounded-3 border"
                              style={{
                                width: "140px",
                                height: "90px",
                                objectFit: "cover",
                              }}
                              onError={(e) => {
                                e.currentTarget.style.display =
                                  "none";
                              }}
                            />
                          ) : (
                            <div
                              className="bg-secondary-subtle rounded-3 d-flex align-items-center justify-content-center text-secondary"
                              style={{
                                width: "140px",
                                height: "90px",
                              }}
                            >
                              <ImageIcon size={28} />
                            </div>
                          )}

                        </div>

                        <div className="col">

                          <div className="small fw-bold mb-2">
                            Thumbnail Image URL
                          </div>

                          <input
                            type="text"
                            name="thumbnail"
                            value={courseData.thumbnail}
                            onChange={handleInputChange}
                            className="form-control"
                            placeholder="Enter image URL..."
                          />

                        </div>

                      </div>

                    </div>

                  </div>

                  {/* Buttons */}
                  <div className="border-top pt-4">

                    <div className="d-flex flex-column flex-sm-row justify-content-between gap-3">

                      <button
                        type="button"
                        onClick={handleCancel}
                        className="btn btn-outline-secondary px-4 py-2 fw-bold"
                      >
                        Cancel
                      </button>

                      <div className="d-flex flex-column flex-sm-row gap-2">

                        <button
                          type="button"
                          onClick={() =>
                            showToast(
                              "Current changes are ready to update."
                            )
                          }
                          className="btn btn-outline-secondary px-4 py-2 fw-bold d-flex align-items-center justify-content-center gap-2"
                        >
                          <Save size={17} />
                          Save Changes
                        </button>

                        <button
                          type="button"
                          onClick={handleUpdate}
                          disabled={isUpdating}
                          className="btn btn-primary px-4 py-2 fw-bold d-flex align-items-center justify-content-center gap-2"
                        >
                          {isUpdating ? (
                            <>
                              <span
                                className="spinner-border spinner-border-sm"
                                role="status"
                              />
                              Updating...
                            </>
                          ) : (
                            <>
                              <Send size={17} />
                              Update Course
                            </>
                          )}
                        </button>

                      </div>

                    </div>

                  </div>

                </div>
              </div>

            </div>

            {/* RIGHT PREVIEW */}
            <div className="col-lg-4">

              <div
                className="sticky-lg-top"
                style={{ top: "90px" }}
              >

                <div className="d-flex align-items-center justify-content-between mb-3">

                  <div className="d-flex align-items-center gap-2">
                    <Eye
                      size={20}
                      className="text-info"
                    />
                    <h3 className="h6 fw-bold mb-0">
                      Updated Card Preview
                    </h3>
                  </div>

                  <span className="badge bg-info-subtle text-info border border-info-subtle">
                    Live Sync
                  </span>

                </div>

                {/* Preview Card */}
                <div className="card border-0 rounded-4 shadow overflow-hidden">

                  <div
                    className="position-relative bg-dark"
                    style={{ height: "210px" }}
                  >

                    {courseData.thumbnail ? (
                      <img
                        src={courseData.thumbnail}
                        alt="Course"
                        className="w-100 h-100"
                        style={{ objectFit: "cover" }}
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800";
                        }}
                      />
                    ) : (
                      <div className="w-100 h-100 d-flex align-items-center justify-content-center text-white">
                        <ImageIcon size={45} />
                      </div>
                    )}

                    <span className="position-absolute top-0 start-0 m-3 badge bg-dark bg-opacity-75 text-info px-3 py-2">
                      {courseData.category ||
                        "Development"}
                    </span>

                  </div>

                  <div className="card-body p-4">

                    <div className="small text-secondary fw-bold text-uppercase mb-2">
                      Instructor:{" "}
                      {courseData.instructorName ||
                        user?.name ||
                        "Instructor"}
                    </div>

                    <h4 className="h5 fw-bold mb-2">
                      {courseData.title ||
                        "Untitled Course"}
                    </h4>

                    <p className="small text-secondary mb-4">
                      {courseData.description ||
                        "Add a course description to preview it here..."}
                    </p>

                    <div className="border-top pt-3 d-flex align-items-center justify-content-between">

                      <div>
                        <div className="small text-secondary text-uppercase fw-bold">
                          Price
                        </div>

                        <div className="h4 fw-bold mb-0">
                          $
                          {courseData.price ||
                            "0.00"}
                        </div>
                      </div>

                      <span className="badge bg-info-subtle text-info border border-info-subtle px-3 py-2">
                        Synced
                      </span>

                    </div>

                  </div>

                </div>

                {/* Info Box */}
                <div className="alert alert-info mt-3 rounded-4 border">

                  <div className="fw-bold d-flex align-items-center gap-2 mb-2">
                    <Sparkles size={17} />
                    Instant Updates
                  </div>

                  <p className="small mb-0">
                    Changes made here will be reflected
                    in the course catalog after the course
                    is updated.
                  </p>

                </div>

                {/* Course Info */}
                <div className="card border-0 shadow-sm rounded-4">

                  <div className="card-body p-4">

                    <h6 className="fw-bold mb-3">
                      Course Information
                    </h6>

                    <div className="d-flex align-items-center gap-3 mb-3">
                      <div className="bg-primary-subtle text-primary rounded-3 p-2">
                        <BookOpen size={18} />
                      </div>
                      <div>
                        <div className="small text-secondary">
                          Course Level
                        </div>
                        <div className="fw-bold">
                          {courseData.level}
                        </div>
                      </div>
                    </div>

                    <div className="d-flex align-items-center gap-3">
                      <div className="bg-success-subtle text-success rounded-3 p-2">
                        <Users size={18} />
                      </div>
                      <div>
                        <div className="small text-secondary">
                          Enrollment
                        </div>
                        <div className="fw-bold">
                          Available
                        </div>
                      </div>
                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

          {/* Footer */}
          <footer className="text-center text-secondary small py-4">
            © {new Date().getFullYear()} LearnHub Inc.
            Instructor Studio. All rights reserved.
          </footer>

        </div>
      </div>
    </div>
  );
}

export default EditCourse;

