import axios from "axios";

// NEXT_PUBLIC_API_URL is substituted at BUILD time by Next.js.
// We force https:// for any non-localhost URL to prevent mixed content errors
// when the frontend is served over HTTPS (e.g. Vercel).
const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const BASE_URL = rawApiUrl.replace(/^http:\/\/(?!localhost)/, "https://");

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// ── Request interceptor ──────────────────────────────────────────────────────
// Attaches the auth bearer token to every outgoing request.
api.interceptors.request.use((config) => {
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
