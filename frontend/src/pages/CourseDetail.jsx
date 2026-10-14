import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Users,
  Award,
  GraduationCap,
  Star,
  ChevronRight,
  ChevronDown,
  Play,
  CheckCircle2,
  ShieldCheck,
  Laptop,
  Clock,
  Globe,
  FileText,
  Smartphone,
  Tv,
  Check,
  Share2,
  Bookmark,
  ArrowLeft,
  BookOpen,
  DollarSign,
  Loader2,
} from "lucide-react";

import { getCourseById } from "../services/courseService";
import { enrollCourse } from "../services/enrollmentService";
import { getCourseLessons } from "../services/lessonService";
import { useAuth } from "../context/AuthContext";

function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { user, token, isAuthenticated } = useAuth();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lessons, setLessons] = useState([]);
  const [lessonsLoading, setLessonsLoading] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  const [expandedModules, setExpandedModules] = useState({
    0: true,
    1: false,
    2: false,
    3: false,
  });

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getCourseById(id);

        setCourse(data.course || data);
      } catch (err) {
        console.error(err);

        setError(
          err.response?.data?.message ||
          "Unable to load course details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        setLessonsLoading(true);

        const data = await getCourseLessons(id, token);

        setLessons(data.lessons || []);
      } catch (err) {
        console.error("Failed to load lessons:", err);
        setLessons([]);
      } finally {
        setLessonsLoading(false);
      }
    };

    if (id) {
      fetchLessons();
    }
  }, [id, token]);

  const toggleModule = (index) => {
    setExpandedModules((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const expandAllModules = () => {
    setExpandedModules({
      0: true,
      1: true,
      2: true,
      3: true,
    });
  };


  const handleEnroll = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (user?.role !== "Student") {
      setError("Only students can enroll in courses.");
      return;
    }

    setError("");
    setSuccess("");

    navigate("/demo-payment", {
      state: { course },
    });
  };


  const showNotification = (message) => {
    setSuccess(message);

    setTimeout(() => {
      setSuccess("");
    }, 3500);
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

          <p className="text-secondary mt-3">
            Loading course details...
          </p>
        </div>
      </div>
    );
  }

  if (error && !course) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">
          {error}
        </div>

        <button
          type="button"
          className="btn btn-outline-primary"
          onClick={() => navigate("/courses")}
        >
          <ArrowLeft size={17} className="me-2" />
          Back to Courses
        </button>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container py-5">
        <div className="alert alert-warning">
          Course not found.
        </div>
      </div>
    );
  }

  const curriculumModules = [
    {
      title: "Course Lessons",
      lessons: lessons.map((lesson) => ({
        ...lesson,
        type: "video",
        duration: lesson.duration
          ? `${lesson.duration} min`
          : "0 min",
      })),
    },
  ];

  const learningPoints = [
    "Build practical real-world applications",
    "Master the core concepts of this course",
    "Learn industry-standard development practices",
    "Work with modern tools and technologies",
    "Build projects to strengthen your portfolio",
    "Develop skills for professional opportunities",
  ];

  return (
    <div className="bg-light min-vh-100">

      {/* Notification */}
      {(success || error) && (
        <div
          className={`position-fixed top-0 end-0 m-4 alert ${success ? "alert-success" : "alert-danger"
            } shadow d-flex align-items-center gap-2`}
          style={{
            zIndex: 1055,
            maxWidth: "400px",
          }}
        >
          <ShieldCheck size={20} />
          <span className="small fw-semibold">
            {success || error}
          </span>
        </div>
      )}

      {/* Hero Section */}
      <section className="bg-dark text-white py-5">

        <div className="container-xl">

          {/* Breadcrumb */}
          <div className="d-flex align-items-center flex-wrap gap-2 small text-secondary mb-4">

            <button
              type="button"
              className="btn btn-link text-secondary text-decoration-none p-0"
              onClick={() => navigate("/")}
            >
              Home
            </button>

            <ChevronRight size={15} />

            <button
              type="button"
              className="btn btn-link text-secondary text-decoration-none p-0"
              onClick={() => navigate("/courses")}
            >
              Courses
            </button>

            <ChevronRight size={15} />

            <span className="text-info">
              {course.category || "Course"}
            </span>

            <ChevronRight size={15} />

            <span className="text-white">
              {course.title}
            </span>

          </div>

          <div className="row g-5">

            {/* Course Hero Content */}
            <div className="col-12 col-lg-8">

              <span className="badge bg-info-subtle text-info border border-info-subtle rounded-pill px-3 py-2 mb-3">
                {course.category || "Learning Course"}
              </span>

              <h1 className="display-5 fw-bold lh-sm mb-4">
                {course.title}
              </h1>

              <p className="lead text-secondary mb-4">
                {course.description ||
                  "Learn practical skills through structured lessons and real-world projects."}
              </p>

              {/* Course Meta */}
              <div className="d-flex flex-wrap gap-3">

                <div className="badge bg-warning-subtle text-warning border border-warning-subtle px-3 py-2">
                  <Star
                    size={15}
                    fill="currentColor"
                    className="me-1"
                  />
                  {course.averageRating || "4.9"}
                </div>

                <div className="d-flex align-items-center gap-2 text-secondary">
                  <Users size={17} className="text-info" />
                  <span>
                    {course.enrolledStudentsCount || 0} students
                  </span>
                </div>

                <div className="d-flex align-items-center gap-2 text-secondary">
                  <GraduationCap
                    size={17}
                    className="text-info"
                  />
                  <span>
                    {course.level || "All Levels"}
                  </span>
                </div>

                <div className="d-flex align-items-center gap-2 text-secondary">
                  <Globe size={17} />
                  <span>Online Learning</span>
                </div>

              </div>

              {/* Instructor */}
              <div className="d-flex align-items-center gap-3 border-top border-secondary mt-4 pt-4">

                <div
                  className="bg-info text-dark rounded-circle d-flex align-items-center justify-content-center fw-bold"
                  style={{
                    width: "48px",
                    height: "48px",
                  }}
                >
                  <UserIcon />
                </div>

                <div>
                  <small className="text-secondary d-block">
                    Created by
                  </small>

                  <span className="fw-bold">
                    {course.instructor?.name ||
                      course.instructorName ||
                      "LearnHub Instructor"}
                  </span>
                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* Main Content */}
      <section className="py-5">

        <div className="container-xl">

          <div className="row g-4 align-items-start">

            {/* Left Column */}
            <div className="col-12 col-lg-8">

              {/* Tabs */}
              <div className="card border-0 shadow-sm rounded-4 mb-4">

                <div className="card-body p-2">

                  <div className="d-flex gap-2 overflow-auto">

                    {[
                      {
                        id: "overview",
                        label: "Overview",
                      },
                      {
                        id: "curriculum",
                        label: "Curriculum",
                      },
                      {
                        id: "instructor",
                        label: "Instructor",
                      },
                      {
                        id: "reviews",
                        label: "Reviews",
                      },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() =>
                          setActiveTab(tab.id)
                        }
                        className={`btn ${activeTab === tab.id
                          ? "btn-dark"
                          : "btn-light"
                          } rounded-3 px-4 py-2 text-nowrap`}
                      >
                        {tab.label}
                      </button>
                    ))}

                  </div>

                </div>
              </div>

              {/* Overview */}
              {activeTab === "overview" && (
                <>

                  {/* What You Will Learn */}
                  <div className="card border-0 shadow-sm rounded-4 mb-4">

                    <div className="card-body p-4 p-md-5">

                      <h3 className="h4 fw-bold mb-4">
                        What You Will Learn
                      </h3>

                      <div className="row g-3">

                        {learningPoints.map(
                          (point, index) => (
                            <div
                              className="col-12 col-md-6"
                              key={index}
                            >
                              <div className="d-flex align-items-start gap-3">

                                <div className="bg-info-subtle text-info rounded-circle p-1 mt-1">
                                  <Check size={14} />
                                </div>

                                <span className="small text-secondary lh-lg">
                                  {point}
                                </span>

                              </div>
                            </div>
                          )
                        )}

                      </div>

                    </div>
                  </div>

                  {/* Course Description */}
                  <div className="card border-0 shadow-sm rounded-4">

                    <div className="card-body p-4 p-md-5">

                      <h3 className="h4 fw-bold mb-3">
                        About This Course
                      </h3>

                      <p className="text-secondary lh-lg mb-0">
                        {course.description ||
                          "This course provides practical learning content designed to help students develop valuable skills through LearnHub."}
                      </p>

                    </div>
                  </div>

                </>
              )}

              {/* Curriculum */}
              {activeTab === "curriculum" && (
                <div className="card border-0 shadow-sm rounded-4">

                  <div className="card-body p-4 p-md-5">

                    <div className="d-flex flex-column flex-md-row justify-content-between gap-3 mb-4">

                      <div>
                        <h3 className="h4 fw-bold mb-1">
                          Course Curriculum
                        </h3>

                        <p className="small text-secondary mb-0">
                          {curriculumModules.length} modules •{" "}
                          {curriculumModules.reduce(
                            (total, module) =>
                              total +
                              module.lessons.length,
                            0
                          )}{" "}
                          lessons
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={expandAllModules}
                        className="btn btn-sm btn-outline-info align-self-start"
                      >
                        Expand All
                      </button>

                    </div>

                    <div className="accordion">

                      {curriculumModules.map(
                        (module, moduleIndex) => {
                          const isExpanded =
                            expandedModules[
                            moduleIndex
                            ];

                          return (
                            <div
                              className="border rounded-3 mb-3 overflow-hidden"
                              key={moduleIndex}
                            >

                              <button
                                type="button"
                                className="btn btn-light w-100 text-start p-3"
                                onClick={() =>
                                  toggleModule(
                                    moduleIndex
                                  )
                                }
                              >

                                <div className="d-flex align-items-center justify-content-between">

                                  <div className="d-flex align-items-center gap-3">

                                    <div
                                      className="bg-dark text-white rounded-3 d-flex align-items-center justify-content-center fw-bold"
                                      style={{
                                        width: "38px",
                                        height: "38px",
                                      }}
                                    >
                                      {String(
                                        moduleIndex + 1
                                      ).padStart(2, "0")}
                                    </div>

                                    <span className="fw-bold">
                                      {module.title}
                                    </span>

                                  </div>

                                  <div className="d-flex align-items-center gap-3">

                                    <span className="small text-secondary d-none d-md-inline">
                                      {
                                        module.lessons
                                          .length
                                      }{" "}
                                      lessons
                                    </span>

                                    <ChevronDown
                                      size={20}
                                      className={
                                        isExpanded
                                          ? "text-info"
                                          : "text-secondary"
                                      }
                                    />

                                  </div>

                                </div>

                              </button>

                              {isExpanded && (
                                <div className="bg-white border-top">

                                  {module.lessons.map(
                                    (lesson, lessonIndex) => (
                                      <div
                                        key={lesson._id || lessonIndex}
                                        className="d-flex align-items-center justify-content-between p-3 border-bottom"
                                      >
                                        <div className="d-flex align-items-center gap-3">
                                          {lesson.type === "video" && (
                                            <Play
                                              size={17}
                                              className="text-info"
                                            />
                                          )}

                                          {lesson.type === "quiz" && (
                                            <FileText
                                              size={17}
                                              className="text-warning"
                                            />
                                          )}

                                          {lesson.type === "exercise" && (
                                            <Laptop
                                              size={17}
                                              className="text-primary"
                                            />
                                          )}

                                          <div>
                                            <span className="small fw-medium text-dark d-block">
                                              {lesson.title}
                                            </span>

                                            {lesson.description && (
                                              <span className="small text-secondary">
                                                {lesson.description}
                                              </span>
                                            )}
                                          </div>
                                        </div>

                                        <div className="d-flex align-items-center gap-3">
                                          <span className="small text-secondary">
                                            {lesson.duration}
                                          </span>

                                          {lesson.videoUrl && (
                                            <a
                                              href={lesson.videoUrl}
                                              target="_blank"
                                              rel="noreferrer"
                                              className="btn btn-sm btn-outline-primary"
                                            >
                                              <Play size={14} className="me-1" />
                                              Watch Lesson
                                            </a>
                                          )}
                                        </div>
                                      </div>
                                    )
                                  )}

                                </div>
                              )}

                            </div>
                          );
                        }
                      )}

                    </div>

                  </div>
                </div>
              )}

              {/* Instructor */}
              {activeTab === "instructor" && (
                <div className="card border-0 shadow-sm rounded-4">

                  <div className="card-body p-4 p-md-5">

                    <h3 className="h4 fw-bold mb-4">
                      Course Instructor
                    </h3>

                    <div className="d-flex flex-column flex-md-row gap-4 align-items-md-center">

                      <div
                        className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold fs-2"
                        style={{
                          width: "100px",
                          height: "100px",
                        }}
                      >
                        <UserIcon size={45} />
                      </div>

                      <div>

                        <h4 className="fw-bold mb-1">
                          {course.instructor?.name ||
                            course.instructorName ||
                            "LearnHub Instructor"}
                        </h4>

                        <p className="text-info small fw-bold mb-3">
                          Course Instructor
                        </p>

                        <div className="d-flex flex-wrap gap-3 small text-secondary">

                          <span>
                            <Star
                              size={14}
                              className="text-warning me-1"
                            />
                            {course.averageRating ||
                              "4.9"}{" "}
                            Rating
                          </span>

                          <span>
                            <Users
                              size={14}
                              className="me-1"
                            />
                            {course.enrolledStudentsCount ||
                              0}{" "}
                            Students
                          </span>

                        </div>

                      </div>

                    </div>

                    <p className="text-secondary lh-lg mt-4 mb-0">
                      Learn from practical course content
                      designed to help you develop
                      professional skills and build real-world
                      projects.
                    </p>

                  </div>
                </div>
              )}

              {/* Reviews */}
              {activeTab === "reviews" && (
                <div className="card border-0 shadow-sm rounded-4">

                  <div className="card-body p-4 p-md-5 text-center">

                    <div className="bg-warning-subtle text-warning rounded-circle d-inline-flex p-3 mb-3">
                      <Star
                        size={28}
                        fill="currentColor"
                      />
                    </div>

                    <h3 className="h4 fw-bold">
                      Course Reviews
                    </h3>

                    <p className="text-secondary mb-0">
                      Reviews and ratings will be available
                      as students complete this course.
                    </p>

                  </div>
                </div>
              )}

            </div>

            {/* Right Enrollment Card */}
            <div className="col-12 col-lg-4">

              <div
                className="card border-0 shadow-lg rounded-4 overflow-hidden"
                style={{
                  position: "sticky",
                  top: "90px",
                }}
              >

                {/* Thumbnail */}
                <div
                  className="position-relative bg-dark"
                  style={{ height: "220px" }}
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
                        size={80}
                        className="text-info opacity-50"
                      />
                    </div>
                  )}

                  <div className="position-absolute top-50 start-50 translate-middle">
                    <div
                      className="bg-info text-dark rounded-circle d-flex align-items-center justify-content-center shadow"
                      style={{
                        width: "58px",
                        height: "58px",
                      }}
                    >
                      <Play
                        size={25}
                        fill="currentColor"
                      />
                    </div>
                  </div>

                  <span className="position-absolute bottom-0 start-0 m-3 badge bg-dark bg-opacity-75">
                    Course Preview
                  </span>

                </div>

                {/* Enrollment Body */}
                <div className="card-body p-4">

                  {/* Price */}
                  <div className="d-flex align-items-center justify-content-between mb-4">

                    <div className="d-flex align-items-center">
                      <DollarSign
                        size={25}
                        className="text-success"
                      />

                      <span className="fs-2 fw-bold">
                        {Number(
                          course.price || 0
                        ).toFixed(2)}
                      </span>
                    </div>

                    <span className="badge bg-success-subtle text-success">
                      Available
                    </span>

                  </div>

                  {/* Enroll */}
                  {isAuthenticated &&
                    user?.role !== "Student" ? (
                    <div className="alert alert-info small">
                      Only students can enroll in
                      courses.
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={handleEnroll}
                      disabled={enrolling}
                      className="btn btn-primary btn-lg w-100 fw-bold mb-3"
                    >
                      {enrolling ? (
                        <>
                          <Loader2
                            size={20}
                            className="me-2 spinner-border"
                          />
                          Enrolling...
                        </>
                      ) : (
                        <>
                          <BookOpen
                            size={20}
                            className="me-2"
                          />
                          {isAuthenticated
                            ? "Enroll Now"
                            : "Login to Enroll"}
                        </>
                      )}
                    </button>
                  )}

                  <p className="text-center small text-secondary">
                    Start learning and track your progress
                    from My Courses.
                  </p>

                  {/* Includes */}
                  <div className="border-top pt-4 mt-4">

                    <h6 className="fw-bold mb-3">
                      This course includes:
                    </h6>

                    <div className="d-flex flex-column gap-3 small text-secondary">

                      <div className="d-flex align-items-center gap-2">
                        <Clock
                          size={17}
                          className="text-info"
                        />
                        <span>
                          Structured video lessons
                        </span>
                      </div>

                      <div className="d-flex align-items-center gap-2">
                        <FileText
                          size={17}
                          className="text-info"
                        />
                        <span>
                          Learning resources
                        </span>
                      </div>

                      <div className="d-flex align-items-center gap-2">
                        <Award
                          size={17}
                          className="text-info"
                        />
                        <span>
                          Certificate of completion
                        </span>
                      </div>

                      <div className="d-flex align-items-center gap-2">
                        <Smartphone
                          size={17}
                          className="text-info"
                        />
                        <span>
                          Access on mobile devices
                        </span>
                      </div>

                      <div className="d-flex align-items-center gap-2">
                        <Tv
                          size={17}
                          className="text-info"
                        />
                        <span>
                          Online learning access
                        </span>
                      </div>

                    </div>

                  </div>

                  {/* Share / Wishlist */}
                  <div className="border-top pt-3 mt-4 d-flex justify-content-between">

                    <button
                      type="button"
                      onClick={() =>
                        showNotification(
                          "Course link copied!"
                        )
                      }
                      className="btn btn-link btn-sm text-secondary text-decoration-none"
                    >
                      <Share2
                        size={16}
                        className="me-1"
                      />
                      Share
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        showNotification(
                          "Course saved to wishlist!"
                        )
                      }
                      className="btn btn-link btn-sm text-secondary text-decoration-none"
                    >
                      <Bookmark
                        size={16}
                        className="me-1"
                      />
                      Wishlist
                    </button>

                  </div>

                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

    </div>
  );
}

/* Small helper icon */
function UserIcon({ size = 22 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 21a8 8 0 0 0-16 0" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

export default CourseDetail;