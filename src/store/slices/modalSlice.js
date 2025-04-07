// store/slices/modalSlice.js
import { createSlice } from '@reduxjs/toolkit';

export const MODAL_TYPES = {
    TUTOR: 'TUTOR',
    LESSON: 'LESSON',
    COURSE: 'COURSE',
    CONFIRMATION: 'CONFIRMATION' // Add the confirmation modal type
};

const initialState = {
    isContentModalOpen: false,
    activeModal: null,
    modalData: null,
    modalHistory: [], // For back navigation in modals

    // Confirmation modal specific state
    isConfirmationModalOpen: false,
    confirmationData: {
        title: '',
        message: '',
        type: 'success',
        data: null,
        showViewDetailsButton: false
    }
};

const modalSlice = createSlice({
    name: 'modal',
    initialState,
    reducers: {
        openContentModal: (state, action) => {
            // If there's already an active modal, add it to history
            if (state.activeModal) {
                state.modalHistory.push({
                    type: state.activeModal,
                    data: state.modalData
                });
            }

            state.isContentModalOpen = true;
            state.activeModal = action.payload.type;
            state.modalData = action.payload.data;
        },

        closeContentModal: (state) => {
            state.isContentModalOpen = false;
            state.activeModal = null;
            state.modalData = null;
            state.modalHistory = []; // Clear history when fully closing
        },

        goBackContentModal: (state) => {
            if (state.modalHistory.length > 0) {
                const prevModal = state.modalHistory.pop();
                state.activeModal = prevModal.type;
                state.modalData = prevModal.data;
            } else {
                // If no history, just close
                state.isContentModalOpen = false;
                state.activeModal = null;
                state.modalData = null;
            }
        },

        // Confirmation modal actions
        openConfirmationModal: (state, action) => {
            state.isConfirmationModalOpen = true;
            state.confirmationData = {
                title: action.payload.title || 'Potwierdzenie',
                message: action.payload.message || 'Operacja zakończona pomyślnie',
                type: action.payload.type || 'success',
                data: action.payload.data || null,
                showViewDetailsButton: action.payload.showViewDetailsButton || false
            };
        },

        closeConfirmationModal: (state) => {
            state.isConfirmationModalOpen = false;
            state.confirmationData = initialState.confirmationData;
        }
    }
});

export const {
    openContentModal,
    closeContentModal,
    goBackContentModal,
    openConfirmationModal,
    closeConfirmationModal
} = modalSlice.actions;

export default modalSlice.reducer;