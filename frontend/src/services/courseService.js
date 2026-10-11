import axios from "axios";

const API_URL = "http://localhost:5000/api/courses";

export const getCourses = async () => {
  const response = await axios.get(API_URL);
  return response.data.courses;
};

export const getCourseById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};