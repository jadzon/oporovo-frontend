import React from 'react';
import { Icon } from '../modal/index.js';

export const Card = ({ title, icon, children, className = "" }) => {
    return (
        <div className={`bg-white rounded-lg shadow-sm p-4 ${className}`}>
            {title && (
                <div className="flex items-center gap-2 mb-3">
                    {icon && <Icon name={icon} className="h-4 w-4 text-gray-500" />}
                    <h3 className="text-sm font-medium text-gray-700">{title}</h3>
                </div>
            )}
            {children}
        </div>
    );
};