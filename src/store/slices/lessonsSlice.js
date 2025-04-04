import { createSlice } from '@reduxjs/toolkit';
import { fetchUserLessons, createNewLesson } from '../thunks/lessonThunks';

const initialState = {
    lessons: [],
    loading: false,
    error: null,
};

const lessonsSlice = createSlice({
    name: 'lessons',
    initialState,
    reducers: {
        clearLessonsError: (state) => {
            state.error = null;
        },
        // Optionally, an action to update a single lesson in the store
        updateLesson: (state, action) => {
            const updatedLesson = action.payload;
            const index = state.lessons.findIndex(
                (lesson) => lesson.id === updatedLesson.id
            );
            if (index !== -1) {
                state.lessons[index] = updatedLesson;
            }
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch user lessons cases
            .addCase(fetchUserLessons.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserLessons.fulfilled, (state, action) => {
                state.loading = false;
                state.lessons = action.payload;
            })
            .addCase(fetchUserLessons.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Create new lesson cases
            .addCase(createNewLesson.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createNewLesson.fulfilled, (state, action) => {
                state.loading = false;
                state.lessons.push(action.payload);
            })
            .addCase(createNewLesson.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearLessonsError, updateLesson } = lessonsSlice.actions;
export default lessonsSlice.reducer;