import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { createLesson } from "../services/lessonService";

function AddLesson() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { token } = useAuth();

  const courseId = searchParams.get("courseId");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    videoUrl: "",
    duration: "",
    order: 1,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!courseId) {
      setError("Course ID is missing.");
      return;
    }

    if (!formData.title.trim()) {
      setError("Lesson title is required.");
      return;
    }

    try {
      setLoading(true);

      const lessonData = {
        course: courseId,
        title: formData.title,
        description: formData.description,
        videoUrl: formData.videoUrl,
        duration: Number(formData.duration) || 0,
        order: Number(formData.order) || 1,
      };

      await createLesson(lessonData, token);

      setMessage("Lesson created successfully!");

      setTimeout(() => {
        navigate(`/manage-lessons?courseId=${courseId}`);
      }, 1000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to create lesson."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4 p-md-5">
              <div className="mb-4">
                <h2 className="fw-bold mb-2">
                  Add New Lesson
                </h2>

                <p className="text-muted mb-0">
                  Add a lesson to your course with video
                  information and lesson details.
                </p>
              </div>

              {message && (
                <div
                  className="alert alert-success"
                  role="alert"
                >
                  {message}
                </div>
              )}

              {error && (
                <div
                  className="alert alert-danger"
                  role="alert"
                >
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* Lesson Title */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Lesson Title
                  </label>

                  <input
                    type="text"
                    name="title"
                    className="form-control"
                    placeholder="e.g. Introduction to React"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Description */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Description
                  </label>

                  <textarea
                    name="description"
                    className="form-control"
                    rows="4"
                    placeholder="Enter lesson description..."
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>

                {/* Video URL */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Video URL
                  </label>

                  <input
                    type="url"
                    name="videoUrl"
                    className="form-control"
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={formData.videoUrl}
                    onChange={handleChange}
                  />

                  <div className="form-text">
                    Add YouTube, Vimeo, or another video URL.
                  </div>
                </div>

                <div className="row">
                  {/* Duration */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">
                      Duration (Minutes)
                    </label>

                    <input
                      type="number"
                      name="duration"
                      className="form-control"
                      min="0"
                      placeholder="30"
                      value={formData.duration}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Order */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">
                      Lesson Order
                    </label>

                    <input
                      type="number"
                      name="order"
                      className="form-control"
                      min="1"
                      value={formData.order}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Course ID */}
                <div className="mb-4">
                  <label className="form-label fw-semibold">
                    Course ID
                  </label>

                  <input
                    type="text"
                    className="form-control bg-light"
                    value={courseId || ""}
                    readOnly
                  />
                </div>

                {/* Buttons */}
                <div className="d-flex gap-2">
                  <button
                    type="submit"
                    className="btn btn-primary px-4"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                        ></span>
                        Creating...
                      </>
                    ) : (
                      "Create Lesson"
                    )}
                  </button>

                  <button
                    type="button"
                    className="btn btn-outline-secondary px-4"
                    onClick={() =>
                      navigate(
                        `/manage-lessons?courseId=${courseId}`
                      )
                    }
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddLesson;