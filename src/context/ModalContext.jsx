import { createContext, useState, useContext } from 'react';

const ModalContext = createContext();

export const useModal = () => {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error('useModal must be used within a ModalProvider');
    }
    return context;
};

export const ModalProvider = ({ children }) => {
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isTutorModalOpen, setIsTutorModalOpen] = useState(false);
    const [selectedTutor, setSelectedTutor] = useState(null);

    const openLoginModal = () => setIsLoginModalOpen(true);
    const closeLoginModal = () => setIsLoginModalOpen(false);

    const openTutorModal = (tutor) => {
        setSelectedTutor(tutor);
        setIsTutorModalOpen(true);
    };

    const closeTutorModal = () => {
        setIsTutorModalOpen(false);
        setTimeout(() => setSelectedTutor(null), 300); // Clear after animation
    };

    const value = {
        isLoginModalOpen,
        openLoginModal,
        closeLoginModal,
        isTutorModalOpen,
        openTutorModal,
        closeTutorModal,
        selectedTutor,
    };

    return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>;
};

export default ModalContext;