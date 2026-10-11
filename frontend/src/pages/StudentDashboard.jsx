import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Clock,
  Award,
  CheckCircle,
  PlayCircle,
  ChevronRight,
  Compass,
  Sparkles,
  ShieldCheck,
  Star,
  GraduationCap,
  ArrowRight,
  Loader2,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { getMyCourses } from "../services/enrollmentService";
import { getCourses } from "../services/courseService";

function StudentDashboard() {
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const [enrollments, setEnrollments] = useState([]);
  const [recommendedCourses, setRecommendedCourses] = useState([]);

  const [loading, setLoading] = useState(true);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [error, setError] = useState("");
  const [notification, setNotification] = useState("");

  const showToast = (message) => {
    setNotification(message);

    setTimeout(() => {
      setNotification("");
    }, 3500);
  };

  // Fetch student's enrolled courses
  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getMyCourses(token);

        setEnrollments(
          data.courses ||
            data.enrollments ||
            []
        );
      } catch (err) {
        console.error(err);

        setError(
          err.response?.data?.message ||
            "Unable to load your learning data."
        );
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchMyCourses();
    } else {
      setLoading(false);
    }
  }, [token]);

  // Fetch courses for recommendations
  useEffect(() => {
    const fetchRecommendedCourses = async () => {
      try {
        setCoursesLoading(true);

        const data = await getCourses();

        // Don't show courses already enrolled in
        const enrolledIds = enrollments
          .map((item) =>
            item.course?._id
          )
          .filter(Boolean);

        const availableCourses = data.filter(
          (course) =>
            !enrolledIds.includes(course._id)
        );

        setRecommendedCourses(
          availableCourses.slice(0, 3)
        );
      } catch (err) {
        console.error(err);
      } finally {
        setCoursesLoading(false);
      }
    };

    fetchRecommendedCourses();
  }, [enrollments]);

  // Statistics
  const totalEnrolled = enrollments.length;

  const completedCourses = enrollments.filter(
    (item) =>
      Number(item.progress || 0) >= 100 ||
      item.status === "Completed"
  ).length;

  const inProgressCourses = enrollments.filter(
    (item) =>
      Number(item.progress || 0) > 0 &&
      Number(item.progress || 0) < 100 &&
      item.status !== "Completed"
  );

  const overallProgress =
    totalEnrolled > 0
      ? Math.round(
          enrollments.reduce(
            (total, item) =>
              total + Number(item.progress || 0),
            0
          ) / totalEnrolled
        )
      : 0;

  // Learning hours are not stored in backend yet.
  const learningHours = 0;

  // For now certificates are based on completed courses.
  const certificates = completedCourses;

  // Pick first active course for Resume Learning
  const latestCourse =
    inProgressCourses.length > 0
      ? inProgressCourses[0]
      : null;

  if (loading) {
    return (
      <div className="container-xl py-5">
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
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100">

      {/* Toast */}
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

      <main className="container-xl py-4 py-md-5">

        {/* Error */}
        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}

        {/* Welcome Banner */}
        <section className="bg-dark text-white rounded-4 shadow-lg overflow-hidden mb-5">

          <div className="p-4 p-md-5">

            <div className="row align-items-center g-4">

              <div className="col-12 col-lg-8">

                <span className="badge bg-info-subtle text-info border border-info-subtle rounded-pill px-3 py-2 mb-3">
                  <Sparkles
                    size={14}
                    className="me-1"
                  />
                  Welcome back,{" "}
                  {user?.name || "Student"}!
                </span>

                <h1 className="display-6 fw-bold lh-sm mb-3">
                  Continue your learning journey
                  and unlock new milestones.
                </h1>

                <p className="text-secondary mb-0">
                  You've completed{" "}
                  <span className="text-info fw-bold">
                    {overallProgress}%
                  </span>{" "}
                  of your enrolled courses. Keep
                  learning and building your skills!
                </p>

              </div>

              <div className="col-12 col-lg-4 text-lg-end">

                {latestCourse ? (
                  <button
                    type="button"
                    className="btn btn-info btn-lg fw-bold d-inline-flex align-items-center gap-2"
                    onClick={() =>
                      navigate(
                        `/courses/${latestCourse.course?._id}`
                      )
                    }
                  >
                    <PlayCircle size={21} />
                    Resume Learning
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn btn-info btn-lg fw-bold d-inline-flex align-items-center gap-2"
                    onClick={() =>
                      navigate("/courses")
                    }
                  >
                    <Compass size={21} />
                    Explore Courses
                  </button>
                )}

              </div>

            </div>

          </div>
        </section>

        {/* Statistics */}
        <section className="mb-5">

          <div className="row g-3">

            {/* Enrolled */}
            <div className="col-6 col-lg-3">
              <div className="card border-0 shadow-sm rounded-4 h-100">
                <div className="card-body p-3 p-md-4">

                  <div
                    className="bg-info-subtle text-info rounded-3 d-flex align-items-center justify-content-center mb-3"
                    style={{
                      width: "50px",
                      height: "50px",
                    }}
                  >
                    <BookOpen size={24} />
                  </div>

                  <h2 className="h3 fw-bold mb-1">
                    {totalEnrolled}
                  </h2>

                  <p className="small text-secondary fw-semibold mb-0">
                    Enrolled Courses
                  </p>

                </div>
              </div>
            </div>

            {/* Completed */}
            <div className="col-6 col-lg-3">
              <div className="card border-0 shadow-sm rounded-4 h-100">
                <div className="card-body p-3 p-md-4">

                  <div
                    className="bg-success-subtle text-success rounded-3 d-flex align-items-center justify-content-center mb-3"
                    style={{
                      width: "50px",
                      height: "50px",
                    }}
                  >
                    <CheckCircle size={24} />
                  </div>

                  <h2 className="h3 fw-bold mb-1">
                    {completedCourses}
                  </h2>

                  <p className="small text-secondary fw-semibold mb-0">
                    Completed Courses
                  </p>

                </div>
              </div>
            </div>

            {/* Learning Hours */}
            <div className="col-6 col-lg-3">
              <div className="card border-0 shadow-sm rounded-4 h-100">
                <div className="card-body p-3 p-md-4">

                  <div
                    className="bg-primary-subtle text-primary rounded-3 d-flex align-items-center justify-content-center mb-3"
                    style={{
                      width: "50px",
                      height: "50px",
                    }}
                  >
                    <Clock size={24} />
                  </div>

                  <h2 className="h3 fw-bold mb-1">
                    {learningHours}h
                  </h2>

                  <p className="small text-secondary fw-semibold mb-0">
                    Learning Hours
                  </p>

                </div>
              </div>
            </div>

            {/* Certificates */}
            <div className="col-6 col-lg-3">
              <div className="card border-0 shadow-sm rounded-4 h-100">
                <div className="card-body p-3 p-md-4">

                  <div
                    className="bg-warning-subtle text-warning rounded-3 d-flex align-items-center justify-content-center mb-3"
                    style={{
                      width: "50px",
                      height: "50px",
                    }}
                  >
                    <Award size={24} />
                  </div>

                  <h2 className="h3 fw-bold mb-1">
                    {certificates}
                  </h2>

                  <p className="small text-secondary fw-semibold mb-0">
                    Certificates
                  </p>

                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Continue Learning */}
        <section className="mb-5">

          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 mb-4">

            <div>
              <h2 className="h3 fw-bold mb-1">
                Continue Learning
              </h2>

              <p className="text-secondary small mb-0">
                Pick up right where you left off.
              </p>
            </div>

            <button
              type="button"
              className="btn btn-link text-info text-decoration-none fw-bold d-flex align-items-center gap-1 p-0"
              onClick={() =>
                navigate("/my-courses")
              }
            >
              View All
              <ChevronRight size={17} />
            </button>

          </div>

          {inProgressCourses.length === 0 ? (

            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body text-center py-5">

                <div
                  className="bg-info-subtle text-info rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                  style={{
                    width: "70px",
                    height: "70px",
                  }}
                >
                  <GraduationCap size={34} />
                </div>

                <h3 className="h5 fw-bold">
                  No Courses in Progress
                </h3>

                <p className="text-secondary small mb-4">
                  Start a course to begin your learning
                  journey.
                </p>

                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() =>
                    navigate("/courses")
                  }
                >
                  Browse Courses
                  <ArrowRight
                    size={17}
                    className="ms-2"
                  />
                </button>

              </div>
            </div>

          ) : (

            <div className="row g-4">

              {inProgressCourses.slice(0, 2).map(
                (enrollment) => {

                  const course =
                    enrollment.course;

                  const progress = Number(
                    enrollment.progress || 0
                  );

                  return (
                    <div
                      className="col-12 col-lg-6"
                      key={enrollment._id}
                    >

                      <div className="card border-0 shadow-sm rounded-4 overflow-hidden h-100">

                        <div className="card-body p-4">

                          {/* Category + Lesson */}
                          <div className="d-flex justify-content-between align-items-center gap-2 mb-3">

                            <span className="badge bg-info-subtle text-info border border-info-subtle rounded-pill">
                              {course?.category ||
                                "Course"}
                            </span>

                            <small className="text-secondary fw-semibold">
                              {progress}% Complete
                            </small>

                          </div>

                          <div className="d-flex gap-3">

                            {/* Thumbnail */}
                            <div
                              className="rounded-3 overflow-hidden bg-dark flex-shrink-0"
                              style={{
                                width: "85px",
                                height: "85px",
                              }}
                            >

                              {course?.thumbnail ? (
                                <img
                                  src={
                                    course.thumbnail
                                  }
                                  alt={
                                    course.title
                                  }
                                  className="w-100 h-100"
                                  style={{
                                    objectFit:
                                      "cover",
                                  }}
                                />
                              ) : (
                                <div className="w-100 h-100 d-flex align-items-center justify-content-center">
                                  <BookOpen
                                    size={35}
                                    className="text-info"
                                  />
                                </div>
                              )}

                            </div>

                            {/* Course info */}
                            <div className="flex-grow-1">

                              <h3 className="h5 fw-bold mb-2">
                                {course?.title ||
                                  "Course"}
                              </h3>

                              <p className="small text-secondary mb-0">
                                {course
                                  ?.instructor
                                  ?.name
                                  ? `Instructor: ${course.instructor.name}`
                                  : "LearnHub Course"}
                              </p>

                            </div>

                          </div>

                          {/* Progress */}
                          <div className="mt-4">

                            <div className="d-flex justify-content-between mb-2">

                              <small className="fw-bold">
                                Course Progress
                              </small>

                              <small className="fw-bold text-info">
                                {progress}%
                              </small>

                            </div>

                            <div
                              className="progress"
                              style={{
                                height: "9px",
                              }}
                            >
                              <div
                                className="progress-bar bg-info"
                                role="progressbar"
                                style={{
                                  width: `${progress}%`,
                                }}
                              ></div>
                            </div>

                          </div>

                        </div>

                        {/* Footer */}
                        <div className="card-footer bg-light border-top p-3">

                          <button
                            type="button"
                            className="btn btn-dark w-100 d-flex align-items-center justify-content-center gap-2"
                            onClick={() =>
                              navigate(
                                `/courses/${course?._id}`
                              )
                            }
                          >
                            <PlayCircle
                              size={17}
                            />
                            Continue Course
                          </button>

                        </div>

                      </div>

                    </div>
                  );
                }
              )}

            </div>
          )}

        </section>

        {/* Completed Courses */}
        {completedCourses > 0 && (
          <section className="mb-5">

            <div className="card border-0 shadow-sm rounded-4">

              <div className="card-body p-4">

                <div className="d-flex align-items-center justify-content-between">

                  <div className="d-flex align-items-center gap-3">

                    <div
                      className="bg-success-subtle text-success rounded-circle d-flex align-items-center justify-content-center"
                      style={{
                        width: "48px",
                        height: "48px",
                      }}
                    >
                      <Award size={24} />
                    </div>

                    <div>
                      <h3 className="h5 fw-bold mb-1">
                        Congratulations! 🎉
                      </h3>

                      <p className="small text-secondary mb-0">
                        You have completed{" "}
                        {completedCourses} course
                        {completedCourses > 1
                          ? "s"
                          : ""}.
                      </p>
                    </div>

                  </div>

                  <span className="badge bg-success-subtle text-success px-3 py-2">
                    {completedCourses} Completed
                  </span>

                </div>

              </div>
            </div>

          </section>
        )}

        {/* Recommended Courses */}
        <section className="mb-5">

          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 mb-4">

            <div>
              <h2 className="h3 fw-bold mb-1">
                Recommended Courses
              </h2>

              <p className="text-secondary small mb-0">
                Explore more courses to expand your
                skills.
              </p>
            </div>

            <button
              type="button"
              className="btn btn-link text-info text-decoration-none fw-bold d-flex align-items-center gap-1 p-0"
              onClick={() =>
                navigate("/courses")
              }
            >
              Explore More
              <ChevronRight size={17} />
            </button>

          </div>

          {coursesLoading ? (

            <div className="text-center py-4">
              <Loader2
                size={28}
                className="text-primary spinner-border"
              />
            </div>

          ) : recommendedCourses.length === 0 ? (

            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body text-center py-5">

                <BookOpen
                  size={40}
                  className="text-secondary mb-3"
                />

                <h3 className="h5 fw-bold">
                  No Recommendations Available
                </h3>

                <p className="text-secondary small mb-3">
                  Check the course catalog for more
                  learning opportunities.
                </p>

                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() =>
                    navigate("/courses")
                  }
                >
                  Browse All Courses
                </button>

              </div>
            </div>

          ) : (

            <div className="row g-4">

              {recommendedCourses.map(
                (course) => (
                  <div
                    className="col-12 col-md-6 col-lg-4"
                    key={course._id}
                  >

                    <div className="card border-0 shadow-sm rounded-4 overflow-hidden h-100">

                      {/* Thumbnail */}
                      <div
                        className="bg-dark"
                        style={{
                          height: "190px",
                        }}
                      >

                        {course.thumbnail ? (
                          <img
                            src={course.thumbnail}
                            alt={course.title}
                            className="w-100 h-100"
                            style={{
                              objectFit:
                                "cover",
                            }}
                          />
                        ) : (
                          <div className="w-100 h-100 d-flex align-items-center justify-content-center">
                            <BookOpen
                              size={60}
                              className="text-info opacity-50"
                            />
                          </div>
                        )}

                      </div>

                      {/* Content */}
                      <div className="card-body p-4">

                        {course.category && (
                          <span className="badge bg-info-subtle text-info mb-2">
                            {course.category}
                          </span>
                        )}

                        <h3 className="h5 fw-bold mb-2">
                          {course.title}
                        </h3>

                        <p className="small text-secondary mb-3">
                          {course.description
                            ? course.description.length >
                              90
                              ? `${course.description.slice(
                                  0,
                                  90
                                )}...`
                              : course.description
                            : "Explore this course and build new professional skills."}
                        </p>

                        {/* Rating */}
                        <div className="d-flex align-items-center gap-2 mb-3">

                          <span className="text-warning fw-bold">
                            <Star
                              size={15}
                              fill="currentColor"
                              className="me-1"
                            />
                            {course.averageRating ||
                              "New"}
                          </span>

                          <span className="small text-secondary">
                            {course.enrolledStudentsCount ||
                              0}{" "}
                            students
                          </span>

                        </div>

                        <div className="d-flex align-items-center justify-content-between">

                          <span className="h5 fw-bold mb-0">
                            $
                            {Number(
                              course.price || 0
                            ).toFixed(2)}
                          </span>

                          <button
                            type="button"
                            className="btn btn-primary btn-sm d-flex align-items-center gap-1"
                            onClick={() =>
                              navigate(
                                `/courses/${course._id}`
                              )
                            }
                          >
                            View Course
                            <ArrowRight
                              size={15}
                            />
                          </button>

                        </div>

                      </div>

                    </div>

                  </div>
                )
              )}

            </div>
          )}

        </section>

      </main>

      {/* Footer */}
      <footer className="bg-dark text-white py-4 mt-4">

        <div className="container-xl">

          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">

            <div className="d-flex align-items-center gap-2">

              <div
                className="bg-info text-dark rounded-2 d-flex align-items-center justify-content-center fw-bold"
                style={{
                  width: "32px",
                  height: "32px",
                }}
              >
                L
              </div>

              <span className="fw-bold">
                Learn
                <span className="text-info">
                  Hub
                </span>
              </span>

            </div>

            <small className="text-secondary">
              © {new Date().getFullYear()} LearnHub.
              All rights reserved.
            </small>

            <div className="d-flex gap-3 small text-secondary">
              <span>Help Center</span>
              <span>Privacy</span>
              <span>Terms</span>
            </div>

          </div>

        </div>

      </footer>

    </div>
  );
}

export default StudentDashboard;

