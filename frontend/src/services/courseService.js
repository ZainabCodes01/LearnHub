
import axios from "axios";
import API_URL from "./api";

const COURSES_URL = `${API_URL}/api/courses`;

export const getCourses = async () => {
  const response = await axios.get(COURSES_URL);
  return response.data.courses;
};

export const getCourseById = async (id) => {
  const response = await axios.get(`${COURSES_URL}/${id}`);
  return response.data;
};
