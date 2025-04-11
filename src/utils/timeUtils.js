/**
 * Utility functions for time calculations and manipulations
 */

/**
 * Calculate the duration between two times in minutes
 * @param {string} startTime - Start time in format "HH:MM"
 * @param {string} endTime - End time in format "HH:MM"
 * @returns {number} Duration in minutes
 */
export const calculateDurationInMinutes = (startTime, endTime) => {
    if (!startTime || !endTime) return 0;

    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);

    const startInMinutes = startHour * 60 + startMinute;
    const endInMinutes = endHour * 60 + endMinute;

    return endInMinutes - startInMinutes;
};

/**
 * Calculate price based on duration and hourly rate
 * @param {string} startTime - Start time in format "HH:MM"
 * @param {string} endTime - End time in format "HH:MM"
 * @param {number} hourlyRate - Hourly rate in currency
 * @returns {number} Total price
 */
export const calculatePrice = (startTime, endTime, hourlyRate) => {
    const durationInMinutes = calculateDurationInMinutes(startTime, endTime);
    const durationInHours = durationInMinutes / 60;
    return hourlyRate * durationInHours;
};

/**
 * Check if a date is today
 * @param {Date|string} date - The date to check
 * @returns {boolean} True if the date is today
 */
export const isToday = (date) => {
    if (!date) return false;

    const dateToCheck = new Date(date);
    const today = new Date();

    return (
        dateToCheck.getDate() === today.getDate() &&
        dateToCheck.getMonth() === today.getMonth() &&
        dateToCheck.getFullYear() === today.getFullYear()
    );
};

/**
 * Check if a date is in the future
 * @param {Date|string} date - The date to check
 * @returns {boolean} True if the date is in the future
 */
export const isFuture = (date) => {
    if (!date) return false;

    const dateToCheck = new Date(date);
    const now = new Date();

    return dateToCheck > now;
};

/**
 * Get remaining time until a date in a human-readable format
 * @param {Date|string} date - The target date
 * @returns {string} Human-readable time remaining
 */
export const getTimeRemaining = (date) => {
    if (!date) return '';

    const targetDate = new Date(date);
    const now = new Date();

    if (targetDate <= now) {
        return 'Już minęło';
    }

    const diffMs = targetDate - now;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (diffDays > 0) {
        return `${diffDays} ${diffDays === 1 ? 'dzień' : diffDays < 5 ? 'dni' : 'dni'}`;
    } else if (diffHours > 0) {
        return `${diffHours} ${diffHours === 1 ? 'godzina' : diffHours < 5 ? 'godziny' : 'godzin'}`;
    } else {
        return `${diffMinutes} ${diffMinutes === 1 ? 'minuta' : diffMinutes < 5 ? 'minuty' : 'minut'}`;
    }
};