// hooks/useModal.js
import { useDispatch, useSelector } from 'react-redux';
import {
    openContentModal,
    closeContentModal,
    goBackContentModal,
    openConfirmationModal,
    closeConfirmationModal,
    MODAL_TYPES
} from '../store/slices/modalSlice';

export const useModal = () => {
    const dispatch = useDispatch();
    const {
        isContentModalOpen,
        activeModal,
        modalData,
        modalHistory,
        isConfirmationModalOpen,
        confirmationData
    } = useSelector(state => state.modal);

    // Content modal functions
    const openTutorModal = (tutor) => {
        dispatch(openContentModal({ type: MODAL_TYPES.TUTOR, data: tutor }));
    };

    const openLessonModal = (lesson) => {
        dispatch(openContentModal({ type: MODAL_TYPES.LESSON, data: lesson }));
    };

    const openCourseModal = (course) => {
        dispatch(openContentModal({ type: MODAL_TYPES.COURSE, data: course }));
    };

    // Confirmation modal functions
    const openSuccessConfirmation = ({
                                         title = 'Sukces',
                                         message = 'Operacja zakończona pomyślnie',
                                         data = null,
                                         showViewDetailsButton = false
                                     }) => {
        dispatch(openConfirmationModal({
            title,
            message,
            type: 'success',
            data,
            showViewDetailsButton
        }));
    };

    const openLessonCreatedConfirmation = (lesson) => {
        dispatch(openConfirmationModal({
            title: 'Lekcja utworzona',
            message: 'Twoja lekcja została pomyślnie zaplanowana',
            type: 'lesson-created',
            data: {
                title: lesson.title,
                status: lesson.status,
                startTime: lesson.start_time,
                subject: lesson.subject,
                level: lesson.level
            },
            lessonObject: lesson, // Store the full lesson object for navigation
            showViewDetailsButton: true
        }));
    };

    // Generic error confirmation
    const openErrorConfirmation = ({
                                       title = 'Błąd',
                                       message = 'Wystąpił błąd podczas wykonywania operacji',
                                       data = null
                                   }) => {
        dispatch(openConfirmationModal({
            title,
            message,
            type: 'error',
            data
        }));
    };

    return {
        // Content modal state and functions
        isContentModalOpen,
        activeModal,
        modalData,
        hasModalHistory: modalHistory.length > 0,
        openTutorModal,
        openLessonModal,
        openCourseModal,
        closeContentModal: () => dispatch(closeContentModal()),
        goBackContentModal: () => dispatch(goBackContentModal()),

        // Confirmation modal state and functions
        isConfirmationModalOpen,
        confirmationData,
        openSuccessConfirmation,
        openLessonCreatedConfirmation,
        openErrorConfirmation,
        closeConfirmationModal: () => dispatch(closeConfirmationModal())
    };
};