// Component for displaying lesson status with consistent styling
import React from 'react';
import { Icon } from '../modal/index.js';
import { getStatusInfo, getStatusSizeClasses } from '../../utils/dateTimeUtils.js';

export const StatusBadge = ({
                                status,
                                showIcon = true,
                                size = "md",
                                className = "",
                                iconClassName = "",
                                textClassName = ""
                            }) => {
    const statusInfo = getStatusInfo(status);
    const sizeClasses = getStatusSizeClasses(size);

    return (
        <span
            className={`font-medium inline-flex items-center ${statusInfo.color} ${sizeClasses.container} ${className}`}
        >
            {showIcon && statusInfo.icon && (
                <Icon
                    name={statusInfo.icon}
                    className={`${sizeClasses.icon} ${iconClassName}`}
                />
            )}
            <span className={textClassName}>{statusInfo.text}</span>
        </span>
    );
};

export default StatusBadge;