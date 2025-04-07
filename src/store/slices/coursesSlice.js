// src/slices/coursesSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { fetchUserCourses, enrollCourse } from '../thunks/courseThunks';

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
            })
            .addCase(enrollCourse.pending, (state) => {
                state.loading = true;
            })
            .addCase(enrollCourse.fulfilled, (state, action) => {
                state.loading = false;
                // Replace the enrolled course with the updated version.
                const updatedCourse = action.payload;
                state.courses = state.courses.map((course) =>
                    course.id === updatedCourse.id ? updatedCourse : course
                );
            })
            .addCase(enrollCourse.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearCoursesError } = coursesSlice.actions;
export default coursesSlice.reducer;
