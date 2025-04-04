import apiClient from '../client';

export const lessonService = {
    // Fetch lessons for a user (either as tutor or student)
    getLessonsForUser: (userID) =>
        apiClient.get(`/user/${userID}/lessons`),

    // Create a new lesson
    createLesson: (lessonData) =>
        apiClient.post('/lessons', lessonData),
};