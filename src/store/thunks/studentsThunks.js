import { createAsyncThunk } from '@reduxjs/toolkit';
import { studentService } from '../../api/services/studentService';

export const fetchStudentsForTutor = createAsyncThunk(
    'students/fetchStudentsForTutor',
    async (tutorID, { rejectWithValue }) => {
        try {
            const response = await studentService.getStudentsForTutor(tutorID);
            return response.data; // assuming your API returns an array of student DTOs
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to fetch students'
            );
        }
    }
);