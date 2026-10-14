import { BrowserRouter, Routes, Route } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";

import Home from "../pages/Home";
import Courses from "../pages/Courses";
import CourseDetail from "../pages/CourseDetail";
import Login from "../pages/Login";
import Register from "../pages/Register";

import StudentDashboard from "../pages/StudentDashboard";
import MyCourses from "../pages/MyCourses";

import InstructorDashboard from "../pages/InstructorDashboard";
import AddCourse from "../pages/AddCourse";
import EditCourse from "../pages/EditCourse";
import ManageCourses from "../pages/ManageCourses";
import InstructorStudents from "../pages/InstructorStudents";

import AdminDashboard from "../pages/AdminDashboard";
import AdminUsers from "../pages/AdminUsers";
import AdminCourses from "../pages/AdminCourses";
import Profile from "../pages/Profile";

import AddLesson from "../pages/AddLesson";
import ManageLessons from "../pages/ManageLessons";
import EditLesson from "../pages/EditLesson";

import Navbar from "../components/Navbar";
import InstructorLayout from "../components/InstructorLayout";
import DemoPayment from "../pages/DemoPayment";
import OAuthSuccess from "../pages/OAuthSuccess";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        {/* PUBLIC ROUTES */}

        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/courses" element={<Courses />} />

        <Route
          path="/courses/:id"
          element={<CourseDetail />}
        />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/oauth-success"
          element={<OAuthSuccess />}
        />

        {/* PROFILE ROUTE - ALL LOGGED-IN ROLES */}

        <Route
          path="/profile"
          element={
            <ProtectedRoute
              allowedRoles={["Admin", "Instructor", "Student"]}
            >
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* STUDENT ROUTES */}

        <Route
          path="/student-dashboard"
          element={
            <ProtectedRoute allowedRoles={["Student"]}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-courses"
          element={
            <ProtectedRoute allowedRoles={["Student"]}>
              <MyCourses />
            </ProtectedRoute>
          }
        />

        <Route
          path="/demo-payment"
          element={
            <ProtectedRoute allowedRoles={["Student"]}>
              <DemoPayment />
            </ProtectedRoute>
          }
        />

        {/* INSTRUCTOR LAYOUT - INSTRUCTOR ONLY */}

        <Route
          element={
            <ProtectedRoute allowedRoles={["Instructor"]}>
              <InstructorLayout />
            </ProtectedRoute>
          }
        >
          <Route
            path="/instructor-dashboard"
            element={<InstructorDashboard />}
          />

          <Route
            path="/manage-courses"
            element={<ManageCourses />}
          />

          <Route
            path="/add-course"
            element={<AddCourse />}
          />

          <Route
            path="/instructor-students"
            element={<InstructorStudents />}
          />
        </Route>

        {/* COURSE EDITING */}

        <Route
          path="/edit-course/:id"
          element={
            <ProtectedRoute
              allowedRoles={["Instructor", "Admin"]}
            >
              <EditCourse />
            </ProtectedRoute>
          }
        />

        {/* INSTRUCTOR LESSON ROUTES */}

        <Route
          path="/add-lesson"
          element={
            <ProtectedRoute allowedRoles={["Instructor"]}>
              <AddLesson />
            </ProtectedRoute>
          }
        />

        <Route
          path="/manage-lessons"
          element={
            <ProtectedRoute allowedRoles={["Instructor"]}>
              <ManageLessons />
            </ProtectedRoute>
          }
        />

        <Route
          path="/edit-lesson/:id"
          element={
            <ProtectedRoute allowedRoles={["Instructor"]}>
              <EditLesson />
            </ProtectedRoute>
          }
        />

        {/* ADMIN ROUTES */}

        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-users"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminUsers />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-courses"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminCourses />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;