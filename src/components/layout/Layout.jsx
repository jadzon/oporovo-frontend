// components/layout/Layout.jsx
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import LoginModal from '../auth/LoginModal';
import { useModal } from '../../hooks/useModal';

const Layout = () => {
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
                <Outlet /> {/* This is where page content will be rendered */}
            </main>

            <Footer />

            <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
        </div>
    );
};

export default Layout;