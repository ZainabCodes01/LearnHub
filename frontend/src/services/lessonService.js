import axios from "axios";

const API_URL = "http://localhost:5000/api/lessons";

// Create a lesson
export const createLesson = async (lessonData, token) => {
  const response = await axios.post(
    API_URL,
    lessonData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

// Get all lessons of a course
export const getCourseLessons = async (courseId, token) => {
  const response = await axios.get(
    `${API_URL}/course/${courseId}`,
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
  const response = await axios.get(
    `${API_URL}/${lessonId}`
  );

  return response.data;
};

// Update lesson
export const updateLesson = async (
  lessonId,
  lessonData,
  token
) => {
  const response = await axios.put(
    `${API_URL}/${lessonId}`,
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
  const response = await axios.delete(
    `${API_URL}/${lessonId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};