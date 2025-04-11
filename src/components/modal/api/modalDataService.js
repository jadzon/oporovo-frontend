// modalDataService.js
// Centralized API service for modal data
import { lessonService } from '../../../api/services/lessonService';
import { tutorService } from '../../../api/services/tutorService';
import { courseService } from '../../../api/services/courseService';
import { tutorAvailabilityService } from '../../../api/services/tutorAvailabilityService';

/**
 * Centralized data fetching service for modals
 * Aggregates all API calls needed by the modal components
 */
export const modalDataService = {
    // LESSON DATA
    getLesson: async (lessonId) => {
        try {
            const response = await lessonService.getLessonById(lessonId);
            return response.data;
        } catch (error) {
            console.error('Error fetching lesson:', error);
            throw error;
        }
    },

    confirmLesson: async (lessonId) => {
        try {
            const response = await lessonService.confirmLesson(lessonId);
            return response.data;
        } catch (error) {
            console.error('Error confirming lesson:', error);
            throw error;
        }
    },

    cancelLesson: async (lessonId) => {
        try {
            const response = await lessonService.cancelLesson(lessonId);
            return response.data;
        } catch (error) {
            console.error('Error canceling lesson:', error);
            throw error;
        }
    },

    postponeLesson: async (lessonId, newStartTime, newEndTime) => {
        try {
            const response = await lessonService.postponeLesson(lessonId, newStartTime, newEndTime);
            return response.data;
        } catch (error) {
            console.error('Error postponing lesson:', error);
            throw error;
        }
    },

    createLesson: async (lessonData) => {
        try {
            const response = await lessonService.createLesson(lessonData);
            return response.data;
        } catch (error) {
            console.error('Error creating lesson:', error);
            throw error;
        }
    },

    // TUTOR DATA
    // TUTOR DATA
    getTutor: async (tutorId) => {
        try {
            console.log('Fetching tutor with ID:', tutorId);

            // Try to get directly by ID if available
            const response = await tutorService.searchTutors({ id: tutorId });
            console.log('Tutor search response:', response);

            // Handle different possible response structures
            if (response && response.data) {
                // Case 1: data is an array
                if (Array.isArray(response.data) && response.data.length > 0) {
                    console.log('Found tutor in array response');
                    console.log(response.data[0])
                    return response.data[0];
                }

                // Case 2: data is a direct object
                if (typeof response.data === 'object' && response.data !== null) {
                    if (response.data.id || response.data.username || response.data.first_name) {
                        console.log('Found tutor in object response');
                        return response.data;
                    }
                }

                // Case 3: data might be nested differently
                if (response.data.tutors && Array.isArray(response.data.tutors) && response.data.tutors.length > 0) {
                    console.log('Found tutor in nested response');
                    return response.data.tutors[0];
                }
            }
            return null;
        } catch (error) {
            console.error('Error fetching tutor:', error);

            throw error;
        }
    },

    getTutorAvailability: async (tutorId, startDate, endDate) => {
        try {
            const response = await tutorAvailabilityService.getAvailability(
                tutorId,
                startDate,
                endDate
            );
            return response.data;
        } catch (error) {
            console.error('Error fetching tutor availability:', error);
            throw error;
        }
    },

    // COURSE DATA
    getCourse: async (courseId) => {
        try {
            const response = await courseService.getCourses({ id: courseId });
            return response.data && response.data.length > 0 ? response.data[0] : null;
        } catch (error) {
            console.error('Error fetching course:', error);
            throw error;
        }
    },

    enrollCourse: async (courseId) => {
        try {
            const response = await courseService.enrollCourse(courseId);
            return response.data;
        } catch (error) {
            console.error('Error enrolling in course:', error);
            throw error;
        }
    }
};