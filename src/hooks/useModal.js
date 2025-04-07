import { useSelector, useDispatch } from 'react-redux';
import {
    openLoginModal,
    closeLoginModal,
    openContentModal,
    goBackContentModal,
    closeContentModal,
    MODAL_TYPES
} from '../store/slices/modalSlice';

export const useModal = () => {
    const dispatch = useDispatch();

    // Use try-catch to handle potential errors in case Redux store isn't set up yet
    try {
        const modalState = useSelector((state) => {
            if (!state || !state.modal) {
                console.error('Modal state is missing in Redux store!', state);
                return {};
            }
            return state.modal;
        });

        return {
            // Login modal state and actions (separate system)
            isLoginModalOpen: modalState.isLoginModalOpen || false,
            openLoginModal: () => dispatch(openLoginModal()),
            closeLoginModal: () => dispatch(closeLoginModal()),

            // Content modal state (unified system)
            activeModal: modalState.activeModal,
            modalData: modalState.modalData,
            isContentModalOpen: modalState.isContentModalOpen || false,
            hasModalHistory: (modalState.modalHistory?.length > 0) || false,

            // General content modal actions
            openContentModal: (modalType, data) =>
                dispatch(openContentModal({ modalType, data })),
            goBackContentModal: () => dispatch(goBackContentModal()),
            closeContentModal: () => dispatch(closeContentModal()),

            // Convenience methods for specific modal types
            openTutorModal: (tutor) =>
                dispatch(openContentModal({ modalType: MODAL_TYPES.TUTOR, data: tutor })),

            openLessonModal: (lesson) =>
                dispatch(openContentModal({ modalType: MODAL_TYPES.LESSON, data: lesson })),

            openCourseModal: (course) =>
                dispatch(openContentModal({ modalType: MODAL_TYPES.COURSE, data: course })),
        };
    } catch (error) {
        console.error('Error in useModal hook:', error);

        // Return non-functional but non-breaking implementation
        return {
            isLoginModalOpen: false,
            openLoginModal: () => console.warn('Modal functionality unavailable'),
            closeLoginModal: () => {},
            activeModal: null,
            modalData: null,
            isContentModalOpen: false,
            hasModalHistory: false,
            openContentModal: () => {},
            goBackContentModal: () => {},
            closeContentModal: () => {},
            openTutorModal: () => {},
            openLessonModal: () => {},
            openCourseModal: () => {},
        };
    }
};

export default useModal;