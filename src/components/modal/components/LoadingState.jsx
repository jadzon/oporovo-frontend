import React from 'react';

const LoadingState = ({
                          message = 'Ładowanie...',
                          size = 'default' // 'small', 'default', 'large'
                      }) => {
    // Size classes
    const sizeClasses = {
        small: 'h-4 w-4',
        default: 'h-10 w-10',
        large: 'h-16 w-16'
    };

    const textSizes = {
        small: 'text-xs',
        default: 'text-sm',
        large: 'text-base'
    };

    const containerClasses = {
        small: 'p-2',
        default: 'p-6',
        large: 'p-10'
    };

    return (
        <div className={`flex flex-col items-center justify-center flex-1 ${containerClasses[size]}`}>
            <svg
                className={`animate-spin text-blue-600 mb-4 ${sizeClasses[size]}`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
            >
                <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                />
                <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
            </svg>
            {message && (
                <p className={`text-gray-600 ${textSizes[size]}`}>{message}</p>
            )}
        </div>
    );
};

export default LoadingState;