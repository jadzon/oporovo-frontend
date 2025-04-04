import { useState, useEffect, useRef } from 'react';
import { FaDiscord, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, Link } from 'react-router-dom';
import { logout } from '../../store/thunks/authThunks';

const Navbar = ({ openLoginModal }) => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.auth.user);
    const isAuthenticated = !!user;

    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Update navbar background on scroll
    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        dispatch(logout());
        setIsDropdownOpen(false);
    };

    // Nav item component with animated underline
    const NavItem = ({ to, exact, children }) => (
        <NavLink
            to={to}
            end={exact}
            className={({ isActive }) =>
                `relative font-medium transition-colors ${
                    isActive ? 'text-purple-700' : 'text-gray-700 hover:text-purple-500'
                }`
            }
        >
            {({ isActive }) => (
                <div className="relative inline-block">
                    <span>{children}</span>
                    <motion.div
                        className="absolute left-0 -bottom-1 w-full h-0.5 bg-purple-600"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: isActive ? 1 : 0 }}
                        whileHover={{ scaleX: 1 }}
                        transition={{ duration: 0.3 }}
                        style={{ originX: 0 }}
                    />
                </div>
            )}
        </NavLink>
    );

    return (
        <nav className={`navbar ${isScrolled ? 'navbar-scrolled' : 'navbar-transparent'}`}>
            <div className="container-custom py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link
                            to="/"
                            className="font-medium text-gray-700 hover:text-purple-500 transition-colors"
                        >
                            <span className="text-2xl font-bold text-purple-700">Oporovo</span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {isAuthenticated ? (
                            <>
                                <NavItem to="/" exact>Kokpit</NavItem>
                                <NavItem to="/tutors">Korepetytorzy</NavItem>
                                <NavItem to="/calendar">Terminarz</NavItem>
                            </>
                        ) : (
                            <>
                                <NavItem to="/about">O nas</NavItem>
                                <NavItem to="/tutors">Korepetytorzy</NavItem>
                                <NavItem to="/contact">Kontakt</NavItem>
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
                                <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white mr-2 overflow-hidden">
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
                                    <NavItem to="/profile">Profil</NavItem>
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
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={openLoginModal}
                            className="btn btn-primary py-3 px-8"
                        >
                            <FaDiscord className="mr-2" />
                            Zaloguj się
                        </motion.button>
                    )}

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-2 rounded-md text-gray-700 hover:text-purple-500 focus:outline-none"
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
                                <>
                                    <NavLink
                                        to="/"
                                        className="font-medium text-gray-700 hover:text-purple-500 transition-colors"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Kokpit
                                    </NavLink>
                                    <NavLink
                                        to="/tutors"
                                        className="font-medium text-gray-700 hover:text-purple-500 transition-colors"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Korepetytorzy
                                    </NavLink>
                                    <NavLink
                                        to="/calendar"
                                        className="font-medium text-gray-700 hover:text-purple-500 transition-colors"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Terminarz
                                    </NavLink>
                                    <NavLink
                                        to="/profile"
                                        className="font-medium text-gray-700 hover:text-purple-500 transition-colors"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Profil
                                    </NavLink>
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
                                <>
                                    <NavLink
                                        to="/"
                                        className="font-medium text-gray-700 hover:text-purple-500 transition-colors"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Strona główna
                                    </NavLink>
                                    <NavLink
                                        to="/about"
                                        className="font-medium text-gray-700 hover:text-purple-500 transition-colors"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        O nas
                                    </NavLink>
                                    <NavLink
                                        to="/tutors"
                                        className="font-medium text-gray-700 hover:text-purple-500 transition-colors"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Korepetytorzy
                                    </NavLink>
                                    <NavLink
                                        to="/contact"
                                        className="font-medium text-gray-700 hover:text-purple-500 transition-colors"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Kontakt
                                    </NavLink>
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
