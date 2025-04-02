// src/hooks/useModal.js
import { useSelector, useDispatch } from 'react-redux';
import {
    openLoginModal,
    closeLoginModal,
    openTutorModal,
    closeTutorModal,
    clearSelectedTutor
} from '../store/slices/modalSlice';

export const useModal = () => {
    const dispatch = useDispatch();

    // Use try-catch to handle potential errors
    try {
        // Be more explicit about the selector and add a fallback
        const modalState = useSelector((state) => {
            // If state.modal is undefined, log an error and return an empty object
            if (!state || !state.modal) {
                console.error('Modal state is missing in Redux store!', state);
                return {};
            }
            return state.modal;
        });

        return {
            isLoginModalOpen: modalState.isLoginModalOpen || false,
            openLoginModal: () => dispatch(openLoginModal()),
            closeLoginModal: () => dispatch(closeLoginModal()),
            isTutorModalOpen: modalState.isTutorModalOpen || false,
            selectedTutor: modalState.selectedTutor || null,
            openTutorModal: (tutor) => dispatch(openTutorModal(tutor)),
            closeTutorModal: () => {
                dispatch(closeTutorModal());
                setTimeout(() => dispatch(clearSelectedTutor()), 300);
            },
        };
    } catch (error) {
        // Log the error but return default values so the app doesn't crash
        console.error('Error in useModal hook:', error);

        // Return a non-functional but non-breaking implementation
        return {
            isLoginModalOpen: false,
            openLoginModal: () => console.warn('Modal functionality unavailable'),
            closeLoginModal: () => {},
            isTutorModalOpen: false,
            selectedTutor: null,
            openTutorModal: () => {},
            closeTutorModal: () => {},
        };
    }
};