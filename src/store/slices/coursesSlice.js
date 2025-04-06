import { createSlice } from '@reduxjs/toolkit';
import { fetchUserCourses } from '../thunks/courseThunks';

const initialState = {
    courses: [],
    loading: false,
    error: null,
};

const coursesSlice = createSlice({
    name: 'courses',
    initialState,
    reducers: {
        clearCoursesError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserCourses.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserCourses.fulfilled, (state, action) => {
                state.loading = false;
                state.courses = action.payload;
            })
            .addCase(fetchUserCourses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearCoursesError } = coursesSlice.actions;
export default coursesSlice.reducer;
