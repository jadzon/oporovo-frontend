// Ensure there's always a default value for API_URL
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export const ENDPOINTS = {
    AUTH: {
        DISCORD: `${API_URL}/auth/discord`,
        ME: `${API_URL}/user/me`,
        LOGOUT: `${API_URL}/user/logout`,
        REFRESH: `${API_URL}/token/refresh-token`,
    },
};

export const ROUTES = {
    HOME: '/',
    AUTH_CALLBACK: '/auth/callback',
    DASHBOARD: '/dashboard',
};