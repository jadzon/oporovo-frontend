import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getCurrentUser } from './store/thunks/authThunks';
import { useModal } from './hooks/useModal'; // Import from hooks, not context

// Components
import Navbar from './components/layout/Navbar';
import Hero from './components/home/Hero';
import AboutUs from './components/home/AboutUs';
import TopTutors from './components/home/TopTutors';
import Footer from './components/layout/Footer';
import LoginModal from './components/auth/LoginModal';
import AuthCallback from './components/auth/AuthCallback';

// Home page component with error handling
const HomePage = () => {
    // Add error handling for useModal hook
    const modal = useModal();

    // Early return if modal is not available yet
    if (!modal) {
        console.log("Modal not available yet");
        return <div>Loading...</div>;
    }

    const { isLoginModalOpen, openLoginModal, closeLoginModal } = modal;

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar openLoginModal={openLoginModal} />

            <main className="flex-grow">
                <Hero />
                <AboutUs />
                <TopTutors />
            </main>

            <Footer />

            <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
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
                <Route path="/auth/callback" element={<AuthCallback />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;