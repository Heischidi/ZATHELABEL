import axios from "axios";

// Hardcode the production URL with https:// to completely bypass any Vercel environment variable issues.
const isProd = process.env.NODE_ENV === "production";
const BASE_URL = isProd 
  ? "https://zathelabel-production.up.railway.app" 
  : "http://localhost:8000";

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// ── Request interceptor ──────────────────────────────────────────────────────
// Attaches the auth bearer token to every outgoing request.
// Also ensures the URL has a trailing slash to prevent FastAPI from issuing a 307 Redirect to HTTP.
api.interceptors.request.use((config) => {
  // Ensure trailing slash to avoid 307 redirects (unless there's a query string or it's a file)
  if (config.url && !config.url.includes("?") && !config.url.endsWith("/")) {
    config.url = `${config.url}/`;
  } else if (config.url && config.url.includes("?")) {
    const [path, query] = config.url.split("?");
    if (!path.endsWith("/")) {
      config.url = `${path}/?${query}`;
    }
  }

  if (typeof window !== "undefined") {
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
          const { data } = await axios.post(`${BASE_URL}/api/auth/refresh`, {
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
