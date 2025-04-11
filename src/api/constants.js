// Ensure there's always a default value for API_URL
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export const ENDPOINTS = {
    AUTH: {
        DISCORD: `${API_URL}/auth/discord`,
        ME: `${API_URL}/user/me`,
        LOGOUT: `${API_URL}/user/logout`,
        REFRESH: `${API_URL}/token/refresh-token`,
    },
    USER: {
        PROFILE: (id) => `${API_URL}/user/${id}`,  // New endpoint for user profiles
        UPDATE: (id) => `${API_URL}/user/${id}`,   // For future update functionality
    },
    LESSONS: {
        BASE: `${API_URL}/lessons`,
        USER: (id) => `${API_URL}/user/${id}/lessons`,
        TUTORS: (id) => `${API_URL}/user/${id}/tutors`,
    },
    TUTORS: {
        BASE: `${API_URL}/tutors`,
        AVAILABILITY: (id) => `${API_URL}/tutors/${id}/availability`,
        WEEKLY_SCHEDULE: (id) => `${API_URL}/tutors/${id}/weekly-schedules`,
        EXCEPTIONS: (id) => `${API_URL}/tutors/${id}/exceptions`,
        STUDENTS: (id) => `${API_URL}/tutors/${id}/students`,
    },
    COURSES: {
        BASE: `${API_URL}/courses`,
        USER: (id) => `${API_URL}/user/${id}/courses`,
        ENROLL: (id) => `${API_URL}/courses/${id}/enroll`,
    },
};

export const ROUTES = {
    HOME: '/',
    AUTH_CALLBACK: '/auth/callback',
    TUTORS: '/tutors',
    HELP: '/help',
    COURSES: '/courses',
    USER_PROFILE: '/user/:userId',  // Dynamic user profile route
    PROFILE: '/profile',            // Keep this for backward compatibility
};