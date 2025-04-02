import apiClient from '../client';
import { ENDPOINTS } from '../constants';

export const authService = {
    discordLogin: () => {
        window.location.href = ENDPOINTS.AUTH.DISCORD;
    },

    getCurrentUser: () => apiClient.get(ENDPOINTS.AUTH.ME),

    logout: () => apiClient.post(ENDPOINTS.AUTH.LOGOUT),

    refreshToken: () => apiClient.post(ENDPOINTS.AUTH.REFRESH),
};