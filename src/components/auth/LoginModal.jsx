import { useEffect, useRef } from 'react';
import { FaDiscord, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

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

    // Mock login function
    const handleDiscordLogin = () => {
        // In production, this would redirect to Discord OAuth
        console.log('Logging in with Discord...');
        setTimeout(() => {
            onClose();
            // Mock successful login
            alert('Zalogowano pomyślnie! (symulacja)');
        }, 1000);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="modal-overlay"
                    />
                    <div className="modal">
                        <motion.div
                            ref={modalRef}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            className="modal-content"
                        >
                            <div className="relative p-6">
                                <button
                                    onClick={onClose}
                                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                                >
                                    <FaTimes />
                                </button>
                                <div className="text-center">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-6">
                                        Zaloguj się do Vibely
                                    </h3>
                                    <p className="text-gray-600 mb-8">
                                        Zaloguj się przez Discord aby zarezerwować korepetycje
                                        i korzystać z pełni możliwości platformy.
                                    </p>
                                    <button
                                        onClick={handleDiscordLogin}
                                        className="w-full flex items-center justify-center btn py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
                                    >
                                        <FaDiscord className="text-xl mr-2" />
                                        Kontynuuj przez Discord
                                    </button>
                                    <p className="mt-6 text-sm text-gray-500">
                                        Logując się akceptujesz{' '}
                                        <a href="#" className="text-vibely-600 hover:underline">
                                            Regulamin
                                        </a>{' '}
                                        oraz{' '}
                                        <a href="#" className="text-vibely-600 hover:underline">
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