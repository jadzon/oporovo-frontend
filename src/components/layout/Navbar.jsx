"use client"

import { useState, useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { NavLink, Link } from "react-router-dom"
import { logout } from "../../store/thunks/authThunks"
import { LogIn, LogOut, User, ChevronDown, Menu, X } from "lucide-react"
import { FaDiscord } from "react-icons/fa"

const Navbar = ({ openLoginModal }) => {
    const dispatch = useDispatch()
    const user = useSelector((state) => state.auth.user)
    const isAuthenticated = !!user

    const [isScrolled, setIsScrolled] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const dropdownRef = useRef(null)

    // Update navbar background on scroll
    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20)
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const handleLogout = () => {
        dispatch(logout())
        setIsDropdownOpen(false)
    }

    return (
        <nav
            className={`fixed w-full top-0 left-0 z-40 transition-all duration-300 ${
                isScrolled ? "bg-white shadow-sm" : "bg-white bg-opacity-95"
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center">
                            <span className="text-xl font-semibold text-black">Oporovo</span>
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
                                                ? "text-black border-black"
                                                : "text-gray-700 border-transparent hover:text-black hover:border-gray-300"
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
                                                ? "text-black border-black"
                                                : "text-gray-700 border-transparent hover:text-black hover:border-gray-300"
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
                                                ? "text-black border-black"
                                                : "text-gray-700 border-transparent hover:text-black hover:border-gray-300"
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
                                                ? "text-black border-black"
                                                : "text-gray-700 border-transparent hover:text-black hover:border-gray-300"
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
                                                ? "text-black border-black"
                                                : "text-gray-700 border-transparent hover:text-black hover:border-gray-300"
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
                                                ? "text-black border-black"
                                                : "text-gray-700 border-transparent hover:text-black hover:border-gray-300"
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
                                                ? "text-black border-black"
                                                : "text-gray-700 border-transparent hover:text-black hover:border-gray-300"
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
                                    className="flex items-center gap-2 hover:bg-gray-50 rounded-full py-1.5 px-2 transition-colors"
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                >
                                    <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-100 shadow-sm">
                                        {user.avatar ? (
                                            <img
                                                src={user.avatar || "/placeholder.svg"}
                                                alt={user.username}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.src = "/images/default-avatar.png"
                                                }}
                                            />
                                        ) : (
                                            <User className="h-5 w-5 m-auto text-gray-500" />
                                        )}
                                    </div>
                                    <span className="text-sm font-medium text-gray-700">{user.username}</span>
                                    <ChevronDown
                                        className={`h-4 w-4 text-gray-500 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                                    />
                                </button>

                                {/* User Dropdown */}
                                {isDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-md border border-gray-100 py-1 z-10">
                                        <Link
                                            to={`/user/${user.id}`}
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#FFFDF7] transition-colors"
                                            onClick={() => setIsDropdownOpen(false)}
                                        >
                                            Profil
                                        </Link>
                                        <Link
                                            to="/settings"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#FFFDF7] transition-colors"
                                            onClick={() => setIsDropdownOpen(false)}
                                        >
                                            Ustawienia
                                        </Link>
                                        <div className="border-t border-gray-100 my-1"></div>
                                        <button
                                            onClick={handleLogout}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-[#FFFDF7] transition-colors"
                                        >
                                            <div className="flex items-center">
                                                <LogOut className="h-4 w-4 mr-2 text-gray-500" />
                                                Wyloguj się
                                            </div>
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <button
                                onClick={openLoginModal}
                                className="inline-flex items-center px-4 py-2 shadow-sm text-sm font-medium rounded-full text-white bg-black hover:bg-gray-800 transition-colors"
                            >
                                <FaDiscord className="h-4 w-4 mr-2" />
                                Zaloguj się
                            </button>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 rounded-full text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            {isMobileMenuOpen ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden py-2 border-t border-gray-100">
                        <div className="flex flex-col">
                            {isAuthenticated ? (
                                <>
                                    <NavLink
                                        to="/"
                                        end
                                        className={({ isActive }) =>
                                            `px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                                                isActive ? "text-black bg-[#FFFDF7]" : "text-gray-700 hover:bg-gray-50"
                                            }`
                                        }
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Kokpit
                                    </NavLink>
                                    <NavLink
                                        to="/tutors"
                                        className={({ isActive }) =>
                                            `px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                                                isActive ? "text-black bg-[#FFFDF7]" : "text-gray-700 hover:bg-gray-50"
                                            }`
                                        }
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Korepetytorzy
                                    </NavLink>
                                    <NavLink
                                        to="/courses"
                                        className={({ isActive }) =>
                                            `px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                                                isActive ? "text-black bg-[#FFFDF7]" : "text-gray-700 hover:bg-gray-50"
                                            }`
                                        }
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Kursy Maturalne
                                    </NavLink>
                                    <NavLink
                                        to="/help"
                                        className={({ isActive }) =>
                                            `px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                                                isActive ? "text-black bg-[#FFFDF7]" : "text-gray-700 hover:bg-gray-50"
                                            }`
                                        }
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Pomoc
                                    </NavLink>
                                    <NavLink
                                        to={`/user/${user.id}`}
                                        className={({ isActive }) =>
                                            `px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                                                isActive ? "text-black bg-[#FFFDF7]" : "text-gray-700 hover:bg-gray-50"
                                            }`
                                        }
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Profil
                                    </NavLink>
                                    <div className="px-4 py-3">
                                        <button
                                            onClick={() => {
                                                handleLogout()
                                                setIsMobileMenuOpen(false)
                                            }}
                                            className="w-full flex items-center justify-center px-4 py-2 shadow-sm text-sm font-medium rounded-full text-white bg-black hover:bg-gray-800 transition-colors"
                                        >
                                            <LogOut className="h-4 w-4 mr-2" />
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
                                            `px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                                                isActive ? "text-black bg-[#FFFDF7]" : "text-gray-700 hover:bg-gray-50"
                                            }`
                                        }
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Strona główna
                                    </NavLink>
                                    <NavLink
                                        to="/about"
                                        className={({ isActive }) =>
                                            `px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                                                isActive ? "text-black bg-[#FFFDF7]" : "text-gray-700 hover:bg-gray-50"
                                            }`
                                        }
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        O nas
                                    </NavLink>
                                    <NavLink
                                        to="/tutors"
                                        className={({ isActive }) =>
                                            `px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                                                isActive ? "text-black bg-[#FFFDF7]" : "text-gray-700 hover:bg-gray-50"
                                            }`
                                        }
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Korepetytorzy
                                    </NavLink>
                                    <NavLink
                                        to="/contact"
                                        className={({ isActive }) =>
                                            `px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                                                isActive ? "text-black bg-[#FFFDF7]" : "text-gray-700 hover:bg-gray-50"
                                            }`
                                        }
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Kontakt
                                    </NavLink>
                                    <div className="px-4 py-3">
                                        <button
                                            onClick={() => {
                                                openLoginModal()
                                                setIsMobileMenuOpen(false)
                                            }}
                                            className="w-full flex items-center justify-center px-4 py-2 shadow-sm text-sm font-medium rounded-full text-white bg-black hover:bg-gray-800 transition-colors"
                                        >
                                            <FaDiscord className="h-4 w-4 mr-2" />
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
    )
}

export default Navbar