import axios from 'axios';
import {API_URL, ENDPOINTS} from './constants';

const apiClient = axios.create({
    baseURL: API_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

// Response interceptor for handling expired tokens
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Prevent retrying the refresh endpoint itself
        if (originalRequest.url === ENDPOINTS.AUTH.REFRESH) {
            return Promise.reject(error);
        }

        // Check for a 401 error and that we haven't retried this request yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                // Trigger token refresh; the new tokens should be set as cookies by the server.
                await apiClient.post(ENDPOINTS.AUTH.REFRESH);
                // Retry the original request; cookies are sent automatically.
                return apiClient(originalRequest);
            } catch (refreshError) {
                // Handle refresh token failure (for example, redirect to login)
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;