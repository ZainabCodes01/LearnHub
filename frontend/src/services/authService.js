
import axios from "axios";
import API_URL from "./api";

const AUTH_URL = `${API_URL}/api/auth`;

export const loginUser = async (email, password) => {
  const response = await axios.post(`${AUTH_URL}/login`, {
    email,
    password,
  });

  return response.data;
};

export const registerUser = async (name, email, password, role) => {
  const response = await axios.post(`${AUTH_URL}/register`, {
    name,
    email,
    password,
    role,
  });

  return response.data;
};
