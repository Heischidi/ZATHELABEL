import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// ── Request interceptor ──────────────────────────────────────────────────────
// Runs in the BROWSER at request time — guaranteed to have window available.
// 1. Upgrades http → https to prevent mixed content errors on HTTPS pages.
// 2. Attaches the auth token to every request.
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    // Force https when page is served over https
    if (window.location.protocol === "https:") {
      if (config.baseURL?.startsWith("http://")) {
        config.baseURL = config.baseURL.replace("http://", "https://");
      }
      if (typeof config.url === "string" && config.url.startsWith("http://")) {
        config.url = config.url.replace("http://", "https://");
      }
    }

    // Attach bearer token
    const token = localStorage.getItem("za_access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// ── Response interceptor — auto-refresh on 401 ───────────────────────────────
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const refresh = localStorage.getItem("za_refresh_token");
        if (refresh) {
          // Use the already-upgraded baseURL for the refresh call
          const baseUrl = original.baseURL || BASE_URL;
          const httpsBase = baseUrl.startsWith("http://") ? baseUrl.replace("http://", "https://") : baseUrl;
          const { data } = await axios.post(`${httpsBase}/api/auth/refresh`, {
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
