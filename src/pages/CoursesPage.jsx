// src/pages/CoursesPage.jsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaSearch } from 'react-icons/fa';

const CoursesPage = () => {
    // Local state for courses and loading flag
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filter state
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');
    const [priceRange, setPriceRange] = useState([100, 500]);
    const [showPricePopup, setShowPricePopup] = useState(false);

    // Mock filter options for subjects
    const subjects = ['Matematyka', 'Język Polski', 'Fizyka', 'Chemia', 'Biologia', 'Historia'];

    // Simulate fetching courses (replace this with an API call if needed)
    useEffect(() => {
        setTimeout(() => {
            setCourses([
                {
                    id: 1,
                    title: 'Matematyka Maturalna – Kompleksowy Kurs',
                    description:
                        'Poznaj zagadnienia od podstaw do zaawansowanych zadań maturalnych. Kurs obejmuje teorię, zadania i testy.',
                    image: '/images/courses/math.jpg',
                    price: '299 zł',
                    subject: 'Matematyka',
                },
                {
                    id: 2,
                    title: 'Język Polski Maturalny – Esej i Analiza',
                    description:
                        'Naucz się analizować teksty literackie, pisać eseje i interpretować wiersze. Wszystko, czego potrzebujesz do egzaminu.',
                    image: '/images/courses/polish.jpg',
                    price: '249 zł',
                    subject: 'Język Polski',
                },
                {
                    id: 3,
                    title: 'Fizyka Maturalna – Od Podstaw do Zadań',
                    description:
                        'Kurs przygotowujący do matury z fizyki z praktycznymi zadaniami i przykładami, które ułatwią zrozumienie trudnych zagadnień.',
                    image: '/images/courses/physics.jpg',
                    price: '279 zł',
                    subject: 'Fizyka',
                },
                {
                    id: 4,
                    title: 'Chemia Maturalna – Kluczowe Zagadnienia',
                    description:
                        'Zrozumienie chemii maturalnej dzięki kompleksowemu kursowi obejmującemu teorię, zadania i eksperymenty.',
                    image: '/images/courses/chemistry.jpg',
                    price: '269 zł',
                    subject: 'Chemia',
                },
            ]);
            setLoading(false);
        }, 1500);
    }, []);

    // Filter courses based on search term, subject, and price range.
    const filteredCourses = courses.filter(course => {
        const matchSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchSubject = selectedSubject ? course.subject === selectedSubject : true;
        const priceNumber = parseInt(course.price);
        const matchPrice = priceNumber >= priceRange[0] && priceNumber <= priceRange[1];
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
        setPriceRange([100, 500]);
        setShowPricePopup(false);
    };

    return (
        <section className="pt-24 pb-16 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* HERO SECTION */}
                <div className="flex flex-col lg:flex-row items-center gap-12 mb-16">
                    {/* Left: Big Title & Subtext */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="lg:w-1/2 text-center lg:text-left"
                    >
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                            Kursy przygotowujące do{' '}
                            <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                matury
              </span>
                        </h1>
                        <p className="mt-4 text-lg text-gray-600 max-w-xl lg:pr-8">
                            Znajdź kurs, który pomoże Ci opanować wszystkie zagadnienia niezbędne do zdania matury.
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
                                        placeholder="Szukaj kursu..."
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
                                                                min="100"
                                                                max="500"
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
                                                                min="100"
                                                                max="500"
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

                {/* COURSES GRID */}
                <div className="mt-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8">Kursy przygotowujące do matury</h2>
                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {Array.from({ length: 3 }).map((_, index) => (
                                <motion.div
                                    key={index}
                                    className="bg-white rounded-xl shadow-lg p-6"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                >
                                    <div className="h-40 bg-gray-200 rounded-md" />
                                    <div className="mt-4 h-6 bg-gray-200 rounded" />
                                    <div className="mt-2 h-4 bg-gray-200 rounded" />
                                </motion.div>
                            ))}
                        </div>
                    ) : filteredCourses.length > 0 ? (
                        <motion.div
                            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.6 }}
                        >
                            {filteredCourses.map((course) => (
                                <motion.div
                                    key={course.id}
                                    className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col"
                                    whileHover={{ scale: 1.02 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <div className="h-48 w-full overflow-hidden">
                                        <img
                                            src={course.image}
                                            alt={course.title}
                                            className="object-cover w-full h-full"
                                        />
                                    </div>
                                    <div className="p-6 flex-1 flex flex-col justify-between">
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900">{course.title}</h3>
                                            <p className="mt-2 text-gray-700">{course.description}</p>
                                        </div>
                                        <div className="mt-4 flex items-center justify-between">
                                            <span className="text-lg font-bold text-purple-700">{course.price}</span>
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="px-4 py-2 bg-purple-700 text-white rounded-lg shadow-md transition-colors"
                                                onClick={() => alert(`Więcej informacji o kursie "${course.title}"`)}
                                            >
                                                Dowiedz się więcej
                                            </motion.button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <div className="text-center py-12 space-y-4">
                            <div className="text-6xl">😕</div>
                            <h3 className="text-xl font-semibold text-gray-900">
                                {searchTerm || selectedSubject || priceRange[0] !== 100 || priceRange[1] !== 500
                                    ? 'Brak kursów dla wybranych kryteriów'
                                    : 'Nie znaleziono kursów'}
                            </h3>
                            <p className="text-gray-600 max-w-md mx-auto">
                                Spróbuj zmienić filtry wyszukiwania lub skontaktuj się z nami.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default CoursesPage;
