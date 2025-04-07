// services/lessonService.js
import apiClient from '../client';

export const lessonService = {
    // Fetch lessons for a user (either as tutor or student)
    getLessonsForUser: (userID) =>
        apiClient.get(`/user/${userID}/lessons`),

    // Get single lesson by ID
    getLessonById: (lessonID) =>
        apiClient.get(`/lessons/${lessonID}`),

    // Create a new lesson (will be in "scheduled" status)
    // Now includes subject and level fields
    createLesson: (lessonData) =>
        apiClient.post('/lessons', {
            tutor_id: lessonData.tutor_id,
            student_ids: lessonData.student_ids,
            title: lessonData.title,
            description: lessonData.description,
            subject: lessonData.subject,          // Include subject
            level: lessonData.level,              // Include level
            start_time: lessonData.start_time,
            end_time: lessonData.end_time
        }),

    // Update lesson state management functions
    confirmLesson: (lessonID) =>
        apiClient.post(`/lessons/${lessonID}/confirm`),

    startLesson: (lessonID) =>
        apiClient.post(`/lessons/${lessonID}/start`),

    completeLesson: (lessonID) =>
        apiClient.post(`/lessons/${lessonID}/complete`),

    failLesson: (lessonID) =>
        apiClient.post(`/lessons/${lessonID}/fail`),

    cancelLesson: (lessonID) =>
        apiClient.post(`/lessons/${lessonID}/cancel`),

    postponeLesson: (lessonID, newStartTime, newEndTime) =>
        apiClient.post(`/lessons/${lessonID}/postpone`, {
            new_start_time: newStartTime,
            new_end_time: newEndTime
        })
};