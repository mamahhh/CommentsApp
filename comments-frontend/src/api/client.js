import axios from "axios";

export const apiClient = axios.create({
  baseURL: "http://localhost:8000/api",
  timeout: 10000,
});

// If ask for Authorization
// apiClient.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    return Promise.reject(error);
  }
);