// components/layout/Layout.jsx
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import LoginModal from '../auth/LoginModal';  // Existing login modal
import ContentModalContainer from '../modal/ContentModalContainer';  // Our new content modal system
import { useModal } from '../../hooks/useModal';

const Layout = () => {
    const { isLoginModalOpen, closeLoginModal, openLoginModal } = useModal();

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar openLoginModal={openLoginModal}/>

            <main className="flex-grow pt-16">
                <Outlet /> {/* This is where page content will be rendered */}
            </main>

            <Footer />

            {/* Kept separate - Login Modal */}
            <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />

            {/* Unified Content Modal System */}
            <ContentModalContainer />
        </div>
    );
};

export default Layout;