import { createSlice } from '@reduxjs/toolkit';
import { fetchStudentsForTutor } from '../thunks/studentsThunks';

const initialState = {
    students: [],
    loading: false,
    error: null,
};

const studentsSlice = createSlice({
    name: 'students',
    initialState,
    reducers: {
        clearStudentsError: (state) => {
            state.error = null;
        },
        setStudents: (state, action) => {
            state.students = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchStudentsForTutor.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchStudentsForTutor.fulfilled, (state, action) => {
                state.loading = false;
                state.students = action.payload;
            })
            .addCase(fetchStudentsForTutor.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearStudentsError, setStudents } = studentsSlice.actions;
export default studentsSlice.reducer;