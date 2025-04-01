import { useState, useEffect } from 'react';
import { FaDiscord } from 'react-icons/fa';
import {motion} from "framer-motion";

const Navbar = ({ openLoginModal }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`navbar ${isScrolled ? 'navbar-scrolled' : 'navbar-transparent'}`}>
            <div className="container-custom py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center">
                        <a href="#" className="font-medium text-gray-700 hover:text-vibely-600 transition-colors">
                            <span className="text-2xl font-bold text-vibely-700">Vibely</span>
                        </a>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <a href="#about" className="font-medium text-gray-700 hover:text-vibely-600 transition-colors">
                            O nas
                        </a>
                        <a href="#tutors" className="font-medium text-gray-700 hover:text-vibely-600 transition-colors">
                            Korepetytorzy
                        </a>
                        <a href="#contact" className="font-medium text-gray-700 hover:text-vibely-600 transition-colors">
                            Kontakt
                        </a>
                    </div>

                    {/* Login Button */}
                    <motion.button
                        whileHover={{scale: 1.05}}
                        whileTap={{scale: 0.95}}
                        onClick={openLoginModal}
                        className="btn btn-primary py-3 px-8"
                    >
                        <FaDiscord className="mr-2"/>
                        Zaloguj się
                    </motion.button>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-2 rounded-md text-gray-700 hover:text-vibely-600 focus:outline-none"
                    >
                        <svg
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            {isMobileMenuOpen ? (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            ) : (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden mt-4 pb-4">
                        <div className="flex flex-col space-y-4">
                            <a href="#" className="font-medium text-gray-700 hover:text-vibely-600 transition-colors">
                                Strona główna
                            </a>
                            <a href="#about" className="font-medium text-gray-700 hover:text-vibely-600 transition-colors">
                                O nas
                            </a>
                            <a href="#tutors" className="font-medium text-gray-700 hover:text-vibely-600 transition-colors">
                                Korepetytorzy
                            </a>
                            <a href="#contact" className="font-medium text-gray-700 hover:text-vibely-600 transition-colors">
                                Kontakt
                            </a>
                            <button
                                onClick={openLoginModal}
                                className="btn-primary w-full"
                            >
                                <FaDiscord className="mr-2" />
                                Zaloguj się
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;