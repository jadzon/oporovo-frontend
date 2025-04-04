import { createAsyncThunk } from '@reduxjs/toolkit';
import { lessonService } from '../../api/services/lessonService';

// Thunk to fetch lessons for a user
export const fetchUserLessons = createAsyncThunk(
    'lessons/fetchUserLessons',
    async (userID, { rejectWithValue }) => {
        try {
            const response = await lessonService.getLessonsForUser(userID);
            return response.data; // assuming your API returns an array of lesson DTOs
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to fetch lessons'
            );
        }
    }
);

// Thunk to create a new lesson
export const createNewLesson = createAsyncThunk(
    'lessons/createNewLesson',
    async (lessonData, { rejectWithValue }) => {
        try {
            const response = await lessonService.createLesson(lessonData);
            return response.data; // assuming your API returns the created lesson DTO
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to create lesson'
            );
        }
    }
);