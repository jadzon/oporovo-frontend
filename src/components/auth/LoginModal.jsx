import { useEffect, useRef } from 'react';
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
                        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
                    />

                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            ref={modalRef}
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                            className="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden border border-gray-100"
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
                                        className="w-full flex items-center justify-center py-2.5 px-4 bg-black hover:bg-gray-800 text-white font-medium rounded-full shadow-sm transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M20.317 4.492c-1.53-.69-3.17-1.2-4.885-1.49a.075.075 0 0 0-.079.036c-.21.385-.403.8-.548 1.17-.6-.09-1.2-.15-1.81-.15-.608 0-1.21.06-1.81.15-.145-.37-.337-.785-.548-1.17a.077.077 0 0 0-.079-.037c-1.714.29-3.355.8-4.885 1.491a.07.07 0 0 0-.032.027C2.38 10.086 1.55 15.523 1.92 20.863a.082.082 0 0 0 .031.057 20.56 20.56 0 0 0 6.15 3.112.077.077 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.995.021-.041.001-.09-.041-.106a13.647 13.647 0 0 1-1.938-.93.077.077 0 0 1-.008-.128c.13-.097.261-.2.386-.3a.074.074 0 0 1 .078-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.125.104.255.204.385.3.044.034.04.099-.009.128a12.375 12.375 0 0 1-1.938.93.077.077 0 0 0-.041.107c.36.698.772 1.363 1.225 1.994a.076.076 0 0 0 .084.028 20.683 20.683 0 0 0 6.15-3.112.077.077 0 0 0 .032-.054c.444-4.58-.73-10.01-3.087-14.345a.061.061 0 0 0-.031-.027Zm-10.884 11.51c-1.214 0-2.213-1.12-2.213-2.494 0-1.377.983-2.495 2.21-2.495 1.23 0 2.23 1.118 2.214 2.494 0 1.376-.983 2.495-2.21 2.495Zm8.177 0c-1.214 0-2.213-1.12-2.213-2.494 0-1.377.983-2.495 2.21-2.495 1.23 0 2.23 1.118 2.214 2.494 0 1.376-.967 2.495-2.21 2.495Z" />
                                        </svg>
                                        <span>Kontynuuj przez Discord</span>
                                    </button>

                                    <div className="relative">
                                        <div className="absolute inset-0 flex items-center">
                                            <div className="w-full border-t border-gray-100"></div>
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
                                        <a href="#" className="text-black hover:text-gray-700">
                                            Regulamin
                                        </a>{' '}
                                        oraz{' '}
                                        <a href="#" className="text-black hover:text-gray-700">
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