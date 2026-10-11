import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Play,
  ArrowRight,
  GraduationCap,
  Loader2,
  AlertCircle,
} from "lucide-react";

import {
  getMyCourses,
  updateProgress,
} from "../services/enrollmentService";

import { useAuth } from "../context/AuthContext";

function MyCourses() {
  const navigate = useNavigate();
  const { token, user } = useAuth();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getMyCourses(token);

        setCourses(
          data.enrollments ||
            data.courses ||
            data ||
            []
        );
      } catch (err) {
        console.error(err);

        setError(
          err.response?.data?.message ||
            "Unable to load your courses."
        );
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchMyCourses();
    } else {
      setLoading(false);
      setError("Please login to view your courses.");
    }
  }, [token]);

  const handleProgressUpdate = async (
    enrollmentId,
    newProgress
  ) => {
    try {
      setUpdatingId(enrollmentId);
      setError("");

      const data = await updateProgress(
        enrollmentId,
        Number(newProgress),
        token
      );

      const updatedEnrollment =
        data.enrollment || data;

      setCourses((prevCourses) =>
        prevCourses.map((item) =>
          item._id === enrollmentId
            ? {
                ...item,
                ...updatedEnrollment,
                progress: Number(newProgress),
                status:
                  Number(newProgress) === 100
                    ? "Completed"
                    : "In Progress",
              }
            : item
        )
      );
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Unable to update course progress."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="container py-5">
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
            Loading your courses...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container py-5">
        <div className="alert alert-warning">
          Please login to view your courses.
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={() => navigate("/login")}
        >
          Login
        </button>
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100">

      <main className="container-xl py-4 py-md-5">

        {/* Page Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">

          <div>
            <span className="small fw-bold text-info text-uppercase">
              Learning Center
            </span>

            <h1 className="fw-bold text-dark mb-1">
              My Courses
            </h1>

            <p className="text-secondary mb-0">
              Continue learning and track your progress.
            </p>
          </div>

          <button
            type="button"
            className="btn btn-primary d-flex align-items-center gap-2 align-self-start"
            onClick={() => navigate("/courses")}
          >
            <BookOpen size={18} />
            Browse Courses
          </button>

        </div>

        {/* Error */}
        {error && (
          <div
            className="alert alert-danger d-flex align-items-center gap-2"
            role="alert"
          >
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {/* No Courses */}
        {!error && courses.length === 0 && (
          <div className="card border-0 shadow-sm rounded-4">

            <div className="card-body text-center py-5">

              <div
                className="bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center mx-auto mb-4"
                style={{
                  width: "75px",
                  height: "75px",
                }}
              >
                <GraduationCap size={35} />
              </div>

              <h3 className="h4 fw-bold">
                No Courses Yet
              </h3>

              <p className="text-secondary mb-4">
                You have not enrolled in any courses yet.
              </p>

              <button
                type="button"
                className="btn btn-primary px-4"
                onClick={() => navigate("/courses")}
              >
                Explore Courses
                <ArrowRight
                  size={17}
                  className="ms-2"
                />
              </button>

            </div>
          </div>
        )}

        {/* Course Cards */}
        <div className="row g-4">

          {courses.map((enrollment) => {

            const course =
              enrollment.course || enrollment;

            const progress = Number(
              enrollment.progress || 0
            );

            const isCompleted =
              progress >= 100 ||
              enrollment.status === "Completed";

            return (
              <div
                className="col-12 col-md-6 col-xl-4"
                key={enrollment._id}
              >

                <div className="card border-0 shadow-sm rounded-4 overflow-hidden h-100">

                  {/* Thumbnail */}
                  <div
                    className="position-relative bg-dark"
                    style={{ height: "190px" }}
                  >

                    {course.thumbnail ? (
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-100 h-100"
                        style={{
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <div className="w-100 h-100 d-flex align-items-center justify-content-center">
                        <BookOpen
                          size={65}
                          className="text-info opacity-50"
                        />
                      </div>
                    )}

                    {/* Status */}
                    <div className="position-absolute top-0 end-0 m-3">

                      {isCompleted ? (
                        <span className="badge bg-success d-flex align-items-center gap-1">
                          <CheckCircle2 size={14} />
                          Completed
                        </span>
                      ) : (
                        <span className="badge bg-dark bg-opacity-75">
                          In Progress
                        </span>
                      )}

                    </div>

                  </div>

                  {/* Card Body */}
                  <div className="card-body p-4 d-flex flex-column">

                    {/* Category */}
                    {course.category && (
                      <span className="badge bg-primary-subtle text-primary align-self-start mb-2">
                        {course.category}
                      </span>
                    )}

                    {/* Title */}
                    <h3 className="h5 fw-bold text-dark mb-2">
                      {course.title ||
                        "Untitled Course"}
                    </h3>

                    {/* Description */}
                    <p className="small text-secondary mb-4">
                      {course.description
                        ? course.description.length > 100
                          ? `${course.description.slice(
                              0,
                              100
                            )}...`
                          : course.description
                        : "Continue your learning journey with this course."}
                    </p>

                    {/* Progress */}
                    <div className="mb-3">

                      <div className="d-flex justify-content-between align-items-center mb-2">

                        <small className="fw-bold text-dark">
                          Progress
                        </small>

                        <small
                          className={
                            isCompleted
                              ? "fw-bold text-success"
                              : "fw-bold text-primary"
                          }
                        >
                          {progress}%
                        </small>

                      </div>

                      <div
                        className="progress"
                        style={{ height: "8px" }}
                      >
                        <div
                          className={`progress-bar ${
                            isCompleted
                              ? "bg-success"
                              : "bg-primary"
                          }`}
                          role="progressbar"
                          style={{
                            width: `${progress}%`,
                          }}
                        ></div>
                      </div>

                    </div>

                    {/* Progress Controls */}
                    {!isCompleted && (
                      <div className="mb-4">

                        <label className="form-label small fw-semibold text-secondary">
                          Update Progress
                        </label>

                        <select
                          className="form-select form-select-sm"
                          value={progress}
                          disabled={
                            updatingId ===
                            enrollment._id
                          }
                          onChange={(e) =>
                            handleProgressUpdate(
                              enrollment._id,
                              e.target.value
                            )
                          }
                        >
                          <option value="0">
                            0%
                          </option>
                          <option value="25">
                            25%
                          </option>
                          <option value="50">
                            50%
                          </option>
                          <option value="75">
                            75%
                          </option>
                          <option value="100">
                            100% - Complete
                          </option>
                        </select>

                        {updatingId ===
                          enrollment._id && (
                          <small className="text-primary d-flex align-items-center gap-1 mt-2">
                            <Loader2
                              size={14}
                              className="spinner-border"
                            />
                            Updating progress...
                          </small>
                        )}

                      </div>
                    )}

                    {/* Completed Message */}
                    {isCompleted && (
                      <div className="alert alert-success py-2 small d-flex align-items-center gap-2 mb-4">
                        <CheckCircle2 size={17} />
                        Course completed successfully!
                      </div>
                    )}

                    {/* Bottom */}
                    <div className="mt-auto d-flex gap-2">

                      <button
                        type="button"
                        className="btn btn-primary flex-grow-1 d-flex align-items-center justify-content-center gap-2"
                        onClick={() =>
                          navigate(
                            `/courses/${course._id}`
                          )
                        }
                      >
                        <Play size={16} />
                        Continue
                      </button>

                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() =>
                          navigate(
                            `/courses/${course._id}`
                          )
                        }
                      >
                        <ArrowRight size={17} />
                      </button>

                    </div>

                  </div>
                </div>

              </div>
            );
          })}

        </div>

      </main>
    </div>
  );
}

export default MyCourses;