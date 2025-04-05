import { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaStar, FaSearch, FaCalendarPlus } from 'react-icons/fa';
import { motion } from 'framer-motion';

// Redux thunks for lessons and tutors
import { fetchUserLessons } from '../store/thunks/lessonThunks';
import { fetchUserTutors } from '../store/thunks/tutorsThunks';

// Cards
import LessonCard from '../components/lessonCard/LessonCard';
import TutorCard from '../components/tutorCard/TutorCard.jsx';
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
            <section className="pt-20 pb-12 bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto px-4">
                    {/* HERO SECTION */}
                    <div className="flex flex-col lg:flex-row items-center">
                        {/* LEFT: Headline, Subtext & Actions */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="lg:w-1/2 text-center lg:text-left mb-10 lg:mb-0"
                        >
                            <h1 className="text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
                                Nadchodząca <span className="text-purple-700">lekcja</span>
                            </h1>
                            <p className="mt-6 text-xl text-gray-700 max-w-lg mx-auto lg:mx-0">
                                Rozwijaj swoje umiejętności dzięki starannie zaplanowanym lekcjom.
                            </p>
                            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                <motion.button
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                    onClick={handleBookMore}
                                    className="btn bg-purple-700 hover:bg-purple-700 text-white font-semibold py-3 px-8 rounded shadow transition"
                                >
                                    <FaCalendarPlus className="mr-2" />
                                    Zarezerwuj lekcję
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                    onClick={handleSearchTutors}
                                    className="btn border border-purple-700 text-purple-700 hover:bg-gray-100 font-semibold py-3 px-8 rounded shadow transition"
                                >
                                    <FaSearch className="mr-2" />
                                    Szukaj korepetytorów
                                </motion.button>
                            </div>
                        </motion.div>

                        {/* RIGHT: Upcoming Lesson Card */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3, delay: 0.2 }}
                            className="lg:w-1/2 flex justify-center w-full"
                        >
                            {lessonsLoading ? (
                                <UpcomingLessonSkeleton />
                            ) : nextLesson ? (
                                <UpcomingLessonCard lesson={nextLesson} onInfoClick={handleLessonInfo} />
                            ) : (
                                <div className="p-6 bg-gray-100 rounded-xl text-center text-gray-600 shadow w-full h-48 flex items-center justify-center">
                                    Brak zaplanowanych lekcji
                                </div>
                            )}
                        </motion.div>
                    </div>

                    {/* TABS SECTION */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                        className="mt-12"
                    >
                        <div className="flex space-x-4 mb-8 border-b border-gray-200">
                            {['lessons', 'calendar', 'progress', 'tutors'].map((tab) => (
                                <button
                                    key={tab}
                                    className={`py-2 px-4 btn font-semibold transition border-b-2 ${
                                        activeTab === tab
                                            ? 'border-purple-700 text-purple-700'
                                            : 'border-transparent text-gray-600 hover:text-purple-700'
                                    }`}
                                    onClick={() => setActiveTab(tab)}
                                >
                                    {tab === 'lessons'
                                        ? 'Lekcje'
                                        : tab === 'calendar'
                                            ? 'Kalendarz'
                                            : tab === 'progress'
                                                ? 'Postępy'
                                                : 'Korepetytorzy'}
                                </button>
                            ))}
                        </div>

                        <div className="min-h-[500px]">
                            {activeTab === 'lessons' && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.4 }}
                                >
                                    <div className="flex space-x-4 mb-6">
                                        <button
                                            className={`py-2 px-4 btn font-medium transition rounded ${
                                                lessonTab === 'upcoming'
                                                    ? 'bg-purple-50 text-purple-700'
                                                    : 'bg-gray-50 text-gray-600 hover:text-purple-700'
                                            }`}
                                            onClick={() => setLessonTab('upcoming')}
                                        >
                                            Nadchodzące lekcje
                                        </button>
                                        <button
                                            className={`py-2 px-4 btn font-medium transition rounded ${
                                                lessonTab === 'past'
                                                    ? 'bg-purple-50 text-purple-700'
                                                    : 'bg-gray-50 text-gray-600 hover:text-purple-700'
                                            }`}
                                            onClick={() => setLessonTab('past')}
                                        >
                                            Minione lekcje
                                        </button>
                                    </div>
                                    {lessonTab === 'upcoming' && (
                                        <>
                                            {lessonsLoading ? (
                                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                                    {Array.from({ length: 4 }).map((_, i) => (
                                                        <LessonCardSkeleton key={i} />
                                                    ))}
                                                </div>
                                            ) : upcomingLessons.length > 0 ? (
                                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
                                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                                    {Array.from({ length: 4 }).map((_, i) => (
                                                        <LessonCardSkeleton key={i} />
                                                    ))}
                                                </div>
                                            ) : pastLessons.length > 0 ? (
                                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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

                            {activeTab === 'calendar' && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.4 }}
                                    className="text-center text-gray-600 mt-8"
                                >
                                    <h2 className="text-2xl font-semibold">Twój kalendarz</h2>
                                    <p className="mt-2">Wkrótce dostępne...</p>
                                </motion.div>
                            )}

                            {activeTab === 'progress' && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.4 }}
                                >
                                    <h2 className="text-2xl font-bold mb-4 text-gray-900">Twoje postępy</h2>
                                    <div className="p-6 bg-white rounded-xl shadow border">
                                        <h3 className="text-lg font-medium text-gray-700 mb-2">Ocena jako uczeń</h3>
                                        <div className="flex items-center">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <FaStar key={i} className={i < Math.round(3) ? 'text-purple-500' : 'text-gray-300'} />
                                            ))}
                                            <span className="ml-2 text-gray-600">(3.0/5)</span>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'tutors' && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.4 }}
                                >
                                    <h2 className="text-2xl font-bold mb-6 text-gray-900">Korepetytorzy</h2>
                                    {tutorsLoading ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                            {Array.from({ length: 4 }).map((_, i) => (
                                                <TutorCardSkeleton key={i} />
                                            ))}
                                        </div>
                                    ) : tutors.length > 0 ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                            {tutors.map((tutor) => (
                                                <TutorCard key={tutor.id} tutor={tutor} onInfoClick={handleTutorInfo} />
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

                {/* BADGES SECTION */}
                <div className="max-w-7xl mx-auto px-4 mt-12">
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">Odznaki</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
                        {/* Badge rendering */}
                    </div>
                </div>

                <TutorModal tutor={selectedTutor} onClose={() => setSelectedTutor(null)} />
            </section>
        </>
    );
};

export default CockpitPage;
