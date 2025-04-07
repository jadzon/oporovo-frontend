// hooks/useModal.js
import { useDispatch, useSelector } from 'react-redux';
import {
    openContentModal,
    closeContentModal,
    goBackContentModal,
    openConfirmationModal,
    closeConfirmationModal,
    openLoginModal,      // dodajemy akcję otwierania modala logowania
    closeLoginModal,     // dodajemy akcję zamykania modala logowania
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
        confirmationData,
        isLoginModalOpen     // pobieramy stan modala logowania
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

    // Login modal functions
    const triggerOpenLoginModal = () => dispatch(openLoginModal());
    const triggerCloseLoginModal = () => dispatch(closeLoginModal());

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
        closeConfirmationModal: () => dispatch(closeConfirmationModal()),

        // Login modal state and functions
        isLoginModalOpen,
        openLoginModal: triggerOpenLoginModal,
        closeLoginModal: triggerCloseLoginModal
    };
};
