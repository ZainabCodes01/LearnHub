import React, { useEffect, useState } from "react";
import {
  Search,
  BookOpen,
  Star,
  ChevronRight,
  ChevronLeft,
  Compass,
  Check,
  ShieldCheck,
  Filter,
} from "lucide-react";
import { Link } from "react-router-dom";
import { getCourses } from "../services/courseService";

export default function Courses() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceFilter, setPriceFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState("all");

  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [notification, setNotification] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const showToast = (msg) => {
    setNotification(msg);

    setTimeout(() => {
      setNotification("");
    }, 3000);
  };

  // Fetch courses from backend
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getCourses();
        setCourses(data || []);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
        showToast("Unable to load courses.");
      } finally {
        setLoadingCourses(false);
      }
    };

    fetchCourses();
  }, []);

  // Backend-supported categories
  const categories = [
    "All",
    "Web Development",
    "Data Science",
    "Mobile Development",
    "UI/UX Design",
    "Cloud Computing",
    "Cybersecurity",
  ];

  // Filter courses
  const filteredCourses = courses.filter((course) => {
    const title = course.title?.toLowerCase() || "";
    const instructor = course.instructor?.name?.toLowerCase() || "";

    const search = searchQuery.toLowerCase();

    const matchesSearch =
      title.includes(search) || instructor.includes(search);

    const matchesCategory =
      selectedCategory === "All" ||
      course.category === selectedCategory;

    const rawPrice = Number(course.price) || 0;

    let matchesPrice = true;

    if (priceFilter === "under75") {
      matchesPrice = rawPrice < 75;
    }

    if (priceFilter === "75to90") {
      matchesPrice = rawPrice >= 75 && rawPrice <= 90;
    }

    if (priceFilter === "over90") {
      matchesPrice = rawPrice > 90;
    }

    const matchesLevel =
      levelFilter === "all" ||
      course.level?.toLowerCase() === levelFilter.toLowerCase();

    return (
      matchesSearch &&
      matchesCategory &&
      matchesPrice &&
      matchesLevel
    );
  });

  const resetFilters = () => {
    setSelectedCategory("All");
    setPriceFilter("all");
    setLevelFilter("all");
    setSearchQuery("");
    setCurrentPage(1);
  };

  return (
    <div className="min-vh-100 bg-light text-dark d-flex flex-column">

      {/* Toast */}
      {notification && (
        <div
          className="position-fixed top-0 end-0 m-4 alert alert-dark shadow-lg d-flex align-items-center gap-2"
          style={{ zIndex: 1055 }}
        >
          <ShieldCheck size={20} className="text-info" />
          <span>{notification}</span>
        </div>
      )}

      {/* Main Content */}
      <main className="container py-5">

        {/* Heading + Search */}
        <div className="bg-white border rounded-4 shadow-sm p-4 mb-4">
          <div className="row align-items-center g-4">

            <div className="col-lg-6">
              <div className="d-flex align-items-center gap-2 mb-2">
                <Compass size={22} className="text-info" />

                <span className="small fw-bold text-info">
                  LEARNHUB COURSES
                </span>
              </div>

              <h1 className="fw-bold mb-2">
                Explore Courses
              </h1>

              <p className="text-muted mb-0">
                Discover expert-led programming and technology
                courses to accelerate your career.
              </p>
            </div>

            <div className="col-lg-6">
              <div className="row g-2">

                {/* Search */}
                <div className="col-md-7">
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <Search size={18} className="text-muted" />
                    </span>

                    <input
                      type="text"
                      className="form-control bg-light border-start-0"
                      placeholder="Search courses..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1);
                      }}
                    />
                  </div>
                </div>

                {/* Category */}
                <div className="col-md-5">
                  <select
                    className="form-select"
                    value={selectedCategory}
                    onChange={(e) => {
                      setSelectedCategory(e.target.value);
                      setCurrentPage(1);
                    }}
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category === "All"
                          ? "All Categories"
                          : category}
                      </option>
                    ))}
                  </select>
                </div>

              </div>
            </div>

          </div>
        </div>

        {/* Main Layout */}
        <div className="row g-4">

          {/* Sidebar */}
          <div className="col-lg-3">

            <div className="bg-white border rounded-4 shadow-sm p-4">

              <div className="d-flex align-items-center justify-content-between border-bottom pb-3 mb-4">

                <h6 className="fw-bold mb-0 d-flex align-items-center gap-2">
                  <Filter size={18} className="text-info" />
                  Filters
                </h6>

                <button
                  type="button"
                  className="btn btn-link btn-sm text-info text-decoration-none p-0"
                  onClick={resetFilters}
                >
                  Reset
                </button>

              </div>

              {/* Categories */}
              <div className="mb-4">

                <h6 className="small fw-bold text-uppercase text-muted mb-3">
                  Categories
                </h6>

                <div className="d-flex flex-column gap-1">

                  {categories.map((category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => {
                        setSelectedCategory(category);
                        setCurrentPage(1);
                      }}
                      className={`btn text-start d-flex align-items-center justify-content-between ${
                        selectedCategory === category
                          ? "btn-info text-white"
                          : "btn-light text-dark"
                      }`}
                    >
                      <span className="small">
                        {category}
                      </span>

                      {selectedCategory === category && (
                        <Check size={15} />
                      )}
                    </button>
                  ))}

                </div>
              </div>

              {/* Price */}
              <div className="border-top pt-4 mb-4">

                <h6 className="small fw-bold text-uppercase text-muted mb-3">
                  Price Range
                </h6>

                {[
                  { id: "all", label: "All Prices" },
                  { id: "under75", label: "Under $75" },
                  { id: "75to90", label: "$75 - $90" },
                  { id: "over90", label: "Over $90" },
                ].map((price) => (
                  <button
                    key={price.id}
                    type="button"
                    onClick={() => {
                      setPriceFilter(price.id);
                      setCurrentPage(1);
                    }}
                    className={`btn w-100 text-start d-flex justify-content-between mb-1 ${
                      priceFilter === price.id
                        ? "btn-info text-white"
                        : "btn-light"
                    }`}
                  >
                    <span className="small">
                      {price.label}
                    </span>

                    {priceFilter === price.id && (
                      <Check size={15} />
                    )}
                  </button>
                ))}

              </div>

              {/* Level */}
              <div className="border-top pt-4">

                <h6 className="small fw-bold text-uppercase text-muted mb-3">
                  Skill Level
                </h6>

                {[
                  { id: "all", label: "All Levels" },
                  { id: "beginner", label: "Beginner" },
                  { id: "intermediate", label: "Intermediate" },
                  { id: "advanced", label: "Advanced" },
                ].map((level) => (
                  <button
                    key={level.id}
                    type="button"
                    onClick={() => {
                      setLevelFilter(level.id);
                      setCurrentPage(1);
                    }}
                    className={`btn w-100 text-start d-flex justify-content-between mb-1 ${
                      levelFilter === level.id
                        ? "btn-info text-white"
                        : "btn-light"
                    }`}
                  >
                    <span className="small">
                      {level.label}
                    </span>

                    {levelFilter === level.id && (
                      <Check size={15} />
                    )}
                  </button>
                ))}

              </div>

            </div>
          </div>

          {/* Courses */}
          <div className="col-lg-9">

            {/* Results Header */}
            <div className="d-flex justify-content-between align-items-center mb-3">

              <span className="small text-muted">
                Showing{" "}
                <strong className="text-dark">
                  {filteredCourses.length}
                </strong>{" "}
                courses
              </span>

              <span className="small text-muted">
                Sorted by{" "}
                <strong className="text-dark">
                  Most Popular
                </strong>
              </span>

            </div>

            {/* Loading */}
            {loadingCourses ? (
              <div className="bg-white border rounded-4 shadow-sm text-center py-5">

                <div
                  className="spinner-border text-info"
                  role="status"
                >
                  <span className="visually-hidden">
                    Loading...
                  </span>
                </div>

                <p className="text-muted mt-3 mb-0">
                  Loading courses...
                </p>

              </div>
            ) : filteredCourses.length === 0 ? (

              /* Empty State */
              <div className="bg-white border rounded-4 shadow-sm text-center py-5 px-4">

                <div className="mb-3">
                  <div className="bg-info bg-opacity-10 rounded-4 d-inline-flex p-3">
                    <Search
                      size={32}
                      className="text-info"
                    />
                  </div>
                </div>

                <h4 className="fw-bold">
                  No courses found
                </h4>

                <p className="text-muted">
                  We couldn't find any courses matching your
                  current filters.
                </p>

                <button
                  type="button"
                  onClick={resetFilters}
                  className="btn btn-dark"
                >
                  Clear Filters
                </button>

              </div>

            ) : (

              /* Course Grid */
              <div className="row g-4">

                {filteredCourses.map((course) => (

                  <div
                    className="col-md-6 col-xl-4"
                    key={course._id}
                  >

                    <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden">

                      {/* Image */}
                      <div
                        className="position-relative bg-light"
                        style={{ height: "190px" }}
                      >

                        <img
                          src={
                            course.thumbnail ||
                            "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80"
                          }
                          alt={course.title}
                          className="w-100 h-100 object-fit-cover"
                        />

                        <span className="position-absolute top-0 start-0 m-3 badge bg-dark">
                          {course.category}
                        </span>

                        <span className="position-absolute bottom-0 end-0 m-3 badge bg-white text-dark shadow-sm">
                          {course.level}
                        </span>

                      </div>

                      {/* Content */}
                      <div className="card-body d-flex flex-column p-4">

                        <div className="d-flex justify-content-between align-items-start gap-2 mb-2">

                          <small className="text-muted">
                            {course.instructor?.name ||
                              "LearnHub Instructor"}
                          </small>

                          <span className="small fw-bold text-warning d-flex align-items-center gap-1">
                            <Star
                              size={14}
                              fill="currentColor"
                            />
                            {course.averageRating || 0}
                          </span>

                        </div>

                        <h5 className="card-title fw-bold">
                          {course.title}
                        </h5>

                        <p className="card-text text-muted small">
                          {course.description
                            ? course.description.length > 90
                              ? `${course.description.substring(
                                  0,
                                  90
                                )}...`
                              : course.description
                            : "Explore this course and start learning with LearnHub."}
                        </p>

                        <div className="mt-auto pt-3 border-top">

                          <div className="d-flex align-items-center justify-content-between mb-3">

                            <span className="fs-5 fw-bold">
                              ${Number(course.price || 0).toFixed(2)}
                            </span>

                            <span className="small text-muted">
                              {course.enrolledStudentsCount || 0} students
                            </span>

                          </div>

                          <Link
                            to={`/courses/${course._id}`}
                            className="btn btn-info text-white w-100 d-flex align-items-center justify-content-center gap-2"
                          >
                            View Course
                            <ChevronRight size={16} />
                          </Link>

                        </div>

                      </div>
                    </div>

                  </div>

                ))}

              </div>
            )}

            {/* Pagination */}
            {!loadingCourses &&
              filteredCourses.length > 0 && (
                <div className="d-flex align-items-center justify-content-between border-top mt-4 pt-4">

                  <span className="small text-muted">
                    Page{" "}
                    <strong className="text-dark">
                      {currentPage}
                    </strong>{" "}
                    of 3
                  </span>

                  <div className="d-flex gap-2">

                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      disabled={currentPage === 1}
                      onClick={() =>
                        setCurrentPage((prev) =>
                          Math.max(prev - 1, 1)
                        )
                      }
                    >
                      <ChevronLeft size={16} />
                    </button>

                    {[1, 2, 3].map((page) => (
                      <button
                        key={page}
                        type="button"
                        onClick={() => setCurrentPage(page)}
                        className={`btn ${
                          currentPage === page
                            ? "btn-info text-white"
                            : "btn-outline-secondary"
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      disabled={currentPage === 3}
                      onClick={() =>
                        setCurrentPage((prev) =>
                          Math.min(prev + 1, 3)
                        )
                      }
                    >
                      <ChevronRight size={16} />
                    </button>

                  </div>
                </div>
              )}

          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-dark text-light py-4 mt-auto">
        <div className="container">

          <div className="row align-items-center g-3">

            <div className="col-md-4">
              <div className="d-flex align-items-center gap-2">
                <div className="bg-info rounded-3 p-2">
                  <BookOpen size={18} />
                </div>

                <span className="fw-bold">
                  Learn<span className="text-info">Hub</span>
                </span>
              </div>
            </div>

            <div className="col-md-4 text-center">
              <small className="text-secondary">
                © 2026 LearnHub. All rights reserved.
              </small>
            </div>

            <div className="col-md-4 text-md-end">
              <div className="d-flex justify-content-md-end gap-3">

                <button
                  type="button"
                  className="btn btn-link btn-sm text-secondary text-decoration-none p-0"
                  onClick={() =>
                    showToast("Privacy Policy")
                  }
                >
                  Privacy
                </button>

                <button
                  type="button"
                  className="btn btn-link btn-sm text-secondary text-decoration-none p-0"
                  onClick={() =>
                    showToast("Terms of Service")
                  }
                >
                  Terms
                </button>

                <button
                  type="button"
                  className="btn btn-link btn-sm text-secondary text-decoration-none p-0"
                  onClick={() =>
                    showToast("Support Center")
                  }
                >
                  Support
                </button>

              </div>
            </div>

          </div>
        </div>
      </footer>

    </div>
  );
}
