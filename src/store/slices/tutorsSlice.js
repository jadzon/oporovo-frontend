import { createSlice } from '@reduxjs/toolkit';
import { fetchUserTutors } from '../thunks/tutorsThunks.js';

const initialState = {
    tutors: [],
    loading: false,
    error: null,
};

const tutorsSlice = createSlice({
    name: 'tutors',
    initialState,
    reducers: {
        clearTutorsError: (state) => {
            state.error = null;
        },
        // Optionally, you can add actions to update or clear tutors
        setTutors: (state, action) => {
            state.tutors = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserTutors.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserTutors.fulfilled, (state, action) => {
                state.loading = false;
                state.tutors = action.payload;
            })
            .addCase(fetchUserTutors.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearTutorsError, setTutors } = tutorsSlice.actions;
export default tutorsSlice.reducer;