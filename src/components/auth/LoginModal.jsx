import { useEffect, useRef } from 'react';
import { FaDiscord, FaTimes } from 'react-icons/fa';
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
                            className="bg-white rounded-2xl shadow-xl w-full max-w-md border border-gray-100"
                        >
                            <div className="relative p-8">
                                <button
                                    onClick={onClose}
                                    className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                                >
                                    <FaTimes className="w-5 h-5" />
                                </button>

                                <div className="space-y-6 text-center">
                                    <div className="space-y-2">
                                        <h3 className="text-3xl font-bold text-gray-900">
                                            Zaloguj się do Oporovo
                                        </h3>
                                        <p className="text-gray-600 leading-relaxed">
                                            Zaloguj się przez Discord aby zarezerwować korepetycje<br />
                                            i korzystać z pełni możliwości platformy.
                                        </p>
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => authService.discordLogin()}
                                        className="btn w-full flex items-center justify-center gap-3 py-3.5 px-6 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg shadow-md"
                                    >
                                        <FaDiscord className="text-xl shrink-0" />
                                        Kontynuuj przez Discord
                                    </motion.button>

                                    <p className="text-sm text-gray-500">
                                        Logując się akceptujesz{' '}
                                        <a href="#" className="text-purple-600 hover:underline font-medium">
                                            Regulamin
                                        </a>{' '}
                                        oraz{' '}
                                        <a href="#" className="text-purple-600 hover:underline font-medium">
                                            Politykę Prywatności
                                        </a>
                                    </p>
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