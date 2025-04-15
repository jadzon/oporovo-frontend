// ConfirmationView.jsx with simplified loading animation
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useModal } from '../core/useModal';
import ModalHeader from '../components/ModalHeader';
import { Icon } from '../components/Icon';

const ConfirmationView = ({ data }) => {
    const { closeModal, hideConfirmation } = useModal();
    const [showLoading, setShowLoading] = useState(true);
    const [showContent, setShowContent] = useState(false);

    // Animate in sequence: first loading, then content
    useEffect(() => {
        // Show loading animation initially
        setShowLoading(true);

        // After 1.5 seconds, hide loading and show content
        const timer = setTimeout(() => {
            setShowLoading(false);
            setShowContent(true);
        }, 1500);

        // Clear states when unmounting to prevent persistence on reopen
        return () => {
            clearTimeout(timer);
            setShowLoading(false);
            setShowContent(false);
        };
    }, []);

    if (!data) return null;

    const {
        title = 'Potwierdzenie',
        message = 'Operacja zakończona pomyślnie'
    } = data;

    // When closing, ensure we clear the confirmation data
    const handleClose = () => {
        hideConfirmation();
        closeModal();
    };

    // Render simple but cool loading animation
    const renderLoading = () => (
        <div className="flex flex-col items-center justify-center h-full w-full">
            {/* Simple but cool spinner */}
            <motion.div
                className="w-14 h-14 rounded-full"
                style={{
                    borderWidth: '2px',
                    borderStyle: 'solid',
                    borderColor: 'rgba(0,0,0,0.1)',
                    borderLeftColor: '#000',
                }}
                animate={{ rotate: 360 }}
                transition={{
                    duration: 0.8,
                    ease: "linear",
                    repeat: Infinity
                }}
            />

            <p className="mt-6 text-gray-500 text-sm">Przetwarzanie...</p>
        </div>
    );

    // Render simple success content
    const renderContent = () => (
        <div className="flex flex-col h-full">
            <div className="flex-1 flex flex-col items-center justify-center p-6">
                <div className="w-20 h-20 flex items-center justify-center rounded-full bg-black text-white mb-6">
                    <Icon name="check" className="h-10 w-10" />
                </div>

                <h2 className="text-2xl font-semibold text-gray-900 mb-4 text-center">
                    {message}
                </h2>

                <p className="text-gray-600 text-center">
                    Twoja lekcja została pomyślnie zaplanowana. Szczegóły lekcji dostępne będą w Twoim harmonogramie.
                </p>

                <button
                    onClick={handleClose}
                    className="mt-8 px-6 py-2 text-sm font-medium text-white bg-black border border-black rounded-md hover:bg-gray-800 transition-colors"
                >
                    Zamknij
                </button>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col h-full">
            {/*<ModalHeader title={title} />*/}
            <div className="flex-1 overflow-hidden">
                <AnimatePresence mode="wait">
                    {showLoading && (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.4 }}
                            className="h-full bg-white"
                        >
                            {renderLoading()}
                        </motion.div>
                    )}

                    {showContent && (
                        <motion.div
                            key="content"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.4 }}
                            className="h-full bg-white"
                        >
                            {renderContent()}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default ConfirmationView;