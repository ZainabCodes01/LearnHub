import React, { useEffect, useState } from "react";
import {
  Users,
  BookOpen,
  Search,
  Mail,
  Loader2,
  ShieldCheck,
  Bell,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { getInstructorStudents } from "../services/enrollmentService";

function InstructorStudents() {
  const { user, token } = useAuth();

  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getInstructorStudents(token);

        setStudents(data.students || []);
      } catch (err) {
        console.error(
          "Failed to load instructor students:",
          err
        );

        setError(
          err.response?.data?.message ||
            "Unable to load students."
        );
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchStudents();
    }
  }, [token]);

  const filteredStudents = students.filter((item) => {
    const name =
      item.student?.name?.toLowerCase() || "";

    const email =
      item.student?.email?.toLowerCase() || "";

    const course =
      item.course?.title?.toLowerCase() || "";

    const query = searchQuery.toLowerCase();

    return (
      name.includes(query) ||
      email.includes(query) ||
      course.includes(query)
    );
  });

  const uniqueStudents = [
    ...new Map(
      filteredStudents.map((item) => [
        item.student?._id,
        item,
      ])
    ).values(),
  ];

  return (
    <div className="min-vh-100 bg-light d-flex flex-column">
      {/* Header */}
      <header className="bg-white border-bottom sticky-top">
        <div className="container-fluid px-4 py-3">
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <h1 className="h4 fw-bold mb-0">
                My Students
              </h1>

              <small className="text-muted">
                View and manage students enrolled in your courses
              </small>
            </div>

            <div className="d-flex align-items-center gap-3">
              <button
                type="button"
                className="btn btn-light border position-relative"
                onClick={() =>
                  setError("No new notifications")
                }
              >
                <Bell size={19} />

                <span className="position-absolute top-0 start-100 translate-middle p-1 bg-info border border-white rounded-circle"></span>
              </button>

              <div className="d-none d-sm-flex align-items-center gap-2 border-start ps-3">
                <div
                  className="rounded-3 bg-dark text-info d-flex align-items-center justify-content-center fw-bold"
                  style={{
                    width: "40px",
                    height: "40px",
                  }}
                >
                  {user?.name?.charAt(0)?.toUpperCase() ||
                    "I"}
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
          {/* Page Header */}
          <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
            <div>
              <h2 className="h4 fw-bold mb-1">
                Student Management
              </h2>

              <p className="text-secondary mb-0">
                View students enrolled in your courses and
                track their learning progress.
              </p>
            </div>

            <div className="d-flex align-items-center gap-2">
              <div className="bg-info bg-opacity-10 text-info rounded-3 p-3">
                <Users size={25} />
              </div>

              <div>
                <div className="fw-bold fs-4">
                  {loading ? "—" : uniqueStudents.length}
                </div>

                <small className="text-secondary">
                  Students
                </small>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="card border-0 shadow-sm rounded-4 mb-4">
            <div className="card-body p-3">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <Search size={18} />
                </span>

                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Search by student name, email or course..."
                  value={searchQuery}
                  onChange={(e) =>
                    setSearchQuery(e.target.value)
                  }
                />
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="alert alert-danger d-flex align-items-center justify-content-between">
              <span>{error}</span>

              <button
                type="button"
                className="btn-close"
                onClick={() => setError("")}
              ></button>
            </div>
          )}

          {/* Loading */}
          {loading ? (
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body text-center py-5">
                <Loader2
                  size={35}
                  className="text-info mb-3"
                />

                <p className="text-secondary mb-0">
                  Loading students...
                </p>
              </div>
            </div>
          ) : uniqueStudents.length === 0 ? (
            /* Empty State */
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body text-center py-5">
                <Users
                  size={50}
                  className="text-secondary mb-3"
                />

                <h5 className="fw-bold">
                  No students found
                </h5>

                <p className="text-secondary mb-0">
                  Students enrolled in your courses will
                  appear here.
                </p>
              </div>
            </div>
          ) : (
            /* Students Table */
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
              <div className="card-header bg-white border-bottom p-4">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <h5 className="fw-bold mb-1">
                      Enrolled Students
                    </h5>

                    <small className="text-secondary">
                      {uniqueStudents.length} student
                      {uniqueStudents.length !== 1
                        ? "s"
                        : ""}{" "}
                      found
                    </small>
                  </div>

                  <div className="bg-info bg-opacity-10 text-info rounded-3 p-2">
                    <Users size={20} />
                  </div>
                </div>
              </div>

              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="px-4 py-3">
                        Student
                      </th>

                      <th className="py-3">
                        Course
                      </th>

                      <th className="py-3">
                        Progress
                      </th>

                      <th className="py-3">
                        Status
                      </th>

                      <th className="text-end px-4 py-3">
                        Contact
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {uniqueStudents.map((item) => (
                      <tr key={item.student?._id}>
                        {/* Student */}
                        <td className="px-4 py-3">
                          <div className="d-flex align-items-center gap-3">
                            <div
                              className="bg-info bg-opacity-10 text-info rounded-circle d-flex align-items-center justify-content-center fw-bold"
                              style={{
                                width: "42px",
                                height: "42px",
                              }}
                            >
                              {item.student?.name
                                ?.charAt(0)
                                ?.toUpperCase() || "S"}
                            </div>

                            <div>
                              <div className="fw-semibold">
                                {item.student?.name ||
                                  "Student"}
                              </div>

                              <small className="text-secondary">
                                {item.student?.email}
                              </small>
                            </div>
                          </div>
                        </td>

                        {/* Course */}
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <BookOpen
                              size={17}
                              className="text-info"
                            />

                            <span>
                              {item.course?.title ||
                                "Course"}
                            </span>
                          </div>
                        </td>

                        {/* Progress */}
                        <td style={{ minWidth: "180px" }}>
                          <div className="d-flex align-items-center gap-2">
                            <div
                              className="progress flex-grow-1"
                              style={{ height: "7px" }}
                            >
                              <div
                                className="progress-bar bg-info"
                                style={{
                                  width: `${item.progress || 0}%`,
                                }}
                              ></div>
                            </div>

                            <small className="fw-semibold">
                              {item.progress || 0}%
                            </small>
                          </div>
                        </td>

                        {/* Status */}
                        <td>
                          <span className="badge bg-success-subtle text-success-emphasis rounded-pill">
                            <ShieldCheck
                              size={12}
                              className="me-1"
                            />

                            {item.status ||
                              "In Progress"}
                          </span>
                        </td>

                        {/* Contact */}
                        <td className="text-end px-4">
                          {item.student?.email && (
                            <a
                              href={`mailto:${item.student.email}`}
                              className="btn btn-sm btn-outline-primary"
                            >
                              <Mail
                                size={15}
                                className="me-1"
                              />
                              Email
                            </a>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
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
  );
}

export default InstructorStudents;
