// store/slices/modalSlice.js
import { createSlice } from '@reduxjs/toolkit';

// Modal types for content modals
export const MODAL_TYPES = {
    TUTOR: 'tutor',
    LESSON: 'lesson',
    COURSE: 'course',
};

const initialState = {
    // Login modal (separate system)
    isLoginModalOpen: false,

    // Content modals (unified system)
    activeModal: null,       // Current active modal type (tutor, lesson, course)
    modalData: null,         // Data for the current modal
    modalHistory: [],        // History stack for modal navigation
    isContentModalOpen: false, // Whether any content modal is open
};

const modalSlice = createSlice({
    name: 'modal',
    initialState,
    reducers: {
        // Login modal actions (separate)
        openLoginModal: (state) => {
            state.isLoginModalOpen = true;
        },
        closeLoginModal: (state) => {
            state.isLoginModalOpen = false;
        },

        // Content modal actions (unified)
        openContentModal: (state, action) => {
            const { modalType, data } = action.payload;

            // If a content modal is already open, push it to history
            if (state.activeModal) {
                state.modalHistory.push({
                    type: state.activeModal,
                    data: state.modalData
                });
            }

            state.activeModal = modalType;
            state.modalData = data;
            state.isContentModalOpen = true;
        },

        // Go back to previous modal in history
        goBackContentModal: (state) => {
            if (state.modalHistory.length > 0) {
                const previousModal = state.modalHistory.pop();
                state.activeModal = previousModal.type;
                state.modalData = previousModal.data;
            } else {
                // If no history, close the modal
                state.activeModal = null;
                state.modalData = null;
                state.isContentModalOpen = false;
            }
        },

        // Close all content modals and clear history
        closeContentModal: (state) => {
            state.activeModal = null;
            state.modalData = null;
            state.modalHistory = [];
            state.isContentModalOpen = false;
        }
    },
});

export const {
    openLoginModal,
    closeLoginModal,
    openContentModal,
    goBackContentModal,
    closeContentModal
} = modalSlice.actions;

export default modalSlice.reducer;