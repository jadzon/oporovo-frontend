import { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaStar, FaSearch, FaCalendarPlus } from 'react-icons/fa';
import { motion } from 'framer-motion';

// Redux thunks for lessons and tutors
import { fetchUserLessons } from '../store/thunks/lessonThunks';
import { fetchUserTutors } from '../store/thunks/tutorsThunks';

// Cards
import LessonCard from '../components/lessonCard/LessonCard';
import TutorCard from '../components/home/TutorCard';
import UpcomingLessonCard from '../components/lessonCard/UpcomingLessonCard';

// Skeletons
import {
    LessonCardSkeleton,
    TutorCardSkeleton,
    UpcomingLessonSkeleton,
} from '../components/ui/Skeleton';

// Modal component for tutor info
import TutorModal from '../components/tutorModal/TutorModal';

const CockpitPage = () => {
    const dispatch = useDispatch();

    // Get current user from auth slice
    const { user } = useSelector((state) => state.auth);
    const { lessons, loading: lessonsLoading } = useSelector((state) => state.lessons);
    const { tutors, loading: tutorsLoading } = useSelector((state) => state.tutors);

    const [activeTab, setActiveTab] = useState('lessons');
    const [lessonTab, setLessonTab] = useState('upcoming');
    const [selectedTutor, setSelectedTutor] = useState(null);

    useEffect(() => {
        if (user?.id) {
            dispatch(fetchUserLessons(user.id));
            dispatch(fetchUserTutors(user.id));
        }
    }, [dispatch, user]);

    const now = new Date();

    // Memoize filtering for performance
    const upcomingConfirmed = useMemo(() => {
        return lessons
            .filter(
                (lesson) =>
                    new Date(lesson.start_time) > now && lesson.status === 'confirmed'
            )
            .sort((a, b) => new Date(a.start_time) - new Date(b.start_time));
    }, [lessons, now]);

    // Choose the next lesson from the confirmed upcoming ones
    const nextLesson = upcomingConfirmed[0] || null;
    console.log("NEXT LESSON:", nextLesson);

    // Split lessons into upcoming and past
    const upcomingLessons = useMemo(
        () => lessons.filter((lesson) => new Date(lesson.start_time) > now),
        [lessons, now]
    );
    const pastLessons = useMemo(
        () => lessons.filter((lesson) => new Date(lesson.start_time) <= now),
        [lessons, now]
    );

    // Handlers
    const handleBookMore = () => alert('Zarezerwuj kolejną lekcję...');
    const handleSearchTutors = () => alert('Przekierowanie do wyszukiwania...');
    const handleLessonInfo = (lesson) =>
        alert(`Informacje o lekcji:\n${lesson.title} – ${lesson.status}`);
    const handleTutorInfo = (tutor) => setSelectedTutor(tutor);

    return (
        <>
            <section className="pt-24 pb-12 bg-white min-h-screen">
                <div className="container-custom">
                    {/* ---------- HERO-LIKE TOP SECTION ---------- */}
                    <div className="flex flex-col lg:flex-row items-center">
                        {/* LEFT: Big Title + Subtext + 2 Buttons */}
                        <motion.div
                            initial={{ opacity: 0, x: 0 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0,delay: 0 }}
                            className="lg:w-1/2 text-center lg:text-left mb-10 lg:mb-0"
                        >
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                                Nadchodząca <span className="text-purple-600">lekcja</span>
                            </h1>
                            <p className="mt-6 text-xl text-gray-600 max-w-lg mx-auto lg:mx-0">
                                Sprawdź szczegóły i zarezerwuj kolejne spotkanie już teraz!
                            </p>
                            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleBookMore}
                                    className="btn btn-primary py-3 px-8 text-lg"
                                >
                                    <FaCalendarPlus className="mr-2" />
                                    Zarezerwuj lekcję
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleSearchTutors}
                                    className="btn btn-outline py-3 px-8 text-lg"
                                >
                                    <FaSearch className="mr-2" />
                                    Szukaj korepetytorów
                                </motion.button>
                            </div>
                        </motion.div>

                        {/* RIGHT: Upcoming Lesson Card */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.1, delay: 0.1 }}
                            className="lg:w-1/2 flex justify-center w-full"
                        >
                            {lessonsLoading ? (
                                <div className="w-full">
                                    <UpcomingLessonSkeleton />
                                </div>
                            ) : nextLesson ? (
                                <div className="w-full">
                                    <UpcomingLessonCard lesson={nextLesson} onInfoClick={handleLessonInfo} />
                                </div>
                            ) : (
                                <div className="p-4 bg-gray-50 rounded-xl text-center text-gray-500 shadow w-full h-48 flex items-center justify-center">
                                    Brak zaplanowanych lekcji
                                </div>
                            )}
                        </motion.div>
                    </div>

                    {/* ---------- TABS BELOW ---------- */}
                    <motion.div
                        initial={{ opacity: 0,y: 50,x: 0 }}
                        animate={{ opacity: 1,y: 0, x: 0 }}
                        transition={{ duration: 0.1, delay: 0.1 }}
                        className="mt-12"
                    >
                        {/* Main Tabs */}
                        <div className="flex space-x-4 mb-8">
                            <button
                                className={`btn px-4 py-2 rounded-md font-semibold transition ${
                                    activeTab === 'lessons'
                                        ? 'bg-purple-100 text-purple-600'
                                        : 'bg-gray-100 text-gray-700 hover:text-purple-600'
                                }`}
                                onClick={() => setActiveTab('lessons')}
                            >
                                Lekcje
                            </button>
                            <button
                                className={`btn px-4 py-2 rounded-md font-semibold transition ${
                                    activeTab === 'calendar'
                                        ? 'bg-purple-100 text-purple-600'
                                        : 'bg-gray-100 text-gray-700 hover:text-purple-600'
                                }`}
                                onClick={() => setActiveTab('calendar')}
                            >
                                Kalendarz
                            </button>
                            <button
                                className={`btn px-4 py-2 rounded-md font-semibold transition ${
                                    activeTab === 'progress'
                                        ? 'bg-purple-100 text-purple-600'
                                        : 'bg-gray-100 text-gray-700 hover:text-purple-600'
                                }`}
                                onClick={() => setActiveTab('progress')}
                            >
                                Postępy
                            </button>
                            <button
                                className={`btn px-4 py-2 rounded-md font-semibold transition ${
                                    activeTab === 'tutors'
                                        ? 'bg-purple-100 text-purple-600'
                                        : 'bg-gray-100 text-gray-700 hover:text-purple-600'
                                }`}
                                onClick={() => setActiveTab('tutors')}
                            >
                                Korepetytorzy
                            </button>
                        </div>

                        {/* Tab Content */}
                        <div className="min-h-[500px]">
                            {/* LESSONS TAB */}
                            {activeTab === 'lessons' && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                                    {/* Sub-tabs: upcoming / past */}
                                    <div className="flex space-x-4 mb-8">
                                        <button
                                            className={`btn px-4 py-2 rounded-md font-medium ${
                                                lessonTab === 'upcoming'
                                                    ? 'bg-purple-50 text-purple-600'
                                                    : 'bg-gray-50 text-gray-600 hover:text-purple-600'
                                            }`}
                                            onClick={() => setLessonTab('upcoming')}
                                        >
                                            Nadchodzące lekcje
                                        </button>
                                        <button
                                            className={`btn px-4 py-2 rounded-md font-medium ${
                                                lessonTab === 'past'
                                                    ? 'bg-purple-50 text-purple-600'
                                                    : 'bg-gray-50 text-gray-600 hover:text-purple-600'
                                            }`}
                                            onClick={() => setLessonTab('past')}
                                        >
                                            Minione lekcje
                                        </button>
                                    </div>

                                    {lessonTab === 'upcoming' && (
                                        <>
                                            {lessonsLoading ? (
                                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                                    {Array.from({ length: 4 }).map((_, i) => (
                                                        <LessonCardSkeleton key={i} />
                                                    ))}
                                                </div>
                                            ) : upcomingLessons.length > 0 ? (
                                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                                    {upcomingLessons.map((les) => (
                                                        <LessonCard key={les.id} lesson={les} onInfoClick={handleLessonInfo} />
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-center text-gray-600 mt-8">
                                                    Brak nadchodzących lekcji
                                                </div>
                                            )}
                                        </>
                                    )}

                                    {lessonTab === 'past' && (
                                        <>
                                            {lessonsLoading ? (
                                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                                    {Array.from({ length: 4 }).map((_, i) => (
                                                        <LessonCardSkeleton key={i} />
                                                    ))}
                                                </div>
                                            ) : pastLessons.length > 0 ? (
                                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                                    {pastLessons.map((les) => (
                                                        <LessonCard key={les.id} lesson={les} onInfoClick={handleLessonInfo} />
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-center text-gray-600 mt-8">
                                                    Brak minionych lekcji
                                                </div>
                                            )}
                                        </>
                                    )}
                                </motion.div>
                            )}

                            {/* CALENDAR TAB */}
                            {activeTab === 'calendar' && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.5 }}
                                    className="text-center text-gray-600 mt-8"
                                >
                                    <h2 className="text-xl font-semibold">Twój kalendarz</h2>
                                    <p className="mt-2">Wkrótce dostępne...</p>
                                </motion.div>
                            )}

                            {/* PROGRESS TAB */}
                            {activeTab === 'progress' && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                                    <h2 className="text-2xl font-bold mb-4 text-gray-800">
                                        Twoje postępy
                                    </h2>
                                    <div className="p-6 bg-gray-50 rounded-xl shadow mb-6">
                                        <h3 className="text-lg font-medium text-gray-700 mb-2">
                                            Ocena jako uczeń
                                        </h3>
                                        <div className="flex items-center">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <FaStar
                                                    key={i}
                                                    className={i < Math.round(3) ? 'text-yellow-400' : 'text-gray-300'}
                                                />
                                            ))}
                                            <span className="ml-2 text-gray-600">(3.0/5)</span>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* TUTORS TAB */}
                            {activeTab === 'tutors' && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                                    <h2 className="text-2xl font-bold mb-6 text-gray-800">Korepetytorzy</h2>
                                    {tutorsLoading ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                            {Array.from({ length: 4 }).map((_, i) => (
                                                <TutorCardSkeleton key={i} />
                                            ))}
                                        </div>
                                    ) : tutors.length > 0 ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                            {tutors.map((tutor) => (
                                                <TutorCard
                                                    key={tutor.id}
                                                    tutor={tutor}
                                                    onInfoClick={handleTutorInfo}
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center text-gray-600">
                                            Brak korepetytorów do wyświetlenia
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                </div>

                {/* ------ BOTTOM: ODZNAKI ------ */}
                <div className="container-custom mt-12">
                    <h3 className="text-xl font-medium text-gray-700 mb-4">Odznaki</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
                        {/* Badge rendering */}
                    </div>
                </div>

                {/* Tutor Modal */}
                <TutorModal tutor={selectedTutor} onClose={() => setSelectedTutor(null)} />
            </section>
        </>
    );
};

export default CockpitPage;
