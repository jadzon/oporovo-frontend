// pages/CoursesPage.jsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { courseService } from '../api/services/courseService';
import InfoCourseCard from '../components/courseCard/InfoCourseCard.jsx';
import { useModal } from '../hooks/useModal';
import {FaSliders} from "react-icons/fa6";

const CoursesPage = () => {
    // Local state for courses and loading flag
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState(null);

    // Filter state
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');
    const [priceRange, setPriceRange] = useState([100, 6000]);
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    // Filter options for subjects
    const subjects = ['Matematyka', 'Język Polski', 'Fizyka', 'Chemia', 'Biologia', 'Historia'];

    // Unified modal hook for opening course modal
    const { openCourseModal } = useModal();

    // Fetch courses from API when the component mounts or filters change.
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                setLoading(true);
                setFetchError(null);
                const params = {
                    subject: selectedSubject || undefined,
                    page: 1,
                    limit: 20,
                };
                const response = await courseService.getCourses(params);
                // Ensure we always have an array to avoid crashes
                const coursesData = Array.isArray(response.data) ? response.data : [];
                setCourses(coursesData);
            } catch (error) {
                console.error('Error fetching courses:', error);
                setCourses([]);
                setFetchError('Wystąpił problem podczas pobierania danych. Spróbuj ponownie.');
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, [selectedSubject]);

    // Filter courses on the client side using lower-case keys.
    const filteredCourses = courses.filter((course) => {
        const matchSearch = (course.name || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchSubject = selectedSubject ? course.subject === selectedSubject : true;
        const priceNumber = course.price ? parseInt(course.price, 10) : 0;
        const matchPrice = course.price ? (priceNumber >= priceRange[0] && priceNumber <= priceRange[1]) : true;
        return matchSearch && matchSubject && matchPrice;
    });

    const handlePriceChange = (e, index) => {
        const newValue = parseInt(e.target.value, 10);
        setPriceRange((prev) => {
            const newRange = [...prev];
            newRange[index] = newValue;
            return newRange;
        });
    };

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedSubject('');
        setPriceRange([100, 6000]);
    };

    // Check if any filter is active (for messaging purposes)
    const filtersActive = searchTerm || selectedSubject || priceRange[0] !== 100 || priceRange[1] !== 6000;

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Hero section with big text */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="py-8">
                        <motion.div
                            initial={{opacity: 0, y: 20}}
                            animate={{opacity: 1, y: 0}}
                            transition={{duration: 0.5}}
                            className="text-center lg:text-left"
                        >
                            <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight">
                                Kursy przygotowujące do <span className="text-blue-900">matury</span>
                            </h1>
                            <p className="mt-4 text-lg text-gray-700">
                                Znajdź kurs, który pomoże Ci opanować wszystkie zagadnienia niezbędne do zdania matury.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* LEFT SIDEBAR - FILTERS (Desktop) */}
                    <div className="hidden lg:block lg:col-span-1">
                        <motion.div
                            initial={{opacity: 0, x: -20}}
                            animate={{opacity: 1, x: 0}}
                            transition={{duration: 0.5}}
                            className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden sticky top-24">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h2 className="text-lg font-medium text-gray-900">Filtry wyszukiwania</h2>
                            </div>
                            <div className="p-6 space-y-5">
                                {/* Search Input */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Szukaj
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FaSearch className="h-4 w-4 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Nazwa kursu..."
                                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* Subject Select */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Przedmiot
                                    </label>
                                    <select
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        value={selectedSubject}
                                        onChange={(e) => setSelectedSubject(e.target.value)}
                                    >
                                        <option value="">Wszystkie przedmioty</option>
                                        {subjects.map((subject) => (
                                            <option key={subject} value={subject}>
                                                {subject}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Price Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Zakres cenowy (zł)
                                    </label>
                                    <div className="mt-2 space-y-4">
                                        <div>
                                            <div className="flex items-center justify-between mb-1 text-sm text-gray-600">
                                                <span>Cena minimalna</span>
                                                <span className="font-medium">{priceRange[0]} zł</span>
                                            </div>
                                            <input
                                                type="range"
                                                min="100"
                                                max="6000"
                                                step="100"
                                                value={priceRange[0]}
                                                onChange={(e) => handlePriceChange(e, 0)}
                                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-900"
                                            />
                                        </div>
                                        <div>
                                            <div className="flex items-center justify-between mb-1 text-sm text-gray-600">
                                                <span>Cena maksymalna</span>
                                                <span className="font-medium">{priceRange[1]} zł</span>
                                            </div>
                                            <input
                                                type="range"
                                                min="100"
                                                max="6000"
                                                step="100"
                                                value={priceRange[1]}
                                                onChange={(e) => handlePriceChange(e, 1)}
                                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-900"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Clear Filters Button */}
                                <div className="pt-2">
                                    <button
                                        onClick={clearFilters}
                                        className="w-full py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                    >
                                        Wyczyść filtry
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Mobile search and filters */}
                    <div className="lg:hidden w-full mb-4">
                        <div className="flex gap-2">
                            <div className="relative flex-grow">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaSearch className="h-4 w-4 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Szukaj kursu..."
                                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <button
                                className="p-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg"
                                onClick={() => setShowMobileFilters(true)}
                            >
                                <FaSliders className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    {/* Mobile filters modal */}
                    {showMobileFilters && (
                        <div className="fixed inset-0 z-50 lg:hidden">
                            <div className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

                            <div className="fixed inset-y-0 right-0 max-w-full flex">
                                <div className="relative w-screen max-w-md">
                                    <div className="h-full flex flex-col bg-white shadow-xl overflow-y-auto">
                                        <div className="px-4 py-5 border-b border-gray-200 sm:px-6 flex justify-between items-center">
                                            <h2 className="text-lg font-medium text-gray-900">Filtry</h2>
                                            <button
                                                type="button"
                                                className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                                                onClick={() => setShowMobileFilters(false)}
                                            >
                                                <span className="sr-only">Close panel</span>
                                                <FaTimes className="h-5 w-5" />
                                            </button>
                                        </div>
                                        <div className="p-6 space-y-6">
                                            {/* Subject Select */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Przedmiot
                                                </label>
                                                <select
                                                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                                                    value={selectedSubject}
                                                    onChange={(e) => setSelectedSubject(e.target.value)}
                                                >
                                                    <option value="">Wszystkie przedmioty</option>
                                                    {subjects.map((subject) => (
                                                        <option key={subject} value={subject}>
                                                            {subject}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            {/* Price Filter */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                                    Zakres cenowy (zł)
                                                </label>
                                                <div className="space-y-4">
                                                    <div>
                                                        <div className="flex items-center justify-between mb-1 text-sm text-gray-600">
                                                            <span>Cena minimalna</span>
                                                            <span className="font-medium">{priceRange[0]} zł</span>
                                                        </div>
                                                        <input
                                                            type="range"
                                                            min="100"
                                                            max="6000"
                                                            step="100"
                                                            value={priceRange[0]}
                                                            onChange={(e) => handlePriceChange(e, 0)}
                                                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-900"
                                                        />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center justify-between mb-1 text-sm text-gray-600">
                                                            <span>Cena maksymalna</span>
                                                            <span className="font-medium">{priceRange[1]} zł</span>
                                                        </div>
                                                        <input
                                                            type="range"
                                                            min="100"
                                                            max="6000"
                                                            step="100"
                                                            value={priceRange[1]}
                                                            onChange={(e) => handlePriceChange(e, 1)}
                                                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-900"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-6 border-t border-gray-200 space-y-4 mt-auto">
                                            <button
                                                onClick={() => {
                                                    clearFilters();
                                                    setShowMobileFilters(false);
                                                }}
                                                className="w-full py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                            >
                                                Wyczyść filtry
                                            </button>
                                            <button
                                                onClick={() => setShowMobileFilters(false)}
                                                className="w-full py-2 px-4 shadow-sm text-sm font-medium rounded-md text-white bg-blue-900 hover:bg-blue-800"
                                            >
                                                Zastosuj filtry
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* RIGHT CONTENT - COURSES LIST */}
                    <div className="lg:col-span-3">
                        {/* Applied filters */}
                        {filtersActive && (
                            <div className="mb-6 flex flex-wrap items-center gap-2 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                                <span className="text-sm text-gray-600 mr-2">Aktywne filtry:</span>
                                {selectedSubject && (
                                    <div className="flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                                        {selectedSubject}
                                        <button onClick={() => setSelectedSubject('')} className="ml-2 text-blue-500 hover:text-blue-700">
                                            <FaTimes className="h-3 w-3" />
                                        </button>
                                    </div>
                                )}
                                {(priceRange[0] !== 100 || priceRange[1] !== 6000) && (
                                    <div className="flex items-center bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                                        {priceRange[0]}-{priceRange[1]} zł
                                        <button onClick={() => setPriceRange([100, 6000])} className="ml-2 text-gray-500 hover:text-gray-700">
                                            <FaTimes className="h-3 w-3" />
                                        </button>
                                    </div>
                                )}
                                <button
                                    onClick={clearFilters}
                                    className="text-xs text-blue-900 hover:text-blue-700 underline ml-auto"
                                >
                                    Wyczyść wszystkie
                                </button>
                            </div>
                        )}

                        <motion.div
                            initial={{opacity: 0, x: 20}}
                            animate={{opacity: 1, x: 0}}
                            transition={{duration: 0.5}}
                            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h2 className="text-lg font-medium text-gray-900">Dostępne kursy</h2>
                            </div>

                            <div className="p-6">
                                {loading ? (
                                    <div className="space-y-6">
                                        {Array.from({ length: 3 }).map((_, index) => (
                                            <div key={index} className="bg-gray-100 h-32 rounded-lg animate-pulse" />
                                        ))}
                                    </div>
                                ) : fetchError ? (
                                    <div className="text-center py-12">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-12 w-12 mx-auto text-red-500 mb-4"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                            />
                                        </svg>
                                        <p className="text-red-600 font-medium">{fetchError}</p>
                                    </div>
                                ) : filteredCourses.length > 0 ? (
                                    <div className="space-y-6">
                                        {filteredCourses.map((course) => (
                                            <InfoCourseCard
                                                key={course.id}
                                                course={course}
                                                onInfoClick={() => openCourseModal(course)}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 space-y-4">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-12 w-12 mx-auto text-gray-400 mb-4"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                        <h3 className="text-lg font-medium text-gray-900">
                                            {filtersActive
                                                ? 'Brak kursów dla wybranych kryteriów'
                                                : 'Nie znaleziono kursów'}
                                        </h3>
                                        <p className="text-gray-600 max-w-md mx-auto text-sm">
                                            Spróbuj zmienić filtry wyszukiwania lub skontaktuj się z nami.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CoursesPage;