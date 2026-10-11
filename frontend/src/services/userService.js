
import axios from "axios";
import API_URL from "./api";

const USERS_URL = `${API_URL}/api/users`;

export const getUsers = async (token) => {
  const response = await axios.get(USERS_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const updateUser = async (id, userData, token) => {
  const response = await axios.put(`${USERS_URL}/${id}`, userData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const deleteUser = async (id, token) => {
  const response = await axios.delete(`${USERS_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
