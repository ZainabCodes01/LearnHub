import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  getCourseLessons,
  deleteLesson,
} from "../services/lessonService";
import { getCourseById } from "../services/courseService";

function ManageLessons() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { token } = useAuth();

  const courseId = searchParams.get("courseId");

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!courseId) {
      setError("Course ID is missing.");
      setLoading(false);
      return;
    }

    fetchData();
  }, [courseId, token]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [courseData, lessonsData] = await Promise.all([
        getCourseById(courseId),
        getCourseLessons(courseId, token),
      ]);

      setCourse(courseData.course || courseData);
      setLessons(
        lessonsData.lessons || lessonsData.courses || []
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Failed to load lessons."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (lessonId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this lesson?"
    );

    if (!confirmDelete) return;

    try {
      await deleteLesson(lessonId, token);

      setLessons((prevLessons) =>
        prevLessons.filter(
          (lesson) => lesson._id !== lessonId
        )
      );
    } catch (err) {
      alert(
        err.response?.data?.message ||
        "Failed to delete lesson."
      );
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div
          className="spinner-border text-primary"
          role="status"
        >
          <span className="visually-hidden">
            Loading...
          </span>
        </div>

        <p className="text-muted mt-3">
          Loading lessons...
        </p>
      </div>
    );
  }

  return (
    <div className="container py-5">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold mb-1">
            Manage Lessons
          </h2>

          <p className="text-muted mb-0">
            {course?.title || "Course"}
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() =>
            navigate(
              `/add-lesson?courseId=${courseId}`
            )
          }
        >
          + Add New Lesson
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      {/* No Lessons */}
      {!error && lessons.length === 0 && (
        <div className="card border-0 shadow-sm">
          <div className="card-body text-center py-5">
            <h5 className="fw-bold">
              No lessons yet
            </h5>

            <p className="text-muted">
              Start adding lessons to this course.
            </p>

            <button
              className="btn btn-primary"
              onClick={() =>
                navigate(
                  `/add-lesson?courseId=${courseId}`
                )
              }
            >
              Add First Lesson
            </button>
          </div>
        </div>
      )}

      {/* Lessons */}
      {lessons.length > 0 && (
        <div className="row g-4">
          {lessons.map((lesson, index) => (
            <div
              className="col-12"
              key={lesson._id}
            >
              <div className="card border-0 shadow-sm">
                <div className="card-body p-4">
                  <div className="row align-items-center">
                    {/* Lesson Number */}
                    <div className="col-md-1 text-center mb-3 mb-md-0">
                      <div className="rounded-circle bg-primary text-white d-inline-flex align-items-center justify-content-center fw-bold"
                        style={{
                          width: "45px",
                          height: "45px",
                        }}
                      >
                        {lesson.order || index + 1}
                      </div>
                    </div>

                    {/* Lesson Details */}
                    <div className="col-md-7 mb-3 mb-md-0">
                      <h5 className="fw-bold mb-2">
                        {lesson.title}
                      </h5>

                      {lesson.description && (
                        <p className="text-muted mb-2">
                          {lesson.description}
                        </p>
                      )}

                      <div className="d-flex flex-wrap gap-3 small text-muted">
                        <span>
                          ⏱ {lesson.duration || 0} minutes
                        </span>

                        {lesson.videoUrl && (
                          <span>
                            🎥 Video available
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="col-md-4 text-md-end">
                      <div className="d-flex justify-content-md-end gap-2 flex-wrap">
                        {lesson.videoUrl && (
                          <a
                            href={lesson.videoUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-outline-primary btn-sm"
                          >
                            View Video
                          </a>
                        )}

                        <button
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() =>
                            navigate(
                              `/edit-lesson/${lesson._id}?courseId=${courseId}`
                            )
                          }
                        >
                          Edit
                        </button>

                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() =>
                            handleDelete(lesson._id)
                          }
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Back */}
      <div className="mt-4">
        <button
          className="btn btn-link text-decoration-none px-0"
          onClick={() => navigate("/manage-courses")}
        >
          ← Back to Manage Courses
        </button>
      </div>
    </div>
  );
}

export default ManageLessons;