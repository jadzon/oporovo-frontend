// services/userService.js
import apiClient from '../client';
import { ENDPOINTS } from '../constants';

export const userService = {
    // Get current authenticated user
    getCurrentUser: () =>
        apiClient.get(ENDPOINTS.AUTH.ME),

    // Get user by ID (for profiles)
    getUserById: (userID) =>
        apiClient.get(ENDPOINTS.USER.PROFILE(userID)),

    // Update user profile (could be added later)
    updateUserProfile: (userID, userData) =>
        apiClient.put(ENDPOINTS.USER.UPDATE(userID), userData),
};