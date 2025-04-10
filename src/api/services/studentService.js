import apiClient from '../client';

export const studentService = {
    // Fetch students for a specific tutor
    getStudentsForTutor: (tutorID) =>
        apiClient.get(`/tutors/${tutorID}/students`),
};