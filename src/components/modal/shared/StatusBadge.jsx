// components/modal/shared/StatusBadge.jsx
import React from 'react';
import { statusUtils } from '../utils';

/**
 * Reusable status badge component
 */
const StatusBadge = ({ status, showText = true, size = 'md' }) => {
    const sizeClasses = {
        sm: 'w-2 h-2',
        md: 'w-3 h-3',
        lg: 'w-4 h-4'
    };

    const textSizeClasses = {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base'
    };

    return (
        <div className="flex items-center gap-2">
            <span className={`${statusUtils.getStatusColor(status)} ${sizeClasses[size]} rounded-full`} />
            {showText && (
                <p className={`text-gray-900 font-medium ${textSizeClasses[size]}`}>
                    {statusUtils.getStatusText(status)}
                </p>
            )}
        </div>
    );
};

export default StatusBadge;