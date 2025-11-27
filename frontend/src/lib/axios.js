import axios from "axios";

const baseURL =
  (import.meta.env.VITE_API_PRODUCTION_URL ||
    import.meta.env.VITE_API_DEVELOPMENT_URL) + "/api";

const axiosInstance = axios.create({
  baseURL,
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
