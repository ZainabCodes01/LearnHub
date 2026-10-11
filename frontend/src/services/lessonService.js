
import axios from "axios";
import API_URL from "./api";

const LESSONS_URL = `${API_URL}/api/lessons`;

// Create a lesson
export const createLesson = async (lessonData, token) => {
  const response = await axios.post(LESSONS_URL, lessonData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// Get all lessons of a course
export const getCourseLessons = async (courseId, token) => {
  const response = await axios.get(
    `${LESSONS_URL}/course/${courseId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

// Get single lesson
export const getLessonById = async (lessonId) => {
  const response = await axios.get(`${LESSONS_URL}/${lessonId}`);
  return response.data;
};

// Update lesson
export const updateLesson = async (lessonId, lessonData, token) => {
  const response = await axios.put(
    `${LESSONS_URL}/${lessonId}`,
    lessonData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

// Delete lesson
export const deleteLesson = async (lessonId, token) => {
  const response = await axios.delete(`${LESSONS_URL}/${lessonId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
