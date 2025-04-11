// Main container component for the modal system
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useModal } from './useModal';
import LessonDetailsView from '../views/LessonDetailsView';
import CourseDetailsView from '../views/CourseDetailsView';
import ScheduleFormView from '../views/ScheduleFormView';
import ConfirmationView from '../views/ConfirmationView';
import LoadingState from '../components/LoadingState';

/**
 * Main modal component that renders different content based on modal type
 * Handles animations, backdrop clicks, and keyboard shortcuts
 */
const Modal = () => {
    const {
        isOpen,
        modalType,
        modalId,
        currentView,
        closeModal,
        confirmationData
    } = useModal();

    // Handle escape key press to close modal
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isOpen) {
                closeModal();
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
    }, [isOpen, closeModal]);

    // Render the appropriate component based on modal type
    const renderContent = () => {
        // If we have confirmation data, show the confirmation view
        if (confirmationData) {
            return <ConfirmationView data={confirmationData} />;
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
                        onClick={closeModal}
                    />

                    {/* Modal container */}
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
                        <motion.div
                            className="bg-white rounded-xl shadow-lg w-full max-w-4xl border border-gray-200 h-[85vh] max-h-[800px] overflow-hidden flex flex-col"
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {renderContent()}
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};

export default Modal;