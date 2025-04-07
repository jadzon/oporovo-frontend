// services/tutorAvailabilityService.js
import apiClient from '../client';

export const tutorAvailabilityService = {
    // Get tutor's weekly schedule template
    getWeeklySchedule: (tutorID) =>
        apiClient.get(`/tutors/${tutorID}/weekly-schedules`),

    // Get tutor's calculated availability for a date range
    getAvailability: (tutorID, startDate, endDate) =>
        apiClient.get(`/tutors/${tutorID}/availability`, {
            params: { start_date: startDate, end_date: endDate }
        }),

    // Get tutor's schedule exceptions (date-specific changes)
    getExceptions: (tutorID, params) =>
        apiClient.get(`/tutors/${tutorID}/exceptions`, { params }),
};