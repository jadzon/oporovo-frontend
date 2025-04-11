// Main container component for the modal system
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useModal } from './useModal';
import LessonDetailsView from '../views/LessonDetailsView';
import CourseDetailsView from '../views/CourseDetailsView';
import ScheduleFormView from '../views/ScheduleFormView';
import ConfirmationView from '../views/ConfirmationView';
import LoadingState from '../components/LoadingState';
import { Icon } from '../components/Icon';

/**
 * Main modal component that renders different content based on modal type
 * Handles animations, backdrop clicks, and keyboard shortcuts
 */
const Modal = () => {
    const {
        isOpen,
        modalType,
        modalId,
        closeModal,
        confirmationData,
        hideConfirmation
    } = useModal();

    // Local state to track if a confirmation is being shown
    // This ensures confirmation stays visible until user explicitly dismisses it
    const [showingConfirmation, setShowingConfirmation] = useState(false);
    const [localConfirmationData, setLocalConfirmationData] = useState(null);

    // Handle escape key press to close modal
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isOpen) {
                if (showingConfirmation) {
                    // If showing confirmation, just clear the confirmation
                    handleConfirmationClose();
                } else {
                    // Otherwise close the entire modal
                    closeModal();
                }
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            // Prevent scrolling on the body when modal is open
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'auto';
        };
    }, [isOpen, closeModal, showingConfirmation]);

    // Reset confirmation state when modal closes
    useEffect(() => {
        if (!isOpen) {
            setShowingConfirmation(false);
            setLocalConfirmationData(null);
        }
    }, [isOpen]);

    // Update local confirmation state when confirmationData changes
    useEffect(() => {
        if (confirmationData) {
            setShowingConfirmation(true);
            setLocalConfirmationData(confirmationData);
        }
    }, [confirmationData]);

    // Handle confirmation closing
    const handleConfirmationClose = () => {
        setShowingConfirmation(false);
        setLocalConfirmationData(null);
        hideConfirmation(); // Make sure to clear the confirmation data in the global state
    };

    // Render the appropriate component based on modal type
    const renderContent = () => {
        // Priority: show confirmation over other content if it exists
        if (showingConfirmation && localConfirmationData) {
            return (
                <ConfirmationView
                    data={localConfirmationData}
                    onClose={handleConfirmationClose}
                />
            );
        }

        // Otherwise, show content based on modal type
        switch (modalType) {
            case 'lesson':
                return <LessonDetailsView lessonId={modalId} />;
            case 'course':
                return <CourseDetailsView courseId={modalId} />;
            case 'schedule':
                return <ScheduleFormView tutorId={modalId} />;
            default:
                return <LoadingState message="Loading content..." />;
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence mode="wait">
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => {
                            if (showingConfirmation) {
                                handleConfirmationClose();
                            } else {
                                closeModal();
                            }
                        }}
                    />

                    {/* Modal container */}
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
                        <motion.div
                            className="bg-white rounded-xl shadow-lg w-full max-w-4xl border border-gray-200 h-[85vh] max-h-[800px] overflow-hidden flex flex-col relative"
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Absolute positioned close button */}
                            <button
                                onClick={closeModal}
                                className="absolute top-3 right-3 p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors z-20"
                                aria-label="Zamknij"
                            >
                                <Icon name="close" className="h-5 w-5" />
                            </button>

                            {renderContent()}
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};

export default Modal;