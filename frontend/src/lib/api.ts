import axios from "axios";

// Auto-upgrade http → https when running on a secure page to prevent mixed content errors.
// This is a safeguard in case NEXT_PUBLIC_API_URL is accidentally set with http:// in production.
let API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
if (typeof window !== "undefined" && window.location.protocol === "https:" && API_URL.startsWith("http://")) {
  API_URL = API_URL.replace("http://", "https://");
}

export const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach token to every request
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("za_access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Auto-refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const refresh = localStorage.getItem("za_refresh_token");
        if (refresh) {
          const { data } = await axios.post(`${API_URL}/api/auth/refresh`, {
            refresh_token: refresh,
          });
          localStorage.setItem("za_access_token", data.access_token);
          localStorage.setItem("za_refresh_token", data.refresh_token);
          original.headers.Authorization = `Bearer ${data.access_token}`;
          return api(original);
        }
      } catch {
        localStorage.removeItem("za_access_token");
        localStorage.removeItem("za_refresh_token");
        if (typeof window !== "undefined") {
          window.location.href = "/auth/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
