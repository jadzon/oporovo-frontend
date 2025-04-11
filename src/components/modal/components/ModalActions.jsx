import React from 'react';
import { Icon } from './Icon';

const ModalActions = ({
                          primaryAction = null,
                          secondaryAction = null,
                          tertiaryAction = null,
                          position = 'bottom', // 'bottom', 'top', 'inline'
                          className = ''
                      }) => {
    // Position classes
    const positionClasses = {
        bottom: 'sticky bottom-0 left-0 right-0 px-4 py-3 bg-white border-t border-gray-100 shadow-sm z-10',
        top: 'sticky top-0 left-0 right-0 px-4 py-3 bg-white border-b border-gray-100 shadow-sm z-10',
        inline: 'mt-4'
    };

    // Function to render a button with icon
    const renderButton = (action, variant = 'primary') => {
        if (!action) return null;

        // Button variants
        const variants = {
            primary: 'bg-black hover:bg-gray-800 text-white',
            secondary: 'bg-white border border-gray-300 hover:bg-gray-50 text-gray-700',
            tertiary: 'text-gray-500 hover:text-gray-700 hover:bg-gray-50',
        };

        const { label, icon, onClick, disabled = false } = action;

        return (
            <button
                onClick={onClick}
                disabled={disabled}
                className={`
          ${variants[variant]} 
          flex items-center justify-center gap-2 px-4 py-2 
          rounded-full text-sm font-medium transition-colors
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
            >
                {icon && <Icon name={icon} className="h-4 w-4" />}
                {label}
            </button>
        );
    };

    // Don't render if no actions
    if (!primaryAction && !secondaryAction && !tertiaryAction) {
        return null;
    }

    return (
        <div className={`${positionClasses[position]} ${className}`}>
            <div className="flex items-center justify-end gap-3">
                {tertiaryAction && renderButton(tertiaryAction, 'tertiary')}
                {secondaryAction && renderButton(secondaryAction, 'secondary')}
                {primaryAction && renderButton(primaryAction, 'primary')}
            </div>
        </div>
    );
};

export default ModalActions;