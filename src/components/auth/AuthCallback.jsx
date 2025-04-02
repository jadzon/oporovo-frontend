// components/auth/AuthCallback.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getCurrentUser } from '../../store/thunks/authThunks';
import { ROUTES } from '../../api/constants';

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
        <div className="flex flex-col items-center justify-center min-h-screen">
            {error ? (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    <p>{error}</p>
                    <p className="text-sm">Przekierowywanie na stronę główną...</p>
                </div>
            ) : (
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-vibely-600 mx-auto"></div>
                    <p className="mt-4 text-lg">Logowanie...</p>
                </div>
            )}
        </div>
    );
};

export default AuthCallback;