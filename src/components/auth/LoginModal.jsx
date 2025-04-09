import { useEffect, useRef } from 'react';
import { FaDiscord } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { authService } from '../../api/services/authService';

const LoginModal = ({ isOpen, onClose }) => {
    const modalRef = useRef();

    // Close modal when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (modalRef.current && !modalRef.current.contains(e.target)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    // Prevent scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
                    />

                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            ref={modalRef}
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                            className="bg-white rounded-lg shadow-lg w-full max-w-md overflow-hidden"
                        >
                            <div className="px-8 py-8">
                                <div className="flex items-center justify-center mb-6">
                                    <img
                                        src="/logo.png"
                                        alt="Oporovo"
                                        className="h-8"
                                    />
                                </div>

                                <div className="mb-8">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">
                                        Zaloguj się do konta
                                    </h3>
                                    <p className="text-gray-500 text-center text-sm">
                                        Uzyskaj dostęp do wszystkich funkcji platformy Oporovo
                                    </p>
                                </div>

                                <div className="space-y-6">
                                    <button
                                        onClick={() => authService.discordLogin()}
                                        className="w-full flex items-center justify-center py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm transition-colors"
                                    >
                                        <FaDiscord className="mr-2 text-lg" />
                                        <span>Kontynuuj przez Discord</span>
                                    </button>

                                    <div className="relative">
                                        <div className="absolute inset-0 flex items-center">
                                            <div className="w-full border-t border-gray-200"></div>
                                        </div>
                                        <div className="relative flex justify-center text-sm">
                                            <span className="px-2 bg-white text-gray-500">Dlaczego Discord?</span>
                                        </div>
                                    </div>

                                    <p className="text-sm text-gray-500 text-center">
                                        Wszystkie lekcje odbywają się przez Discord, dlatego logowanie wymaga połączenia konta.
                                    </p>
                                </div>

                                <div className="mt-8 pt-6 border-t border-gray-100">
                                    <p className="text-xs text-gray-400 text-center">
                                        Logując się akceptujesz{' '}
                                        <a href="#" className="text-blue-600 hover:text-blue-700">
                                            Regulamin
                                        </a>{' '}
                                        oraz{' '}
                                        <a href="#" className="text-blue-600 hover:text-blue-700">
                                            Politykę Prywatności
                                        </a>
                                    </p>

                                    <div className="mt-4 flex justify-center">
                                        <button
                                            onClick={onClose}
                                            className="text-sm text-gray-500 hover:text-gray-700 font-medium"
                                        >
                                            Zamknij
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};

export default LoginModal;