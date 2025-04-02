// src/store/slices/modalSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isLoginModalOpen: false,
    isTutorModalOpen: false,
    selectedTutor: null,
};

const modalSlice = createSlice({
    name: 'modal',
    initialState,
    reducers: {
        openLoginModal: (state) => {
            state.isLoginModalOpen = true;
        },
        closeLoginModal: (state) => {
            state.isLoginModalOpen = false;
        },
        openTutorModal: (state, action) => {
            state.selectedTutor = action.payload;
            state.isTutorModalOpen = true;
        },
        closeTutorModal: (state) => {
            state.isTutorModalOpen = false;
        },
        clearSelectedTutor: (state) => {
            state.selectedTutor = null;
        }
    },
});

export const {
    openLoginModal,
    closeLoginModal,
    openTutorModal,
    closeTutorModal,
    clearSelectedTutor
} = modalSlice.actions;

export default modalSlice.reducer;