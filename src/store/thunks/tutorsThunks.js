import { createAsyncThunk } from '@reduxjs/toolkit';
import { tutorService } from '../../api/services/tutorService';

export const fetchUserTutors = createAsyncThunk(
    'tutors/fetchUserTutors',
    async (userID, { rejectWithValue }) => {
        try {
            const response = await tutorService.getTutorsForUser(userID);
            return response.data; // assuming your API returns an array of tutor DTOs
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to fetch tutors'
            );
        }
    }
);
