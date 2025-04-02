import { useState, useEffect, useRef } from 'react';
import { FaDiscord, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { motion } from "framer-motion";
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { logout } from '../../store/thunks/authThunks';

const Navbar = ({ openLoginModal }) => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.auth.user);
    const isAuthenticated = !!user;

    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

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

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        dispatch(logout());
        setIsDropdownOpen(false);
    };

    return (
        <nav className={`navbar ${isScrolled ? 'navbar-scrolled' : 'navbar-transparent'}`}>
            <div className="container-custom py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link to="/" className="font-medium text-gray-700 hover:text-vibely-600 transition-colors">
                            <span className="text-2xl font-bold text-vibely-700">Oporovo</span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {isAuthenticated ? (
                            // Navigation for logged-in users
                            <>
                                <Link to="/dashboard" className="font-medium text-gray-700 hover:text-vibely-600 transition-colors">
                                    Kokpit
                                </Link>
                                <Link to="/tutors" className="font-medium text-gray-700 hover:text-vibely-600 transition-colors">
                                    Korepetytorzy
                                </Link>
                                <Link to="/calendar" className="font-medium text-gray-700 hover:text-vibely-600 transition-colors">
                                    Terminarz
                                </Link>
                            </>
                        ) : (
                            // Navigation for guests
                            <>
                                <a href="#about" className="font-medium text-gray-700 hover:text-vibely-600 transition-colors">
                                    O nas
                                </a>
                                <a href="#tutors" className="font-medium text-gray-700 hover:text-vibely-600 transition-colors">
                                    Korepetytorzy
                                </a>
                                <a href="#contact" className="font-medium text-gray-700 hover:text-vibely-600 transition-colors">
                                    Kontakt
                                </a>
                            </>
                        )}
                    </div>

                    {/* Login Button or User Avatar */}
                    {isAuthenticated ? (
                        <div className="relative" ref={dropdownRef}>
                            <motion.div
                                className="flex items-center cursor-pointer"
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <div className="w-10 h-10 rounded-full bg-vibely-600 flex items-center justify-center text-white mr-2 overflow-hidden">
                                    {user.avatar ? (
                                        <img
                                            src={user.avatar}
                                            alt={user.username}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <FaUser className="text-lg" />
                                    )}
                                </div>
                                <span className="font-medium text-gray-700">{user.username}</span>
                            </motion.div>

                            {/* User Dropdown */}
                            {isDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                                    <Link
                                        to="/profile"
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        onClick={() => setIsDropdownOpen(false)}
                                    >
                                        Profil
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        <div className="flex items-center">
                                            <FaSignOutAlt className="mr-2" />
                                            Wyloguj się
                                        </div>
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <motion.button
                            whileHover={{scale: 1.05}}
                            whileTap={{scale: 0.95}}
                            onClick={openLoginModal}
                            className="btn btn-primary py-3 px-8"
                        >
                            <FaDiscord className="mr-2"/>
                            Zaloguj się
                        </motion.button>
                    )}

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
                            {isAuthenticated ? (
                                // Mobile menu for logged-in users
                                <>
                                    <Link
                                        to="/dashboard"
                                        className="font-medium text-gray-700 hover:text-vibely-600 transition-colors"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Kokpit
                                    </Link>
                                    <Link
                                        to="/tutors"
                                        className="font-medium text-gray-700 hover:text-vibely-600 transition-colors"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Korepetytorzy
                                    </Link>
                                    <Link
                                        to="/calendar"
                                        className="font-medium text-gray-700 hover:text-vibely-600 transition-colors"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Terminarz
                                    </Link>
                                    <Link
                                        to="/profile"
                                        className="font-medium text-gray-700 hover:text-vibely-600 transition-colors"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Profil
                                    </Link>
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            setIsMobileMenuOpen(false);
                                        }}
                                        className="btn-primary w-full flex items-center justify-center"
                                    >
                                        <FaSignOutAlt className="mr-2" />
                                        Wyloguj się
                                    </button>
                                </>
                            ) : (
                                // Mobile menu for guests
                                <>
                                    <a
                                        href="#"
                                        className="font-medium text-gray-700 hover:text-vibely-600 transition-colors"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Strona główna
                                    </a>
                                    <a
                                        href="#about"
                                        className="font-medium text-gray-700 hover:text-vibely-600 transition-colors"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        O nas
                                    </a>
                                    <a
                                        href="#tutors"
                                        className="font-medium text-gray-700 hover:text-vibely-600 transition-colors"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Korepetytorzy
                                    </a>
                                    <a
                                        href="#contact"
                                        className="font-medium text-gray-700 hover:text-vibely-600 transition-colors"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Kontakt
                                    </a>
                                    <button
                                        onClick={() => {
                                            openLoginModal();
                                            setIsMobileMenuOpen(false);
                                        }}
                                        className="btn-primary w-full flex items-center justify-center"
                                    >
                                        <FaDiscord className="mr-2" />
                                        Zaloguj się
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;