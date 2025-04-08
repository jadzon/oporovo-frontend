/**
 * Returns the appropriate CSS class for status badge
 * @param {string} status - The status string
 * @returns {string} CSS class string for the badge
 */
export const getStatusBadgeColor = (status) => {
    switch(status) {
        case 'scheduled': return 'bg-blue-100 text-blue-800';
        case 'confirmed': return 'bg-green-100 text-green-800';
        case 'in_progress': return 'bg-purple-100 text-purple-800';
        case 'done': return 'bg-teal-100 text-teal-800';
        case 'failed': return 'bg-red-100 text-red-800';
        case 'cancelled': return 'bg-gray-100 text-gray-800';
        default: return 'bg-blue-100 text-blue-800';
    }
};

/**
 * Returns the background color class for status indicator
 * @param {string} status - The status string
 * @returns {string} CSS background color class
 */
export const getStatusColor = (status) => {
    switch (status) {
        case 'confirmed': return 'bg-green-500';
        case 'cancelled': return 'bg-red-500';
        case 'in_progress': return 'bg-purple-500';
        case 'scheduled': return 'bg-blue-500';
        default: return 'bg-gray-500';
    }
};

/**
 * Returns human readable text for a status code
 * @param {string} status - The status string
 * @returns {string} Human readable status text in Polish
 */
export const getStatusText = (status) => {
    switch (status) {
        case 'scheduled': return 'Zaplanowana';
        case 'confirmed': return 'Potwierdzona';
        case 'in_progress': return 'W trakcie';
        case 'done': return 'Zakończona';
        case 'failed': return 'Nieudana';
        case 'cancelled': return 'Anulowana';
        default: return status || 'Nieznany';
    }
};