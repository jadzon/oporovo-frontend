import React from 'react';
import { Icon } from '../../../utils/Icon.jsx';

const ModalSection = ({
                          title,
                          icon,
                          children,
                          actions,
                          variant = 'default', // 'default', 'card', 'flush'
                          className = ''
                      }) => {
    // Variant classes
    const variantClasses = {
        default: 'px-4 py-3',
        card: 'p-4 bg-white rounded-lg shadow-sm border border-gray-100 mb-4',
        flush: 'py-3' // No horizontal padding
    };

    return (
        <div className={`${variantClasses[variant]} ${className}`}>
            {/* Section header with title and icon */}
            {(title || actions) && (
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        {icon && <Icon name={icon} className="h-4 w-4 text-gray-500" />}
                        {title && <h3 className="text-sm font-medium text-gray-700">{title}</h3>}
                    </div>

                    {/* Optional action buttons */}
                    {actions && (
                        <div className="flex items-center gap-2">
                            {actions}
                        </div>
                    )}
                </div>
            )}

            {/* Section content */}
            {children}
        </div>
    );
};

export default ModalSection;