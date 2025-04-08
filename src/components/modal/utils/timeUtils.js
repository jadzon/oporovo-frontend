
/**
 * Calculate the time difference and status text
 * @param {string|Date} startTime - Lesson start time
 * @param {string|Date} endTime - Lesson end time
 * @returns {Object} Time status information
 */
export const calculateTimeStatus = (startTime, endTime) => {
    if (!startTime || !endTime) {
        return {
            timeText: 'Czas nie określony',
            timePercentage: 0
        };
    }

    const lessonStart = new Date(startTime);
    const lessonEnd = new Date(endTime);
    const totalDuration = lessonEnd - lessonStart;
    const now = new Date();

    let diff, prefix, percentage = 0;

    if (now < lessonStart) {
        diff = lessonStart - now;
        prefix = 'Rozpocznie się za: ';
    } else if (now > lessonEnd) {
        diff = now - lessonEnd;
        prefix = 'Lekcja zakończona: ';
        percentage = 100;
    } else {
        diff = now - lessonStart;
        prefix = 'Lekcja trwa: ';
        percentage = (diff / totalDuration) * 100;
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return {
        timeText: `${prefix}${hours}h ${minutes}m ${seconds}s`,
        timePercentage: Math.min(100, percentage)
    };
};

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