import { useState, useEffect, useRef } from 'react';
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

    return (
        <nav className={`fixed w-full top-0 left-0 z-40 transition-all duration-300 ${
            isScrolled ? 'bg-white shadow-sm' : 'bg-white bg-opacity-95'
        }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center">
                            <span className="text-xl font-semibold text-blue-900">Oporovo</span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {isAuthenticated ? (
                            <>
                                <NavLink
                                    to="/"
                                    end
                                    className={({ isActive }) =>
                                        `text-sm font-medium transition-colors border-b-2 py-5 ${
                                            isActive
                                                ? 'text-blue-900 border-blue-900'
                                                : 'text-gray-700 border-transparent hover:text-blue-800 hover:border-blue-800'
                                        }`
                                    }
                                >
                                    Kokpit
                                </NavLink>
                                <NavLink
                                    to="/tutors"
                                    className={({ isActive }) =>
                                        `text-sm font-medium transition-colors border-b-2 py-5 ${
                                            isActive
                                                ? 'text-blue-900 border-blue-900'
                                                : 'text-gray-700 border-transparent hover:text-blue-800 hover:border-blue-800'
                                        }`
                                    }
                                >
                                    Korepetytorzy
                                </NavLink>
                                <NavLink
                                    to="/courses"
                                    className={({ isActive }) =>
                                        `text-sm font-medium transition-colors border-b-2 py-5 ${
                                            isActive
                                                ? 'text-blue-900 border-blue-900'
                                                : 'text-gray-700 border-transparent hover:text-blue-800 hover:border-blue-800'
                                        }`
                                    }
                                >
                                    Kursy Maturalne
                                </NavLink>
                                <NavLink
                                    to="/help"
                                    className={({ isActive }) =>
                                        `text-sm font-medium transition-colors border-b-2 py-5 ${
                                            isActive
                                                ? 'text-blue-900 border-blue-900'
                                                : 'text-gray-700 border-transparent hover:text-blue-800 hover:border-blue-800'
                                        }`
                                    }
                                >
                                    Pomoc
                                </NavLink>
                            </>
                        ) : (
                            <>
                                <NavLink
                                    to="/about"
                                    className={({ isActive }) =>
                                        `text-sm font-medium transition-colors border-b-2 py-5 ${
                                            isActive
                                                ? 'text-blue-900 border-blue-900'
                                                : 'text-gray-700 border-transparent hover:text-blue-800 hover:border-blue-800'
                                        }`
                                    }
                                >
                                    O nas
                                </NavLink>
                                <NavLink
                                    to="/tutors"
                                    className={({ isActive }) =>
                                        `text-sm font-medium transition-colors border-b-2 py-5 ${
                                            isActive
                                                ? 'text-blue-900 border-blue-900'
                                                : 'text-gray-700 border-transparent hover:text-blue-800 hover:border-blue-800'
                                        }`
                                    }
                                >
                                    Korepetytorzy
                                </NavLink>
                                <NavLink
                                    to="/contact"
                                    className={({ isActive }) =>
                                        `text-sm font-medium transition-colors border-b-2 py-5 ${
                                            isActive
                                                ? 'text-blue-900 border-blue-900'
                                                : 'text-gray-700 border-transparent hover:text-blue-800 hover:border-blue-800'
                                        }`
                                    }
                                >
                                    Kontakt
                                </NavLink>
                            </>
                        )}
                    </div>

                    {/* Login Button or User Avatar */}
                    <div className="flex items-center">
                        {isAuthenticated ? (
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    className="btn flex items-center gap-2"
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                >
                                    <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200 shadow-sm">
                                        {user.avatar ? (
                                            <img
                                                src={user.avatar}
                                                alt={user.username}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.src = '/images/default-avatar.png';
                                                }}
                                            />
                                        ) : (
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5 m-auto text-gray-500"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                                />
                                            </svg>
                                        )}
                                    </div>
                                    <span className="text-sm font-medium text-gray-700">{user.username}</span>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className={`h-4 w-4 text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 9l-7 7-7-7"
                                        />
                                    </svg>
                                </button>

                                {/* User Dropdown */}
                                {isDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-md border border-gray-200 py-1 z-10">
                                        <Link
                                            to="/profile"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                            onClick={() => setIsDropdownOpen(false)}
                                        >
                                            Profil
                                        </Link>
                                        <Link
                                            to="/settings"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                            onClick={() => setIsDropdownOpen(false)}
                                        >
                                            Ustawienia
                                        </Link>
                                        <div className="border-t border-gray-100 my-1"></div>
                                        <button
                                            onClick={handleLogout}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                        >
                                            <div className="flex items-center">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-4 w-4 mr-2 text-gray-500"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                                    />
                                                </svg>
                                                Wyloguj się
                                            </div>
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <button
                                onClick={openLoginModal}
                                className="inline-flex items-center px-4 py-2 shadow-sm text-sm font-medium rounded-md text-white bg-blue-900 hover:bg-blue-800 transition-colors"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4 mr-2"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                                    />
                                </svg>
                                Zaloguj się
                            </button>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 rounded-md text-gray-700 hover:text-blue-900 focus:outline-none"
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
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden py-2 border-t border-gray-200">
                        <div className="flex flex-col">
                            {isAuthenticated ? (
                                <>
                                    <NavLink
                                        to="/"
                                        end
                                        className={({ isActive }) =>
                                            `px-4 py-3 text-sm font-medium ${
                                                isActive ? 'text-blue-900 bg-blue-50' : 'text-gray-700 hover:bg-gray-50'
                                            }`
                                        }
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Kokpit
                                    </NavLink>
                                    <NavLink
                                        to="/tutors"
                                        className={({ isActive }) =>
                                            `px-4 py-3 text-sm font-medium ${
                                                isActive ? 'text-blue-900 bg-blue-50' : 'text-gray-700 hover:bg-gray-50'
                                            }`
                                        }
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Korepetytorzy
                                    </NavLink>
                                    <NavLink
                                        to="/courses"
                                        className={({ isActive }) =>
                                            `px-4 py-3 text-sm font-medium ${
                                                isActive ? 'text-blue-900 bg-blue-50' : 'text-gray-700 hover:bg-gray-50'
                                            }`
                                        }
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Kursy Maturalne
                                    </NavLink>
                                    <NavLink
                                        to="/help"
                                        className={({ isActive }) =>
                                            `px-4 py-3 text-sm font-medium ${
                                                isActive ? 'text-blue-900 bg-blue-50' : 'text-gray-700 hover:bg-gray-50'
                                            }`
                                        }
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Pomoc
                                    </NavLink>
                                    <NavLink
                                        to="/profile"
                                        className={({ isActive }) =>
                                            `px-4 py-3 text-sm font-medium ${
                                                isActive ? 'text-blue-900 bg-blue-50' : 'text-gray-700 hover:bg-gray-50'
                                            }`
                                        }
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Profil
                                    </NavLink>
                                    <div className="px-4 py-3">
                                        <button
                                            onClick={() => {
                                                handleLogout();
                                                setIsMobileMenuOpen(false);
                                            }}
                                            className="w-full flex items-center px-4 py-2 shadow-sm text-sm font-medium rounded-md text-white bg-blue-900 hover:bg-blue-800 transition-colors"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-4 w-4 mr-2"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                                />
                                            </svg>
                                            Wyloguj się
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <NavLink
                                        to="/"
                                        end
                                        className={({ isActive }) =>
                                            `px-4 py-3 text-sm font-medium ${
                                                isActive ? 'text-blue-900 bg-blue-50' : 'text-gray-700 hover:bg-gray-50'
                                            }`
                                        }
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Strona główna
                                    </NavLink>
                                    <NavLink
                                        to="/about"
                                        className={({ isActive }) =>
                                            `px-4 py-3 text-sm font-medium ${
                                                isActive ? 'text-blue-900 bg-blue-50' : 'text-gray-700 hover:bg-gray-50'
                                            }`
                                        }
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        O nas
                                    </NavLink>
                                    <NavLink
                                        to="/tutors"
                                        className={({ isActive }) =>
                                            `px-4 py-3 text-sm font-medium ${
                                                isActive ? 'text-blue-900 bg-blue-50' : 'text-gray-700 hover:bg-gray-50'
                                            }`
                                        }
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Korepetytorzy
                                    </NavLink>
                                    <NavLink
                                        to="/contact"
                                        className={({ isActive }) =>
                                            `px-4 py-3 text-sm font-medium ${
                                                isActive ? 'text-blue-900 bg-blue-50' : 'text-gray-700 hover:bg-gray-50'
                                            }`
                                        }
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Kontakt
                                    </NavLink>
                                    <div className="px-4 py-3">
                                        <button
                                            onClick={() => {
                                                openLoginModal();
                                                setIsMobileMenuOpen(false);
                                            }}
                                            className="w-full flex items-center px-4 py-2 shadow-sm text-sm font-medium rounded-md text-white bg-blue-900 hover:bg-blue-800 transition-colors"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-4 w-4 mr-2"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                                                />
                                            </svg>
                                            Zaloguj się
                                        </button>
                                    </div>
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