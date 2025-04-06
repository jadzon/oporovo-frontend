import apiClient from '../client';

export const courseService = {
    // Fetch courses with optional search filters and pagination.
    // Pass parameters such as subject, level, page, and limit.
    getCourses: (params) => apiClient.get('/courses', { params }),

    // Fetch courses for a specific user (e.g. courses where the user is a tutor or enrolled as a participant).
    getCoursesForUser: (userID) => apiClient.get(`/user/${userID}/courses`),

    // Optionally, create a new course.
    createCourse: (courseData) => apiClient.post('/courses', courseData),
};
