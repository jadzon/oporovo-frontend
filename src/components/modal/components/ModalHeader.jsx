// Header component for the modal with title, back button, and close button
import React from 'react';
import { useModal } from '../core/useModal';
import { Icon } from '../../../utils/Icon.jsx';

const ModalHeader = ({
                         title,
                         onClose,
                         showBackButton = false
                     }) => {
    const { goBack } = useModal();

    // Use provided onClose function or the one from useModal
    const handleClose = onClose || useModal().closeModal;

    return (
        <div className="px-4 py-3 flex items-center justify-between bg-white sticky top-0 z-10 border-b border-gray-100 shadow-sm">
            <div className="flex items-center gap-2">
                {showBackButton && (
                    <button
                        onClick={goBack}
                        className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
                        aria-label="Wróć"
                    >
                        <Icon name="back" className="h-5 w-5" />
                    </button>
                )}
                <h2 className="text-lg font-medium text-gray-900">{title}</h2>
            </div>

            <button
                onClick={handleClose}
                className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Zamknij"
            >
                <Icon name="close" className="h-5 w-5" />
            </button>
        </div>
    );
};

export default ModalHeader;