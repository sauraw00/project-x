import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api"
});

const storedToken = localStorage.getItem("hn_token");

if (storedToken) {
  api.defaults.headers.common.Authorization = `Bearer ${storedToken}`;
}

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("hn_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
