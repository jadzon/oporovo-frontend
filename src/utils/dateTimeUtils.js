// Utility functions for date and time formatting and status styling

// Date and time formatting functions
export const formatDate = (date) => {
    return date.toLocaleDateString("pl-PL", {
        day: "numeric",
        month: "short",
    });
};

export const formatTime = (date) => {
    return date.toLocaleTimeString("pl-PL", {
        hour: "2-digit",
        minute: "2-digit",
    });
};

export const calculateDurationMinutes = (startTime, endTime) => {
    const durationMs = endTime - startTime;
    return Math.floor(durationMs / 60000);
};

export const isToday = (date) => {
    const today = new Date();
    return (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
    );
};

// Status styling functions
export const getStatusInfo = (status) => {
    // Map status to text, icon, and colors
    const statusMapping = {
        scheduled: {
            text: "Zaplanowana",
            color: "bg-blue-50 text-blue-600",
            icon: "calendar"
        },
        confirmed: {
            text: "Potwierdzona",
            color: "bg-green-50 text-green-600",
            icon: "check-circle"
        },
        in_progress: {
            text: "W trakcie",
            color: "bg-yellow-50 text-yellow-600",
            icon: "play"
        },
        done: {
            text: "Zakończona",
            color: "bg-gray-50 text-gray-600",
            icon: "check"
        },
        failed: {
            text: "Nieudana",
            color: "bg-red-50 text-red-600",
            icon: "x-circle"
        },
        cancelled: {
            text: "Anulowana",
            color: "bg-gray-100 text-gray-600",
            icon: "x"
        }
    };

    // Get info for the current status or use default
    return statusMapping[status] || {
        text: "Nieznany",
        color: "bg-gray-100 text-gray-600",
        icon: "info"
    };
};

// Function to get size-related classes for status badges
export const getStatusSizeClasses = (size = "md") => {
    const sizeClasses = {
        xs: {
            container: "text-xs py-0.5 px-2",
            icon: "h-3 w-3 mr-1"
        },
        sm: {
            container: "text-xs py-1 px-2.5",
            icon: "h-3.5 w-3.5 mr-1.5"
        },
        md: {
            container: "text-sm py-1 px-2.5",
            icon: "h-4 w-4 mr-1.5"
        },
        lg: {
            container: "text-sm py-1.5 px-3",
            icon: "h-4.5 w-4.5 mr-2"
        }
    };

    return sizeClasses[size] || sizeClasses.md;
};