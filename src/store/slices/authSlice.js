// store/slices/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,
    },
    reducers: {
        // Define simple reducers
        clearError: (state) => {
            state.error = null;
        },
    },
    // Remove extraReducers temporarily to isolate issues
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;