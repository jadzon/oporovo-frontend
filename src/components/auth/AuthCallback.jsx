import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../../store/thunks/authThunks';
import { ROUTES } from '../../api/constants';

const AuthCallback = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [status, setStatus] = useState('Trwa logowanie...');

    useEffect(() => {
        dispatch(getCurrentUser())
            .unwrap()
            .then(() => {
                setStatus('Zalogowano pomyślnie!');
                setTimeout(() => navigate(ROUTES.HOME), 1000);
            })
            .catch((error) => {
                setStatus(`Błąd logowania: ${error}`);
                setTimeout(() => navigate(ROUTES.HOME), 2000);
            });
    }, [dispatch, navigate]);

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <h2 className="text-2xl font-bold mb-4">{status}</h2>
                <p className="text-gray-600">Przekierowywanie...</p>
            </div>
        </div>
    );
};

export default AuthCallback;