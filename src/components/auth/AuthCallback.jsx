// components/auth/AuthCallback.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getCurrentUser } from '../../store/thunks/authThunks';
import { ROUTES } from '../../api/constants';
import { motion } from 'framer-motion';

const AuthCallback = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [error, setError] = useState(null);

    useEffect(() => {
        const handleCallback = async () => {
            try {
                // The server should handle the actual OAuth exchange and set cookies
                const result = await dispatch(getCurrentUser()).unwrap();

                if (result) {
                    console.log('Authentication successful');
                    navigate(ROUTES.DASHBOARD);
                } else {
                    setError('Uwierzytelnianie nie powiodło się');
                    setTimeout(() => navigate(ROUTES.HOME), 3000);
                }
            } catch (err) {
                console.error('Auth callback error:', err);
                setError('Uwierzytelnianie nie powiodło się: ' + (err.message || 'Nieznany błąd'));
                setTimeout(() => navigate(ROUTES.HOME), 3000);
            }
        };

        handleCallback();
    }, [dispatch, navigate]);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-md"
            >
                <div className="flex justify-center mb-8">
                    <img src="/logo.png" alt="Oporovo" className="h-8" />
                </div>

                <div className="bg-white rounded-lg shadow-sm px-8 py-10">
                    {error ? (
                        <div className="text-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">Błąd uwierzytelniania</h2>
                            <p className="text-gray-500 mb-6">{error}</p>
                            <div className="py-2 px-3 bg-gray-50 rounded-md text-sm text-gray-600 border border-gray-100">
                                Przekierowanie na stronę główną za chwilę...
                            </div>
                        </div>
                    ) : (
                        <div className="text-center">
                            <div className="relative mx-auto mb-6 w-12 h-12 flex items-center justify-center">
                                <div className="absolute w-full h-full rounded-full border-2 border-blue-600 border-t-transparent animate-spin"></div>
                                <div className="w-8 h-8 rounded-full bg-blue-50"></div>
                            </div>
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">Trwa logowanie</h2>
                            <p className="text-gray-500">Proszę czekać, weryfikujemy Twoje dane...</p>
                        </div>
                    )}
                </div>

                <div className="mt-6 text-center">
                    <p className="text-xs text-gray-400">
                        &copy; {new Date().getFullYear()} Oporovo. Wszelkie prawa zastrzeżone.
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default AuthCallback;