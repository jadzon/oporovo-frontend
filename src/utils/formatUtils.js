/**
 * Utility functions for formatting data in consistent ways
 */

/**
 * Format price to display with 2 decimal places and PLN
 * @param {number} price - The price to format
 * @returns {string} Formatted price string with currency
 */
export const formatPrice = (price) => {
    return `${price.toFixed(2)} zł`;
};

/**
 * Format date to Polish locale string
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date string
 */
export const formatDate = (date) => {
    if (!date) return 'Nie określono';
    return new Date(date).toLocaleDateString('pl-PL', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
};

/**
 * Format date and time to Polish locale string
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date and time string
 */
export const formatDateTime = (date) => {
    if (!date) return 'Nie określono';
    return new Date(date).toLocaleString('pl-PL', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

/**
 * Format time to hours:minutes
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted time string
 */
export const formatTime = (date) => {
    if (!date) return 'Nie określono';
    return new Date(date).toLocaleTimeString('pl-PL', {
        hour: '2-digit',
        minute: '2-digit'
    });
};