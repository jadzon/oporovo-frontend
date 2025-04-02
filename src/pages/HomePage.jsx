import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getCurrentUser } from '../store/thunks/authThunks';

// Simple HomePage component
const HomePage = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <div>Navbar Placeholder</div>
            <main className="flex-grow">
                <div>Content Placeholder</div>
            </main>
            <div>Footer Placeholder</div>
        </div>
    );
};

function App() {
    const dispatch = useDispatch();

    useEffect(() => {
        try {
            dispatch(getCurrentUser());
        } catch (error) {
            console.error("Error dispatching getCurrentUser:", error);
        }
    }, [dispatch]);

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="*" element={<div>Not Found</div>} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;