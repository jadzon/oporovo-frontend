// ConfirmationView.jsx
// Simple confirmation view with spinning animation
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

    // Render sophisticated loading animation
    const renderLoading = () => (
        <div className="flex flex-col items-center justify-center h-full w-full">
            <div className="relative">
                {/* Outer spinning ring */}
                <motion.div
                    className="w-24 h-24 border-[3px] border-gray-100 rounded-full"
                    style={{
                        borderLeftColor: "#000",
                        borderRightColor: "#000"
                    }}
                    animate={{
                        rotate: 360,
                    }}
                    transition={{
                        duration: 2,
                        ease: "linear",
                        repeat: Infinity
                    }}
                />

                {/* Inner spinning ring (opposite direction) */}
                <motion.div
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 border-[2px] border-gray-200 rounded-full"
                    style={{
                        borderTopColor: "#000",
                        borderBottomColor: "#000"
                    }}
                    animate={{
                        rotate: -360,
                    }}
                    transition={{
                        duration: 1.5,
                        ease: "linear",
                        repeat: Infinity
                    }}
                />

                {/* Center dot pulse */}
                <motion.div
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-black rounded-full"
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [1, 0.8, 1]
                    }}
                    transition={{
                        duration: 2,
                        ease: "easeInOut",
                        repeat: Infinity
                    }}
                />
            </div>

            <p className="mt-8 text-gray-500 text-sm">Przetwarzanie...</p>
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