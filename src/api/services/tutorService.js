import apiClient from '../client';

export const tutorService = {
    // Fetch tutors for a user (tutors from lessons where the user is a student)
    getTutorsForUser: (userID) =>
        apiClient.get(`/user/${userID}/tutors`),
};