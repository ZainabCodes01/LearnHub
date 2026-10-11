import React, { useState } from "react";
import {
  BookOpen,
  Bell,
  DollarSign,
  ShieldCheck,
  UploadCloud,
  Eye,
  Sparkles,
  Tag,
  FileText,
  Image as ImageIcon,
  Save,
  Send,
  HelpCircle,
  CheckCircle2,
  User,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

function AddCourse() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [notification, setNotification] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setCourseData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (status) => {
    if (!courseData.title.trim()) {
      showToast("Please enter a course title.");
      return;
    }

    if (!courseData.description.trim()) {
      showToast("Please enter a course description.");
      return;
    }

    if (!courseData.price || Number(courseData.price) < 0) {
      showToast("Please enter a valid course price.");
      return;
    }

    try {
      setIsSubmitting(true);

      const token = localStorage.getItem("token");

      if (!token) {
        showToast("Please login first.");
        navigate("/login");
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/api/courses",
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

      console.log("Course created:", response.data);

      if (status === "published") {
        showToast("Course successfully published!");
      } else {
        showToast("Course successfully saved!");
      }

      setTimeout(() => {
        navigate("/manage-courses");
      }, 1200);
    } catch (error) {
      console.error("Create course error:", error);

      const message =
        error.response?.data?.message ||
        "Unable to create course. Please try again.";

      showToast(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-vh-100 bg-light d-flex flex-column">
      {/* Notification */}
      {notification && (
        <div
          className="position-fixed top-0 end-0 m-4 alert alert-dark shadow-lg d-flex align-items-center gap-2"
          style={{ zIndex: 1055 }}
        >
          <ShieldCheck size={20} className="text-info" />
          <span>{notification}</span>
        </div>
      )}

      {/* Main Area */}
      <div className="flex-grow-1 d-flex flex-column">
        {/* Header */}
        <header className="bg-white border-bottom sticky-top">
          <div className="container-fluid px-4 py-3">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <h1 className="h4 fw-bold mb-0">
                  Create New Course
                </h1>

                <small className="text-muted">
                  Instructor Studio
                </small>
              </div>

              <div className="d-flex align-items-center gap-3">
                <button
                  type="button"
                  className="btn btn-light border position-relative"
                  onClick={() =>
                    showToast("No new notifications")
                  }
                >
                  <Bell size={19} />

                  <span className="position-absolute top-0 start-100 translate-middle p-1 bg-info border border-white rounded-circle"></span>
                </button>

                <div className="d-none d-sm-flex align-items-center gap-2 border-start ps-3">
                  <div
                    className="rounded-3 bg-dark text-info d-flex align-items-center justify-content-center fw-bold"
                    style={{ width: "40px", height: "40px" }}
                  >
                    {user?.name?.charAt(0)?.toUpperCase() || "I"}
                  </div>

                  <span className="fw-semibold">
                    {user?.name || "Instructor"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-grow-1 p-4 p-md-5">
          <div className="container-fluid">
            <div className="row g-4">
              {/* FORM */}
              <div className="col-lg-8">
                <div className="card border-0 shadow-sm rounded-4">
                  <div className="card-body p-4 p-md-5">
                    {/* Heading */}
                    <div className="d-flex align-items-center justify-content-between border-bottom pb-4 mb-4">
                      <div>
                        <h2 className="h4 fw-bold mb-2">
                          Course Information
                        </h2>

                        <p className="text-muted mb-0">
                          Provide the core details of your new course.
                        </p>
                      </div>

                      <div className="d-none d-sm-flex bg-info bg-opacity-10 text-info rounded-3 p-3">
                        <Sparkles size={24} />
                      </div>
                    </div>

                    {/* Title */}
                    <div className="mb-4">
                      <label className="form-label fw-bold">
                        <FileText
                          size={16}
                          className="text-info me-2"
                        />
                        Course Title{" "}
                        <span className="text-danger">*</span>
                      </label>

                      <input
                        type="text"
                        name="title"
                        value={courseData.title}
                        onChange={handleInputChange}
                        className="form-control form-control-lg"
                        placeholder="e.g. Full Stack Web Development with MERN"
                      />
                    </div>

                    {/* Description */}
                    <div className="mb-4">
                      <label className="form-label fw-bold">
                        <HelpCircle
                          size={16}
                          className="text-info me-2"
                        />
                        Course Description{" "}
                        <span className="text-danger">*</span>
                      </label>

                      <textarea
                        name="description"
                        rows="5"
                        value={courseData.description}
                        onChange={handleInputChange}
                        className="form-control"
                        placeholder="Write a clear overview of what students will learn..."
                      />
                    </div>

                    {/* Category + Price */}
                    <div className="row g-4 mb-4">
                      <div className="col-md-6">
                        <label className="form-label fw-bold">
                          <Tag
                            size={16}
                            className="text-info me-2"
                          />
                          Category{" "}
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
                        <label className="form-label fw-bold">
                          <DollarSign
                            size={16}
                            className="text-info me-2"
                          />
                          Price (USD){" "}
                          <span className="text-danger">*</span>
                        </label>

                        <div className="input-group input-group-lg">
                          <span className="input-group-text">
                            $
                          </span>

                          <input
                            type="number"
                            name="price"
                            value={courseData.price}
                            onChange={handleInputChange}
                            min="0"
                            step="0.01"
                            className="form-control"
                            placeholder="89.99"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Level */}
                    <div className="mb-4">
                      <label className="form-label fw-bold">
                        <BookOpen
                          size={16}
                          className="text-info me-2"
                        />
                        Skill Level
                      </label>

                      <select
                        name="level"
                        value={courseData.level}
                        onChange={handleInputChange}
                        className="form-select"
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

                    {/* Instructor */}
                    <div className="mb-4">
                      <label className="form-label fw-bold">
                        <User
                          size={16}
                          className="text-info me-2"
                        />
                        Instructor Name
                      </label>

                      <input
                        type="text"
                        name="instructorName"
                        value={courseData.instructorName}
                        readOnly
                        className="form-control"
                      />

                      <div className="form-text">
                        Your logged-in instructor account will be
                        automatically assigned to this course.
                      </div>
                    </div>

                    {/* Thumbnail */}
                    <div className="mb-4">
                      <label className="form-label fw-bold">
                        <ImageIcon
                          size={16}
                          className="text-info me-2"
                        />
                        Course Thumbnail URL
                      </label>

                      <div className="border border-2 border-dashed rounded-4 p-4 text-center bg-light">
                        <div className="bg-info bg-opacity-10 text-info rounded-3 d-inline-flex p-3 mb-3">
                          <UploadCloud size={26} />
                        </div>

                        <p className="fw-bold mb-1">
                          Enter your course image URL
                        </p>

                        <small className="text-muted">
                          PNG, JPG or WEBP recommended
                        </small>
                      </div>

                      <input
                        type="url"
                        name="thumbnail"
                        value={courseData.thumbnail}
                        onChange={handleInputChange}
                        className="form-control mt-3"
                        placeholder="https://example.com/course-image.jpg"
                      />
                    </div>

                    {/* Buttons */}
                    <div className="border-top pt-4 d-flex flex-column flex-sm-row justify-content-end gap-2">
                      <button
                        type="button"
                        className="btn btn-outline-secondary btn-lg"
                        disabled={isSubmitting}
                        onClick={() => handleSubmit("draft")}
                      >
                        <Save size={17} className="me-2" />
                        Save Draft
                      </button>

                      <button
                        type="button"
                        className="btn btn-info text-white btn-lg"
                        disabled={isSubmitting}
                        onClick={() => handleSubmit("published")}
                      >
                        {isSubmitting ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm me-2"
                              role="status"
                            ></span>
                            Publishing...
                          </>
                        ) : (
                          <>
                            <Send size={17} className="me-2" />
                            Publish Course
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* PREVIEW */}
              <div className="col-lg-4">
                <div
                  className="sticky-lg-top"
                  style={{ top: "90px" }}
                >
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <h5 className="fw-bold mb-0 d-flex align-items-center gap-2">
                      <Eye size={20} className="text-info" />
                      Live Preview
                    </h5>

                    <span className="badge bg-success-subtle text-success border border-success-subtle">
                      Realtime
                    </span>
                  </div>

                  {/* Course Card */}
                  <div className="card border-0 shadow rounded-4 overflow-hidden">
                    <div className="position-relative">
                      <img
                        src={
                          courseData.thumbnail ||
                          "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=800"
                        }
                        alt="Course Preview"
                        className="card-img-top object-fit-cover"
                        style={{ height: "210px" }}
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800";
                        }}
                      />

                      <span className="position-absolute top-0 start-0 m-3 badge bg-dark">
                        {courseData.category}
                      </span>

                      <span className="position-absolute bottom-0 end-0 m-3 badge bg-light text-dark">
                        {courseData.level}
                      </span>
                    </div>

                    <div className="card-body p-4">
                      <small className="text-muted fw-semibold">
                        Instructor:{" "}
                        {courseData.instructorName || "Instructor"}
                      </small>

                      <h4 className="fw-bold mt-2">
                        {courseData.title || "Untitled Course"}
                      </h4>

                      <p className="text-muted small">
                        {courseData.description ||
                          "Your course description will appear here."}
                      </p>

                      <div className="border-top pt-3 mt-3 d-flex align-items-center justify-content-between">
                        <div>
                          <small className="text-muted d-block">
                            PRICE
                          </small>

                          <span className="fs-4 fw-bold">
                            $
                            {courseData.price
                              ? Number(courseData.price).toFixed(2)
                              : "0.00"}
                          </span>
                        </div>

                        <span className="badge bg-info-subtle text-info">
                          Preview
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Guidelines */}
                  <div className="alert alert-info mt-4 border-0">
                    <div className="fw-bold mb-2 d-flex align-items-center gap-2">
                      <Sparkles size={17} />
                      Publishing Guidelines
                    </div>

                    <small>
                      Use a high-quality thumbnail and provide a
                      clear description of the course content,
                      prerequisites and learning outcomes.
                    </small>
                  </div>

                  {/* Checklist */}
                  <div className="card border-0 shadow-sm rounded-4">
                    <div className="card-body">
                      <h6 className="fw-bold mb-3">
                        Course Checklist
                      </h6>

                      <div className="d-flex align-items-center gap-2 mb-2">
                        <CheckCircle2
                          size={17}
                          className={
                            courseData.title
                              ? "text-success"
                              : "text-secondary"
                          }
                        />
                        <small>Course title</small>
                      </div>

                      <div className="d-flex align-items-center gap-2 mb-2">
                        <CheckCircle2
                          size={17}
                          className={
                            courseData.description
                              ? "text-success"
                              : "text-secondary"
                          }
                        />
                        <small>Description</small>
                      </div>

                      <div className="d-flex align-items-center gap-2">
                        <CheckCircle2
                          size={17}
                          className={
                            courseData.price
                              ? "text-success"
                              : "text-secondary"
                          }
                        />
                        <small>Course price</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-top py-3 text-center">
          <small className="text-muted">
            © {new Date().getFullYear()} LearnHub Instructor
            Studio. All rights reserved.
          </small>
        </footer>
      </div>
    </div>
  );
}

export default AddCourse;
