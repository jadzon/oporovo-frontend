// Custom hook for accessing modal functionality
import { useContext, useCallback } from 'react';
import { ModalContext } from './ModalProvider';

/**
 * Custom hook for accessing and controlling modal state
 * Provides methods to open, close, and navigate between modal views
 */
export const useModal = () => {
    const context = useContext(ModalContext);

    if (!context) {
        throw new Error('useModal must be used within a ModalProvider');
    }

    const {
        state,
        dispatch,
        navigateToView
    } = context;

    // Specialized open functions for different content types
    const openLessonModal = useCallback((lessonId) => {
        console.log("openLessonModal", lessonId);
        dispatch({
            type: 'OPEN_MODAL',
            payload: {
                type: 'lesson',
                id: lessonId
            }
        });
    }, [dispatch]);

    const openCourseModal = useCallback((courseId) => {
        dispatch({
            type: 'OPEN_MODAL',
            payload: {
                type: 'course',
                id: courseId
            }
        });
    }, [dispatch]);

    const openScheduleModal = useCallback((tutorId) => {
        dispatch({
            type: 'OPEN_MODAL',
            payload: {
                type: 'schedule',
                id: tutorId
            }
        });
    }, [dispatch]);

    // General close function
    const closeModal = useCallback(() => {
        dispatch({ type: 'CLOSE_MODAL' });
    }, [dispatch]);

    // Navigate between views within a modal
    const changeView = useCallback((newView, params = {}) => {
        navigateToView(newView, params);
    }, [navigateToView]);

    // Navigate back in history
    const goBack = useCallback(() => {
        dispatch({ type: 'GO_BACK' });
    }, [dispatch]);

    // Show a confirmation view
    const showConfirmation = useCallback((confirmationData) => {
        dispatch({
            type: 'SHOW_CONFIRMATION',
            payload: confirmationData
        });
    }, [dispatch]);

    // Show a lesson created confirmation and return to main view
    const showLessonCreatedConfirmation = useCallback((lessonData) => {
        dispatch({
            type: 'SHOW_CONFIRMATION',
            payload: {
                type: 'lesson-created',
                title: 'Lekcja utworzona',
                message: 'Twoja lekcja została pomyślnie zaplanowana',
                data: lessonData,
                showViewDetailsButton: true
            }
        });
    }, [dispatch]);

    return {
        // State
        isOpen: state.isOpen,
        modalType: state.type,
        modalId: state.id,
        currentView: state.view,
        historyStack: state.history,
        confirmationData: state.confirmationData,

        // Actions
        openLessonModal,
        openCourseModal,
        openScheduleModal,
        closeModal,
        changeView,
        goBack,
        showConfirmation,
        showLessonCreatedConfirmation
    };
};