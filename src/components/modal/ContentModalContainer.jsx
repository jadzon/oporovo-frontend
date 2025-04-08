import React, { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useModal } from '../../hooks/useModal';
import { MODAL_TYPES } from '../../store/slices/modalSlice';

// Import modal components
import { TutorModalContent } from './tutor';
import { LessonModalContent } from './lesson';
import { CourseModalContent } from './course';
import { ConfirmationModal } from './confirmation';

/**
 * Main container component that manages all modal types
 */
const ContentModalContainer = () => {
    const {
        activeModal,
        modalData,
        isContentModalOpen,
        hasModalHistory,
        closeContentModal,
        goBackContentModal,

        // Confirmation modal state
        isConfirmationModalOpen,
        confirmationData,
        closeConfirmationModal,
        openLessonModal
    } = useModal();

    // Listen for escape key to close modal
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                if (isContentModalOpen) {
                    closeContentModal();
                } else if (isConfirmationModalOpen) {
                    closeConfirmationModal();
                }
            }
        };

        if (isContentModalOpen || isConfirmationModalOpen) {
            document.addEventListener('keydown', handleKeyDown);
            // Prevent body scrolling when modal is open
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
        };
    }, [isContentModalOpen, isConfirmationModalOpen, closeContentModal, closeConfirmationModal]);

    // Helper to get correct content based on modal type
    const getModalContent = () => {
        switch (activeModal) {
            case MODAL_TYPES.TUTOR:
                return (
                    <TutorModalContent
                        tutor={modalData}
                        onClose={closeContentModal}
                        hasHistory={hasModalHistory}
                        goBack={goBackContentModal}
                    />
                );
            case MODAL_TYPES.LESSON:
                return (
                    <LessonModalContent
                        lesson={modalData}
                        onClose={closeContentModal}
                        hasHistory={hasModalHistory}
                        goBack={goBackContentModal}
                    />
                );
            case MODAL_TYPES.COURSE:
                return (
                    <CourseModalContent
                        course={modalData}
                        onClose={closeContentModal}
                        hasHistory={hasModalHistory}
                        goBack={goBackContentModal}
                    />
                );
            default:
                return null;
        }
    };

    // Handle viewing details of a created lesson
    const handleViewLessonDetails = () => {
        if (confirmationData) {
            // Close confirmation modal first
            closeConfirmationModal();

            // If we have the full lesson object in the data, use that
            if (confirmationData.lessonObject) {
                // Small delay to allow confirmation modal to close smoothly
                setTimeout(() => {
                    openLessonModal(confirmationData.lessonObject);
                }, 100);
            }
        }
    };

    return (
        <>
            {/* Content Modal */}
            <AnimatePresence mode="wait">
                {isContentModalOpen && (
                    <>
                        {/* Backdrop */}
                        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50" onClick={closeContentModal} />

                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                            <div
                                className="bg-white rounded-lg shadow-lg w-full max-w-4xl border border-gray-200 max-h-[90vh] flex flex-col"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {getModalContent()}
                            </div>
                        </div>
                    </>
                )}
            </AnimatePresence>

            {/* Confirmation Modal */}
            <AnimatePresence mode="wait">
                {isConfirmationModalOpen && (
                    <ConfirmationModal
                        onClose={closeConfirmationModal}
                        title={confirmationData.title}
                        message={confirmationData.message}
                        type={confirmationData.type}
                        data={confirmationData.data}
                        showViewDetailsButton={confirmationData.showViewDetailsButton}
                        onViewDetails={handleViewLessonDetails}
                    />
                )}
            </AnimatePresence>
        </>
    );
};

export default ContentModalContainer;