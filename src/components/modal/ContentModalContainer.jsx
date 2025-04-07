// components/modal/ContentModalContainer.jsx
import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useModal } from '../../hooks/useModal';
import { MODAL_TYPES } from '../../store/slices/modalSlice';

// Import all content modal components
import TutorModalContent from './TutorModalContent';
import LessonModalContent from './LessonModalContent';
import CourseModalContent from './CourseModalContent';

const ContentModalContainer = () => {
    const {
        activeModal,
        modalData,
        isContentModalOpen,
        hasModalHistory,
        closeContentModal,
        goBackContentModal
    } = useModal();

    // Listen for escape key to close modal
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                closeContentModal();
            }
        };

        if (isContentModalOpen) {
            document.addEventListener('keydown', handleKeyDown);
            // Prevent body scrolling when modal is open
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
        };
    }, [isContentModalOpen, closeContentModal]);

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

    return (
        <AnimatePresence>
            {isContentModalOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        exit={{opacity: 0}}
                        onClick={closeContentModal}
                    />

                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            className="bg-white rounded-lg shadow-lg w-full max-w-4xl border border-gray-200 max-h-[90vh] flex flex-col"
                            initial={{scale: 0.95, opacity: 0, y: 20}}
                            animate={{scale: 1, opacity: 1, y: 0}}
                            exit={{scale: 0.95, opacity: 0, y: 20}}
                            transition={{
                                type: 'spring',
                                stiffness: 200,
                                damping: 25
                            }} // Adjusted for smoother transition
                            onClick={(e) => e.stopPropagation()}
                        >
                            {getModalContent()}
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ContentModalContainer;