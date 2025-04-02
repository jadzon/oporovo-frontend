// store/slices/authSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { getCurrentUser, logout } from '../thunks/authThunks';

// Try to get any stored user data from localStorage
const storedUser = localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user'))
    : null;

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: storedUser,
        isAuthenticated: !!storedUser,
        loading: false,
        error: null,
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // Handle getCurrentUser
        builder
            .addCase(getCurrentUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getCurrentUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.isAuthenticated = !!action.payload;

                // Save user data to localStorage
                if (action.payload) {
                    localStorage.setItem('user', JSON.stringify(action.payload));
                }
            })
            .addCase(getCurrentUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.user = null;
                state.isAuthenticated = false;

                // Clear localStorage if authentication fails
                localStorage.removeItem('user');
            });

        // Handle logout
        builder
            .addCase(logout.pending, (state) => {
                state.loading = true;
            })
            .addCase(logout.fulfilled, (state) => {
                state.loading = false;
                state.user = null;
                state.isAuthenticated = false;

                // Clear localStorage on logout
                localStorage.removeItem('user');
            })
            .addCase(logout.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                // We don't clear the user here so they can retry logout if it failed
            });
    },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;