
import axios from "axios";
import API_URL from "./api";

const ENROLLMENTS_URL = `${API_URL}/api/enrollments`;

// Enroll student in a course
export const enrollCourse = async (courseId, token) => {
  const response = await axios.post(
    `${ENROLLMENTS_URL}/enroll`,
    {
      course: courseId,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

// Get student's enrolled courses
export const getMyCourses = async (token) => {
  const response = await axios.get(`${ENROLLMENTS_URL}/my-courses`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// Update course progress
export const updateProgress = async (enrollmentId, progress, token) => {
  const response = await axios.put(
    `${ENROLLMENTS_URL}/${enrollmentId}/progress`,
    { progress },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const getInstructorStudents = async (token) => {
  const response = await axios.get(
    `${ENROLLMENTS_URL}/instructor-students`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};
