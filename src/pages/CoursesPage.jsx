// pages/CoursesPage.jsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaSearch } from 'react-icons/fa';
import { courseService } from '../api/services/courseService';
import InfoCourseCard from '../components/courseCard/InfoCourseCard.jsx';
// Remove the local CourseModal import
import { useModal } from '../hooks/useModal';

const CoursesPage = () => {
    // Local state for courses and loading flag
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filter state
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');
    const [priceRange, setPriceRange] = useState([100, 5000]);
    const [showPricePopup, setShowPricePopup] = useState(false);

    // Filter options for subjects
    const subjects = ['Matematyka', 'Język Polski', 'Fizyka', 'Chemia', 'Biologia', 'Historia'];

    // Unified modal hook for opening course modal
    const { openCourseModal } = useModal();

    // Fetch courses from API when the component mounts or filters change.
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                setLoading(true);
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
        setPriceRange([100, 5000]);
        setShowPricePopup(false);
    };

    return (
        <>
            <section className="pt-24 pb-16 bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* HERO SECTION */}
                    <div className="flex flex-col lg:flex-row items-center gap-12 mb-16">
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

                        {/* SEARCH & FILTERS CARD */}
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
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Przedmiot</label>
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
                                                        <label className="text-sm font-medium text-gray-700">Zakres cenowy (zł/h)</label>
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
                                                                <span className="text-sm font-medium text-purple-600 w-12">{priceRange[0]}</span>
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
                                                                <span className="text-sm font-medium text-purple-600 w-12">{priceRange[1]}</span>
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
                                    <InfoCourseCard
                                        key={course.id}
                                        course={course}
                                        onInfoClick={() => openCourseModal(course)}
                                    />
                                ))}
                            </motion.div>
                        ) : (
                            <div className="text-center py-12 space-y-4">
                                <div className="text-6xl">😕</div>
                                <h3 className="text-xl font-semibold text-gray-900">
                                    {searchTerm || selectedSubject || priceRange[0] !== 100 || priceRange[1] !== 5000
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
        </>
    );
};

export default CoursesPage;
