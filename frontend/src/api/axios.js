import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // sends the httpOnly refresh cookie automatically
});

let accessToken = null;
let refreshPromise = null; // dedupes concurrent 401s into a single refresh call

export function setAccessToken(token) {
  accessToken = token;
}

api.interceptors.request.use((config) => {
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retried) {
      originalRequest._retried = true;

      try {
        // If a refresh is already in flight (e.g. two requests 401'd at once),
        // reuse the same promise instead of firing two refresh calls
        refreshPromise ??= api.post('/auth/refresh').finally(() => {
          refreshPromise = null;
        });

        const { data } = await refreshPromise;
        setAccessToken(data.accessToken);
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        setAccessToken(null);
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;