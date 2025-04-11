// pages/TutorsPage.jsx
import { useState, useEffect } from "react";
import { tutorService } from "../api/services/tutorService";
import InfoTutorCard from "../components/tutorCard/InfoTutorCard.jsx";
import InfoTutorCardSkeleton from "../components/tutorCard/InfoTutorCardSkeleton.jsx";
import { useModal } from "../hooks/useModal";
import { Search, Sliders, X, Calendar, CheckCircle, Users, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

const TutorsPage = () => {
    // Tutors and pagination state
    const [tutors, setTutors] = useState([]);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [fetchError, setFetchError] = useState(null);

    // Filter state
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedSubject, setSelectedSubject] = useState("");
    const [selectedLevel, setSelectedLevel] = useState("");
    const [priceRange, setPriceRange] = useState([50, 200]);
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    // Filter options arrays
    const subjects = [
        "Matematyka",
        "Fizyka",
        "Chemia",
        "Biologia",
        "Język Polski",
        "Język Angielski",
        "Historia",
        "Geografia",
        "Informatyka",
    ];
    const levels = ["Szkoła Podstawowa", "Liceum", "Studia", "Matura"];

    // Unified modal hook for opening the tutor modal
    const { openTutorModal } = useModal();

    // Fetch tutors from API based on filters and page.
    const fetchTutors = async (pageNumber = 1, reset = false) => {
        setIsLoading(true);
        setFetchError(null);
        try {
            const params = {
                page: pageNumber,
                limit: 10,
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
            console.error("Error fetching tutors:", error);
            setFetchError("Wystąpił problem podczas pobierania danych. Spróbuj ponownie.");
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
        setSearchTerm("");
        setSelectedSubject("");
        setSelectedLevel("");
        setPriceRange([50, 200]);
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

    // Handler to open tutor modal using the modal hook
    const handleTutorInfo = (tutor) => openTutorModal(tutor);

    return (
        <div className="bg-[#FFFDF7] min-h-screen">
            {/* Hero section with big text */}
            <div className="bg-white border-b border-gray-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="py-8">
                        <div
                            className="text-center lg:text-left"
                        >
                            <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight">
                                Znajdź <span className="text-black">korepetytora</span>
                            </h1>
                            <p className="mt-4 text-lg text-gray-600">
                                Odkryj pasjonujących nauczycieli, którzy pomogą Ci osiągnąć sukces w nauce.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Quick actions section */}
                <section className="mb-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                            <div className="rounded-full bg-gray-50 p-4 mb-4">
                                <Calendar className="h-6 w-6 text-black" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Zarezerwuj lekcję</h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Znajdź odpowiedniego korepetytora i zaplanuj lekcję w dogodnym terminie
                            </p>
                            <button
                                className="mt-auto inline-flex items-center px-4 py-2 shadow-sm text-sm font-medium rounded-full text-white bg-black hover:bg-gray-800 transition-colors"
                            >
                                Zarezerwuj
                            </button>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                            <div className="rounded-full bg-gray-50 p-4 mb-4">
                                <Search className="h-6 w-6 text-black" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Znajdź korepetytora</h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Przeglądaj profile korepetytorów i wybierz najlepszego dla siebie
                            </p>
                            <button
                                className="mt-auto inline-flex items-center px-4 py-2 shadow-sm text-sm font-medium rounded-full text-white bg-black hover:bg-gray-800 transition-colors"
                            >
                                Szukaj
                            </button>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                            <div className="rounded-full bg-gray-50 p-4 mb-4">
                                <CheckCircle className="h-6 w-6 text-black" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Sprawdź opinie</h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Przeglądaj opinie i referencje innych uczniów o naszych korepetytorach
                            </p>
                            <button
                                className="mt-auto inline-flex items-center px-4 py-2 shadow-sm text-sm font-medium rounded-full text-white bg-black hover:bg-gray-800 transition-colors"
                            >
                                Zobacz opinie
                            </button>
                        </div>
                    </div>
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* LEFT SIDEBAR - FILTERS (Desktop) */}
                    <div className="hidden lg:block lg:col-span-1">
                        <div

                            className="bg-white shadow-sm border border-gray-100 rounded-xl overflow-hidden sticky top-24"
                        >
                            <div className="px-6 py-4 border-b border-gray-100 flex items-center">
                                <Sliders className="h-5 w-5 text-black mr-2" />
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
                                            <Search className="h-4 w-4 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Nazwisko lub przedmiot..."
                                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black sm:text-sm"
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
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black sm:text-sm"
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
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black sm:text-sm"
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
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Zakres cenowy (zł/h)
                                    </label>
                                    <div className="mt-2 space-y-4">
                                        <div>
                                            <div className="flex items-center justify-between mb-1 text-sm text-gray-600">
                                                <span>Cena minimalna</span>
                                                <span className="font-medium">{priceRange[0]} zł</span>
                                            </div>
                                            <input
                                                type="range"
                                                min="50"
                                                max="200"
                                                step="5"
                                                value={priceRange[0]}
                                                onChange={(e) => handlePriceChange(e, 0)}
                                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
                                            />
                                        </div>
                                        <div>
                                            <div className="flex items-center justify-between mb-1 text-sm text-gray-600">
                                                <span>Cena maksymalna</span>
                                                <span className="font-medium">{priceRange[1]} zł</span>
                                            </div>
                                            <input
                                                type="range"
                                                min="50"
                                                max="200"
                                                step="5"
                                                value={priceRange[1]}
                                                onChange={(e) => handlePriceChange(e, 1)}
                                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Clear Filters Button */}
                                <div className="pt-2">
                                    <button
                                        onClick={clearFilters}
                                        className="w-full py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50"
                                    >
                                        Wyczyść filtry
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mobile search and filters */}
                    <div className="lg:hidden w-full mb-4">
                        <div className="flex gap-2">
                            <div className="relative flex-grow">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-4 w-4 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Szukaj korepetytora..."
                                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-black focus:border-black text-sm"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <button
                                className="p-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg"
                                onClick={() => setShowMobileFilters(true)}
                            >
                                <Sliders className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    {/* Mobile filters modal */}
                    {showMobileFilters && (
                        <div className="fixed inset-0 z-50 lg:hidden">
                            <div className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm transition-opacity"></div>

                            <div className="fixed inset-y-0 right-0 max-w-full flex">
                                <div className="relative w-screen max-w-md">
                                    <div className="h-full flex flex-col bg-white shadow-xl overflow-y-auto">
                                        <div className="px-4 py-5 border-b border-gray-100 sm:px-6 flex justify-between items-center">
                                            <h2 className="text-lg font-medium text-gray-900">Filtry</h2>
                                            <button
                                                type="button"
                                                className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                                                onClick={() => setShowMobileFilters(false)}
                                            >
                                                <span className="sr-only">Close panel</span>
                                                <X className="h-5 w-5" />
                                            </button>
                                        </div>
                                        <div className="p-6 space-y-6">
                                            {/* Subject Select */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Przedmiot
                                                </label>
                                                <select
                                                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black text-sm"
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
                                                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black text-sm"
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
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                                    Zakres cenowy (zł/h)
                                                </label>
                                                <div className="space-y-4">
                                                    <div>
                                                        <div className="flex items-center justify-between mb-1 text-sm text-gray-600">
                                                            <span>Cena minimalna</span>
                                                            <span className="font-medium">{priceRange[0]} zł</span>
                                                        </div>
                                                        <input
                                                            type="range"
                                                            min="50"
                                                            max="200"
                                                            step="5"
                                                            value={priceRange[0]}
                                                            onChange={(e) => handlePriceChange(e, 0)}
                                                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
                                                        />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center justify-between mb-1 text-sm text-gray-600">
                                                            <span>Cena maksymalna</span>
                                                            <span className="font-medium">{priceRange[1]} zł</span>
                                                        </div>
                                                        <input
                                                            type="range"
                                                            min="50"
                                                            max="200"
                                                            step="5"
                                                            value={priceRange[1]}
                                                            onChange={(e) => handlePriceChange(e, 1)}
                                                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
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
                                                className="w-full py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50"
                                            >
                                                Wyczyść filtry
                                            </button>
                                            <button
                                                onClick={() => setShowMobileFilters(false)}
                                                className="w-full py-2 px-4 shadow-sm text-sm font-medium rounded-full text-white bg-black hover:bg-gray-800"
                                            >
                                                Zastosuj filtry
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* RIGHT CONTENT - TUTORS LIST */}
                    <div className="lg:col-span-3">
                        {/* Applied filters */}
                        {filtersActive && (
                            <div className="mb-6 flex flex-wrap items-center gap-2 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                <span className="text-sm text-gray-600 mr-2">Aktywne filtry:</span>
                                {selectedSubject && (
                                    <div className="flex items-center bg-gray-50 text-gray-800 px-3 py-1 rounded-full text-xs font-medium">
                                        {selectedSubject}
                                        <button onClick={() => setSelectedSubject("")} className="ml-2 text-gray-500 hover:text-gray-700">
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                )}
                                {selectedLevel && (
                                    <div className="flex items-center bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-xs font-medium">
                                        {selectedLevel}
                                        <button onClick={() => setSelectedLevel("")} className="ml-2 text-amber-500 hover:text-amber-700">
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                )}
                                {(priceRange[0] !== 50 || priceRange[1] !== 200) && (
                                    <div className="flex items-center bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                                        {priceRange[0]}-{priceRange[1]} zł/h
                                        <button onClick={() => setPriceRange([50, 200])} className="ml-2 text-gray-500 hover:text-gray-700">
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                )}
                                <button
                                    onClick={clearFilters}
                                    className="text-xs text-black hover:text-gray-800 underline ml-auto"
                                >
                                    Wyczyść wszystkie
                                </button>
                            </div>
                        )}

                        <div
                            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
                        >
                            <div className="px-6 py-4 border-b border-gray-100 flex items-center">
                                <Users className="h-5 w-5 text-black mr-2" />
                                <h2 className="text-lg font-medium text-gray-900">Dostępni korepetytorzy</h2>
                            </div>

                            <div className="p-6">
                                {isLoading && page === 1 ? (
                                    <div className="space-y-6">
                                        {Array.from({ length: 3 }).map((_, index) => (
                                            <InfoTutorCardSkeleton key={index} />
                                        ))}
                                    </div>
                                ) : fetchError ? (
                                    <div className="text-center py-12">
                                        <X
                                            className="h-12 w-12 mx-auto text-red-500 mb-4"
                                        />
                                        <p className="text-red-600 font-medium">{fetchError}</p>
                                    </div>
                                ) : tutors && tutors.length > 0 ? (
                                    <>
                                        <div className="space-y-6">
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
                                                <button
                                                    onClick={handleViewMore}
                                                    className="inline-flex items-center px-4 py-2 shadow-sm text-sm font-medium rounded-full text-white bg-black hover:bg-gray-800 transition-colors"
                                                >
                                                    Pokaż więcej
                                                </button>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="text-center py-12 space-y-4">
                                        <Search
                                            className="h-12 w-12 mx-auto text-gray-400 mb-4"
                                        />
                                        <h3 className="text-lg font-medium text-gray-900">
                                            {filtersActive
                                                ? "Brak korepetytorów dla wybranych kryteriów"
                                                : "Nie znaleziono korepetytorów"}
                                        </h3>
                                        <p className="text-gray-600 max-w-md mx-auto text-sm">
                                            Spróbuj zmienić filtry wyszukiwania lub skontaktuj się z nami.
                                        </p>
                                    </div>
                                )}
                                {isLoading && page > 1 && (
                                    <div className="flex justify-center items-center py-8">
                                        <div className="animate-spin rounded-full h-8 w-8 border-4 border-black border-t-transparent"></div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TutorsPage;