// pages/TutorsPage.jsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaSearch } from 'react-icons/fa';
import { tutorService } from '../api/services/tutorService';
import InfoTutorCard from '../components/tutorCard/InfoTutorCard.jsx';
import InfoTutorCardSkeleton from '../components/tutorCard/InfoTutorCardSkeleton.jsx';
// Instead of using a local modal component, we now use the unified modal hook.
import { useModal } from '../hooks/useModal';

const TutorsPage = () => {
    // Tutors and pagination state
    const [tutors, setTutors] = useState([]);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [fetchError, setFetchError] = useState(null);

    // Filter state
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');
    const [selectedLevel, setSelectedLevel] = useState('');
    const [priceRange, setPriceRange] = useState([50, 200]);
    const [showPricePopup, setShowPricePopup] = useState(false);

    // Filter options arrays
    const subjects = [
        'Matematyka',
        'Fizyka',
        'Chemia',
        'Biologia',
        'Język Polski',
        'Język Angielski',
        'Historia',
        'Geografia',
        'Informatyka',
    ];
    const levels = ['Szkoła Podstawowa', 'Liceum', 'Studia', 'Matura'];

    // Unified modal hook for opening the tutor modal
    const { openTutorModal } = useModal();

    // Fetch tutors from API based on filters and page.
    const fetchTutors = async (pageNumber = 1, reset = false) => {
        setIsLoading(true);
        setFetchError(null);
        try {
            const params = {
                page: pageNumber,
                limit: 20,
                search: searchTerm,
                subject: selectedSubject,
                level: selectedLevel,
                minPrice: priceRange[0],
                maxPrice: priceRange[1],
            };

            const response = await tutorService.searchTutors(params);
            // Default to empty array if tutors is null
            const fetchedTutors = response.data.tutors || [];
            if (reset) {
                setTutors(fetchedTutors);
            } else {
                setTutors((prev) => [...prev, ...fetchedTutors]);
            }
            setTotal(response.data.total || 0);
            setPage(pageNumber);
        } catch (error) {
            console.error('Error fetching tutors:', error);
            setFetchError('Wystąpił problem podczas pobierania danych. Spróbuj ponownie.');
        } finally {
            setIsLoading(false);
        }
    };

    // Re-fetch tutors when filters change (reset to page 1)
    useEffect(() => {
        fetchTutors(1, true);
    }, [searchTerm, selectedSubject, selectedLevel, priceRange]);

    // Handler for slider changes
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
        setSelectedLevel('');
        setPriceRange([50, 200]);
        setShowPricePopup(false);
    };

    // Handler for "View More" button
    const handleViewMore = () => {
        if (tutors.length < total) {
            fetchTutors(page + 1);
        }
    };

    // Check if any filter is active (for messaging purposes)
    const filtersActive =
        searchTerm || selectedSubject || selectedLevel || priceRange[0] !== 50 || priceRange[1] !== 200;

    // Handler to open tutor modal using the new modal hook
    const handleTutorInfo = (tutor) => openTutorModal(tutor);

    return (
        <section className="pt-24 pb-16 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* HERO SECTION */}
                <div className="flex flex-col lg:flex-row items-center gap-12 mb-16">
                    {/* Left: Headline & Subtext */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="lg:w-1/2 text-center lg:text-left"
                    >
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                            Znajdź swojego{' '}
                            <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                korepetytora
              </span>
                        </h1>
                        <p className="mt-4 text-lg text-gray-600 max-w-xl lg:pr-8">
                            Odkryj pasjonujących nauczycieli, którzy pomogą Ci osiągnąć sukces w nauce.
                        </p>
                    </motion.div>

                    {/* Right: Search & Filters Card */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="lg:w-1/2 w-full"
                    >
                        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                            <div className="space-y-4">
                                {/* Search Input */}
                                <div className="relative">
                                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Szukaj korepetytora..."
                                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>

                                {/* Subject Select */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Przedmiot
                                    </label>
                                    <select
                                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500"
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

                                {/* Level Select */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Poziom nauczania
                                    </label>
                                    <select
                                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500"
                                        value={selectedLevel}
                                        onChange={(e) => setSelectedLevel(e.target.value)}
                                    >
                                        <option value="">Wszystkie poziomy</option>
                                        {levels.map((level) => (
                                            <option key={level} value={level}>
                                                {level}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Price Filter */}
                                <div className="relative">
                                    <button
                                        onClick={() => setShowPricePopup(!showPricePopup)}
                                        className="w-full py-2.5 px-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg shadow-sm transition-colors"
                                    >
                                        Cena: {priceRange[0]} - {priceRange[1]} zł
                                    </button>
                                    {showPricePopup && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="absolute left-0 right-0 mt-2 p-4 bg-white rounded-xl shadow-xl border border-gray-100"
                                        >
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="text-sm font-medium text-gray-700">
                                                        Zakres cenowy (zł/h)
                                                    </label>
                                                    <div className="mt-2 space-y-3">
                                                        <div className="flex items-center gap-3">
                                                            <input
                                                                type="range"
                                                                min="50"
                                                                max="200"
                                                                step="5"
                                                                value={priceRange[0]}
                                                                onChange={(e) => handlePriceChange(e, 0)}
                                                                className="w-full accent-purple-600"
                                                            />
                                                            <span className="text-sm font-medium text-purple-600 w-12">
                                {priceRange[0]}
                              </span>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <input
                                                                type="range"
                                                                min="50"
                                                                max="200"
                                                                step="5"
                                                                value={priceRange[1]}
                                                                onChange={(e) => handlePriceChange(e, 1)}
                                                                className="w-full accent-purple-600"
                                                            />
                                                            <span className="text-sm font-medium text-purple-600 w-12">
                                {priceRange[1]}
                              </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </div>

                                {/* Clear Filters */}
                                <button
                                    onClick={clearFilters}
                                    className="w-full py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
                                >
                                    Wyczyść filtry
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Tutors Grid */}
                <div className="mt-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8">Korepetytorzy</h2>
                    {isLoading && page === 1 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {Array.from({ length: 6 }).map((_, index) => (
                                <InfoTutorCardSkeleton key={index} />
                            ))}
                        </div>
                    ) : fetchError ? (
                        <div className="text-center py-12">
                            <p className="text-red-600 font-medium">{fetchError}</p>
                        </div>
                    ) : tutors && tutors.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {tutors.map((tutor) => (
                                    <InfoTutorCard
                                        key={tutor.id}
                                        tutor={tutor}
                                        onInfoClick={handleTutorInfo}
                                    />
                                ))}
                            </div>
                            {tutors.length < total && !isLoading && (
                                <div className="mt-8 flex justify-center">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleViewMore}
                                        className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg shadow-md transition-all"
                                    >
                                        Pokaż więcej
                                    </motion.button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-12 space-y-4">
                            <div className="text-6xl">😕</div>
                            <h3 className="text-xl font-semibold text-gray-900">
                                {filtersActive
                                    ? 'Brak korepetytorów dla wybranych kryteriów'
                                    : 'Nie znaleziono korepetytorów'}
                            </h3>
                            <p className="text-gray-600 max-w-md mx-auto">
                                Spróbuj zmienić filtry wyszukiwania lub skontaktuj się z nami.
                            </p>
                        </div>
                    )}
                    {isLoading && page > 1 && (
                        <div className="flex justify-center items-center py-8">
                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default TutorsPage;
