import React, { useEffect, useState } from "react";
import {
  User,
  Bell,
  ShieldCheck,
  Mail,
  Camera,
  Award,
  BookOpen,
  Clock,
  CheckCircle2,
  Save,
  Sparkles,
  Lock,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getMyCourses } from "../services/enrollmentService";
import { getCourses } from "../services/courseService";

function Profile() {
  const { user, token } = useAuth();

  const [notification, setNotification] = useState(null);

  const [profile, setProfile] = useState({
    fullName: user?.name || "LearnHub User",
    email: user?.email || "user@learnhub.com",
    role: user?.role || "Student",
    joinedDate: user?.createdAt
      ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
      : "Recently",
    avatar:
      user?.avatar ||
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
    bio: "Passionate learner exploring modern web development and building skills through LearnHub.",
    enrolledCount: 0,
    completedCount: 0,
    certificatesCount: 0,
    learningHours: 0,
  });

  const [formData, setFormData] = useState({
    fullName: profile.fullName,
    email: profile.email,
    bio: profile.bio,
  });

  useEffect(() => {
    const fetchProfileStats = async () => {
      if (!token) {
        return;
      }

      try {
        // STUDENT STATS
        if (user?.role === "Student") {
          const data = await getMyCourses(token);
          const enrolledCourses = data.courses || [];

          const enrolledCount = enrolledCourses.length;

          const completedCount = enrolledCourses.filter(
            (item) =>
              item.status === "Completed" ||
              item.progress === 100
          ).length;

          const certificatesCount = completedCount;

          setProfile((prev) => ({
            ...prev,
            enrolledCount,
            completedCount,
            certificatesCount,
            learningHours: 0,
          }));
        }

        // INSTRUCTOR STATS
        if (user?.role === "Instructor") {
          const data = await getCourses();
          const allCourses = data || [];

          const instructorCourses = allCourses.filter((course) => {
            const instructorId =
              typeof course.instructor === "object"
                ? course.instructor?._id
                : course.instructor;

            return instructorId === user?.id;
          });

          const courseCount = instructorCourses.length;

          const publishedCount = instructorCourses.filter(
            (course) => course.status === "Published" || course.isPublished === true
          ).length;

          const studentCount = instructorCourses.reduce(
            (total, course) =>
              total + (course.enrolledStudentsCount || 0),
            0
          );

          const averageRating =
            instructorCourses.length > 0
              ? (
                instructorCourses.reduce(
                  (total, course) =>
                    total + (course.averageRating || 0),
                  0
                ) / instructorCourses.length
              ).toFixed(1)
              : "0.0";

          setProfile((prev) => ({
            ...prev,
            instructorCourseCount: courseCount,
            instructorStudentCount: studentCount,
            instructorPublishedCount: publishedCount,
            instructorRating: averageRating,
          }));
        }
      } catch (error) {
        console.error(
          "Failed to load profile stats:",
          error
        );
      }
    };

    fetchProfileStats();
  }, [token, user]);

  const showToast = (message) => {
    setNotification(message);

    setTimeout(() => {
      setNotification(null);
    }, 3500);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveChanges = (e) => {
    e.preventDefault();

    setProfile((prev) => ({
      ...prev,
      fullName: formData.fullName,
      email: formData.email,
      bio: formData.bio,
    }));

    showToast("Profile updated successfully!");
  };

  const isStudent = user?.role === "Student";
  const isInstructor = user?.role === "Instructor";
  const isAdmin = user?.role === "Admin";

  const stats = isStudent
    ? [
      {
        label: "Enrolled",
        value: profile.enrolledCount,
        icon: BookOpen,
      },
      {
        label: "Completed",
        value: profile.completedCount,
        icon: CheckCircle2,
      },
      {
        label: "Certificates",
        value: profile.certificatesCount,
        icon: Award,
      },
      {
        label: "Learning Hours",
        value: `${profile.learningHours}h`,
        icon: Clock,
      },
    ]
    : isInstructor
      ? [
        {
          label: "Courses",
          value: profile.instructorCourseCount || 0,
          icon: BookOpen,
        },
        {
          label: "Students",
          value: profile.instructorStudentCount || 0,
          icon: User,
        },
        {
          label: "Published",
          value: profile.instructorPublishedCount || 0,
          icon: CheckCircle2,
        },
        {
          label: "Rating",
          value: profile.instructorRating || "0.0",
          icon: Award,
        },
      ]
      : [
        {
          label: "Role",
          value: "Admin",
          icon: ShieldCheck,
        },
        {
          label: "Status",
          value: "Active",
          icon: CheckCircle2,
        },
        {
          label: "Access",
          value: "Full",
          icon: ShieldCheck,
        },
        {
          label: "Account",
          value: "Admin",
          icon: User,
        },
      ];

  return (
    <div className="bg-light min-vh-100">

      {/* Toast Notification */}
      {notification && (
        <div
          className="position-fixed top-0 end-0 m-4 bg-dark text-white px-4 py-3 rounded-3 shadow-lg d-flex align-items-center gap-2"
          style={{ zIndex: 1055 }}
        >
          <ShieldCheck size={20} className="text-info" />
          <span className="small fw-semibold">{notification}</span>
        </div>
      )}

      {/* Main Content */}
      <main className="container-xl py-4 py-md-5">

        {/* Page Header */}
        <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">

          <div>
            <span className="small fw-bold text-info text-uppercase">
              Account Settings
            </span>

            <h1 className="fw-bold text-dark mb-1">
              User Profile
            </h1>

            <p className="text-secondary mb-0">
              Manage your LearnHub profile and personal information.
            </p>
          </div>

          <div className="d-inline-flex align-items-center gap-2 bg-white border rounded-3 px-3 py-2 shadow-sm align-self-start align-self-md-center">
            <Clock size={16} className="text-info" />

            <span className="small fw-semibold text-secondary">
              Member since {profile.joinedDate}
            </span>
          </div>

        </div>

        {/* Main Grid */}
        <div className="row g-4">

          {/* Left Profile Card */}
          <div className="col-12 col-lg-4">

            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">

              {/* Cover */}
              <div
                className="bg-primary"
                style={{ height: "100px" }}
              ></div>

              <div className="card-body text-center p-4">

                {/* Avatar */}
                <div
                  className="position-relative d-inline-block"
                  style={{ marginTop: "-70px" }}
                >
                  <img
                    src={profile.avatar}
                    alt={profile.fullName}
                    className="rounded-circle border border-4 border-white shadow"
                    style={{
                      width: "120px",
                      height: "120px",
                      objectFit: "cover",
                    }}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      showToast("Avatar upload feature coming soon")
                    }
                    className="btn btn-info text-white rounded-circle position-absolute bottom-0 end-0 d-flex align-items-center justify-content-center shadow"
                    style={{
                      width: "36px",
                      height: "36px",
                    }}
                    title="Change Avatar"
                  >
                    <Camera size={17} />
                  </button>
                </div>

                {/* User Info */}
                <div className="mt-3">
                  <h2 className="h4 fw-bold mb-1">
                    {profile.fullName}
                  </h2>

                  <p className="small text-secondary mb-3">
                    {profile.email}
                  </p>
                </div>

                {/* Role Badges */}
                <div className="d-flex justify-content-center flex-wrap gap-2">

                  <span className="badge bg-info-subtle text-info border border-info-subtle rounded-pill px-3 py-2">
                    <ShieldCheck size={14} className="me-1" />
                    {profile.role}
                  </span>

                  <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-3 py-2">
                    <Sparkles size={14} className="me-1" />
                    Verified
                  </span>

                </div>

                {/* Bio */}
                <p className="small text-secondary mt-4 mb-4 lh-lg">
                  {profile.bio}
                </p>

                {/* Small Stats */}
                <div className="row g-2 border-top pt-4">

                  <div className="col-6">
                    <div className="bg-light border rounded-3 p-3">
                      <div className="h4 fw-bold text-dark mb-0">
                        {profile.enrolledCount}
                      </div>

                      <small className="text-secondary fw-semibold">
                        Enrolled Courses
                      </small>
                    </div>
                  </div>

                  <div className="col-6">
                    <div className="bg-light border rounded-3 p-3">
                      <div className="h4 fw-bold text-info mb-0">
                        {profile.certificatesCount}
                      </div>

                      <small className="text-secondary fw-semibold">
                        Certificates
                      </small>
                    </div>
                  </div>

                </div>

              </div>
            </div>

          </div>

          {/* Right Content */}
          <div className="col-12 col-lg-8">

            {/* Statistics */}
            <div className="row g-3 mb-4">

              {stats.map((stat, index) => {
                const Icon = stat.icon;

                return (
                  <div className="col-6 col-md-3" key={index}>

                    <div className="card border-0 shadow-sm rounded-4 h-100">
                      <div className="card-body p-3 p-md-4">

                        <div
                          className={`rounded-3 ${stat.bg} ${stat.color} d-flex align-items-center justify-content-center mb-3`}
                          style={{
                            width: "44px",
                            height: "44px",
                          }}
                        >
                          <Icon size={21} />
                        </div>

                        <h3 className="h4 fw-bold text-dark mb-0">
                          {stat.value}
                        </h3>

                        <small className="text-secondary fw-semibold">
                          {stat.label}
                        </small>

                      </div>
                    </div>

                  </div>
                );
              })}

            </div>

            {/* Personal Information */}
            <div className="card border-0 shadow-sm rounded-4">

              <div className="card-body p-4 p-md-5">

                {/* Card Header */}
                <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-2 border-bottom pb-3 mb-4">

                  <div>
                    <h3 className="h5 fw-bold text-dark mb-1">
                      Personal Information
                    </h3>

                    <p className="small text-secondary mb-0">
                      Update your personal details and profile information.
                    </p>
                  </div>

                  <span className="badge bg-light text-secondary border rounded-3 px-3 py-2 align-self-start">
                    ID: #{user?.id ? String(user.id).slice(-6) : "LH-USER"}
                  </span>

                </div>

                {/* Form */}
                <form onSubmit={handleSaveChanges}>

                  <div className="row g-4">

                    {/* Full Name */}
                    <div className="col-12 col-md-6">

                      <label className="form-label small fw-bold text-dark">
                        Full Name
                      </label>

                      <div className="input-group">

                        <span className="input-group-text bg-light border-end-0">
                          <User size={17} className="text-secondary" />
                        </span>

                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          required
                          className="form-control bg-light border-start-0"
                          placeholder="Enter your full name"
                        />

                      </div>

                    </div>

                    {/* Email */}
                    <div className="col-12 col-md-6">

                      <label className="form-label small fw-bold text-dark">
                        Email Address
                      </label>

                      <div className="input-group">

                        <span className="input-group-text bg-light border-end-0">
                          <Mail size={17} className="text-secondary" />
                        </span>

                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="form-control bg-light border-start-0"
                          placeholder="Enter your email"
                        />

                      </div>

                    </div>

                    {/* Bio */}
                    <div className="col-12">

                      <label className="form-label small fw-bold text-dark">
                        Professional Bio
                      </label>

                      <textarea
                        name="bio"
                        rows="4"
                        value={formData.bio}
                        onChange={handleInputChange}
                        className="form-control bg-light"
                        placeholder="Tell us about yourself..."
                      ></textarea>

                    </div>

                  </div>

                  {/* Bottom Actions */}
                  <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3 border-top pt-4 mt-4">

                    <button
                      type="button"
                      onClick={() =>
                        showToast("Password reset email sent")
                      }
                      className="btn btn-link text-info text-decoration-none fw-bold p-0 d-flex align-items-center gap-2"
                    >
                      <Lock size={16} />
                      Change Password
                    </button>

                    <button
                      type="submit"
                      className="btn btn-primary px-4 py-2 fw-bold d-flex align-items-center justify-content-center gap-2"
                    >
                      <Save size={17} />
                      Save Changes
                    </button>

                  </div>

                </form>

              </div>
            </div>

          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="bg-white border-top py-4 mt-4">
        <div className="container-xl text-center">
          <small className="text-secondary">
            © {new Date().getFullYear()} LearnHub Inc. All rights reserved.
            Built for modern MERN education.
          </small>
        </div>
      </footer>

    </div>
  );
}

export default Profile;