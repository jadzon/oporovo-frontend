import { useEffect } from 'react';
import Navbar from './components/layout/Navbar';
import Hero from './components/home/Hero';
import AboutUs from './components/home/AboutUs';
import TopTutors from './components/home/TopTutors';
import Footer from './components/layout/Footer';
import LoginModal from './components/auth/LoginModal';
import { useModal } from './context/ModalContext';

function App() {
    const { isLoginModalOpen, openLoginModal, closeLoginModal } = useModal();

    // Simulate loading mock tutor images (in production you'd have real images)
    useEffect(() => {
        // This is just to simulate "having" the mock images
        // In a real project, you'd have actual images in the public folder
        console.log('Mock tutors would be loaded here');
    }, []);

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
}

export default App;