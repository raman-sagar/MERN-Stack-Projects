import axios from "axios";

const api = axios.create({
  baseURL: "https://pbp-backend-sgys.onrender.com",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
};

export const postsAPI = {
  getAll: () => api.get("/api/posts"),
  getMyPosts: () => api.get("/api/posts/my-posts"),
  create: (data) => api.post("/api/posts", data),
  update: (id, data) => api.put(`/api/posts/${id}`, data),
  delete: (id) => api.delete(`/api/posts/${id}`),
};

export default api;
