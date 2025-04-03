// src/pages/CockpitPage.jsx
import { useState, useEffect } from 'react';
import { FaStar, FaSearch, FaCalendarPlus } from 'react-icons/fa';
import { motion } from 'framer-motion';

// Cards
import LessonCard from '../components/lessonCard/LessonCard';
import TutorCard from '../components/home/TutorCard';
// The bigger upcoming lesson card
import UpcomingLessonCard from '../components/lessonCard/UpcomingLessonCard';

// Skeletons
import {
    LessonCardSkeleton,
    TutorCardSkeleton,
    UpcomingLessonSkeleton,
} from '../components/ui/Skeleton';

const MockUpcomingLessons = [
    {
        id: 1,
        image: '/images/tutors/anna_k.jpg',
        fullName: 'Anna Kowalska',
        discordName: 'AnnaK#1234',
        mainSubject: 'Matematyka',
        subTopic: 'Granice i rachunek różniczkowy',
        date: '2025-06-10 15:00',
    },
    {
        id: 2,
        image: '/images/tutors/piotr_n.jpg',
        fullName: 'Piotr Nowak',
        discordName: 'PiotrNowak#6789',
        mainSubject: 'Angielski',
        subTopic: 'Konwersacje z native speakerem',
        date: '2025-06-12 18:00',
    },
];

const MockPastLessons = [
    {
        id: 3,
        image: '/images/tutors/tomek_k.jpg',
        fullName: 'Tomasz Kamiński',
        discordName: 'TomekDev#2025',
        mainSubject: 'Programowanie',
        subTopic: 'Podstawy JS i React',
        date: '2025-05-02 17:00',
    },
    {
        id: 4,
        image: '/images/tutors/marta_w.jpg',
        fullName: 'Marta Wiśniewska',
        discordName: 'MartaW#4567',
        mainSubject: 'Chemia',
        subTopic: 'Chemia organiczna - wstęp',
        date: '2025-05-05 12:00',
    },
];

const MockTutors = [
    {
        id: 101,
        image: '/images/tutors/tomek_k.jpg',
        name: 'Tomasz Kamiński',
        discordName: 'TomekDev#2025',
        rating: 5,
        reviewsCount: 19,
        subjects: ['Programowanie'],
    },
    {
        id: 102,
        image: '/images/tutors/marta_w.jpg',
        name: 'Marta Wiśniewska',
        discordName: 'MartaW#4567',
        rating: 4,
        reviewsCount: 12,
        subjects: ['Chemia'],
    },
    {
        id: 103,
        image: '/images/tutors/anna_k.jpg',
        name: 'Anna Kowalska',
        discordName: 'AnnaK#1234',
        rating: 5,
        reviewsCount: 30,
        subjects: ['Matematyka'],
    },
    {
        id: 104,
        image: '/images/tutors/piotr_n.jpg',
        name: 'Piotr Nowak',
        discordName: 'PiotrNowak#6789',
        rating: 4,
        reviewsCount: 8,
        subjects: ['Angielski'],
    },
];

const MockBadges = [
    { id: 1, label: 'First steps', iconSrc: '/path/to/shoes-icon.png' },
    { id: 2, label: 'Testing waters', iconSrc: '/path/to/beach-icon.png' },
    { id: 3, label: 'Rockstar', iconSrc: '/path/to/guitar-icon.png' },
    { id: 4, label: 'Polyglot', iconSrc: '/path/to/language-icon.png' },
    { id: 5, label: 'Committed', iconSrc: '/path/to/commitment-icon.png' },
    { id: 6, label: 'Star student', iconSrc: '/path/to/star-icon.png' },
];

const studentRating = 4.5;

const CockpitPage = () => {
    const [activeTab, setActiveTab] = useState('lessons');
    const [lessonTab, setLessonTab] = useState('upcoming');

    // Loading states
    const [loadingLessons, setLoadingLessons] = useState(true);
    const [loadingTutors, setLoadingTutors] = useState(true);

    const [upcoming, setUpcoming] = useState([]);
    const [past, setPast] = useState([]);
    const [tutors, setTutors] = useState([]);

    useEffect(() => {
        // Simulate lesson fetch
        const t1 = setTimeout(() => {
            setUpcoming(MockUpcomingLessons);
            setPast(MockPastLessons);
            setLoadingLessons(false);
        }, 1200);

        // Simulate tutor fetch
        const t2 = setTimeout(() => {
            setTutors(MockTutors);
            setLoadingTutors(false);
        }, 1500);

        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
        };
    }, []);

    const nextLesson = upcoming[0] || null;

    // Handlers
    const handleBookMore = () => alert('Zarezerwuj kolejną lekcję...');
    const handleSearchTutors = () => alert('Przekierowanie do wyszukiwania...');
    const handleLessonInfo = (lesson) =>
        alert(`Info about lesson:\n${lesson.fullName} - ${lesson.mainSubject}`);
    const handleTutorInfo = (tutor) =>
        alert(`Info about tutor:\n${tutor.name}, rating ${tutor.rating}`);

    return (
        <section className="pt-24 pb-12 bg-white min-h-screen">
            <div className="container-custom">
                {/* ---------- HERO-LIKE TOP SECTION ---------- */}
                <div className="flex flex-col lg:flex-row items-center">
                    {/* LEFT: Big Title + Subtext + 2 Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
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
                                className=" btn btn-outline py-3 px-8 text-lg"
                            >
                                <FaSearch className="mr-2" />
                                Szukaj korepetytorów
                            </motion.button>
                        </div>
                    </motion.div>

                    {/* RIGHT: BIGGER UpcomingLessonCard or skeleton */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="lg:w-1/2 flex justify-center w-full"
                    >
                        {loadingLessons ? (
                            // The bigger skeleton
                            <div className="w-full">
                                <UpcomingLessonSkeleton />
                            </div>
                        ) : nextLesson ? (
                            <div className="w-full">
                                <UpcomingLessonCard
                                    lesson={nextLesson}
                                    onInfoClick={handleLessonInfo}
                                />
                            </div>
                        ) : (
                            <div className="p-4 bg-gray-50 rounded-xl text-center text-gray-500 shadow w-full h-48 flex items-center justify-center">
                                Brak zaplanowanych lekcji
                            </div>
                        )}
                    </motion.div>
                </div>

                {/* ---------- TABS BELOW ---------- */}
                <div className="mt-12">
                    {/* Main Tabs */}
                    <div className="flex space-x-4 mb-8">
                        <button
                            className={`px-4 py-2 rounded-md font-semibold transition ${
                                activeTab === 'lessons'
                                    ? 'bg-purple-100 text-purple-600'
                                    : 'bg-gray-100 text-gray-700'
                            }`}
                            onClick={() => setActiveTab('lessons')}
                        >
                            Lekcje
                        </button>
                        <button
                            className={`px-4 py-2 rounded-md font-semibold transition ${
                                activeTab === 'calendar'
                                    ? 'bg-purple-100 text-purple-600'
                                    : 'bg-gray-100 text-gray-700'
                            }`}
                            onClick={() => setActiveTab('calendar')}
                        >
                            Kalendarz
                        </button>
                        <button
                            className={`px-4 py-2 rounded-md font-semibold transition ${
                                activeTab === 'progress'
                                    ? 'bg-purple-100 text-purple-600'
                                    : 'bg-gray-100 text-gray-700'
                            }`}
                            onClick={() => setActiveTab('progress')}
                        >
                            Postępy
                        </button>
                        <button
                            className={`px-4 py-2 rounded-md font-semibold transition ${
                                activeTab === 'tutors'
                                    ? 'bg-purple-100 text-purple-600'
                                    : 'bg-gray-100 text-gray-700'
                            }`}
                            onClick={() => setActiveTab('tutors')}
                        >
                            Korepetytorzy
                        </button>
                    </div>

                    {/* Tab content */}
                    <div className="min-h-[500px]">
                        {/* 1) LESSONS TAB */}
                        {activeTab === 'lessons' && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5 }}
                            >
                                {/* sub-tabs: upcoming / past */}
                                <div className="flex space-x-4 mb-8">
                                    <button
                                        className={`px-4 py-2 rounded-md font-medium ${
                                            lessonTab === 'upcoming'
                                                ? 'bg-purple-50 text-purple-600'
                                                : 'bg-gray-50 text-gray-600'
                                        }`}
                                        onClick={() => setLessonTab('upcoming')}
                                    >
                                        Nadchodzące lekcje
                                    </button>
                                    <button
                                        className={`px-4 py-2 rounded-md font-medium ${
                                            lessonTab === 'past'
                                                ? 'bg-purple-50 text-purple-600'
                                                : 'bg-gray-50 text-gray-600'
                                        }`}
                                        onClick={() => setLessonTab('past')}
                                    >
                                        Minione lekcje
                                    </button>
                                </div>

                                {lessonTab === 'upcoming' && (
                                    <>
                                        {loadingLessons ? (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                                {Array.from({ length: 4 }).map((_, i) => (
                                                    <LessonCardSkeleton key={i} />
                                                ))}
                                            </div>
                                        ) : upcoming.length > 0 ? (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                                {upcoming.map((les) => (
                                                    <LessonCard
                                                        key={les.id}
                                                        lesson={les}
                                                        onInfoClick={handleLessonInfo}
                                                    />
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
                                        {loadingLessons ? (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                                {Array.from({ length: 4 }).map((_, i) => (
                                                    <LessonCardSkeleton key={i} />
                                                ))}
                                            </div>
                                        ) : past.length > 0 ? (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                                {past.map((les) => (
                                                    <LessonCard
                                                        key={les.id}
                                                        lesson={les}
                                                        onInfoClick={handleLessonInfo}
                                                    />
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

                        {/* 2) CALENDAR TAB */}
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

                        {/* 3) PROGRESS TAB */}
                        {activeTab === 'progress' && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5 }}
                            >
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
                                                className={
                                                    i < Math.round(studentRating)
                                                        ? 'text-yellow-400'
                                                        : 'text-gray-300'
                                                }
                                            />
                                        ))}
                                        <span className="ml-2 text-gray-600">
                      ({studentRating.toFixed(1)}/5)
                    </span>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* 4) TUTORS TAB */}
                        {activeTab === 'tutors' && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5 }}
                            >
                                <h2 className="text-2xl font-bold mb-6 text-gray-800">
                                    Korepetytorzy
                                </h2>
                                {loadingTutors ? (
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
                </div>
            </div>

            {/* ------ BOTTOM: ODZNAKI ------ */}
            <div className="container-custom mt-12">
                <h3 className="text-xl font-medium text-gray-700 mb-4">Odznaki</h3>
                {MockBadges.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
                        {MockBadges.map((badge) => (
                            <div
                                key={badge.id}
                                className="flex flex-col items-center text-center p-3 bg-white rounded shadow-sm"
                            >
                                <img
                                    src={badge.iconSrc}
                                    alt={badge.label}
                                    className="w-12 h-12 mb-2"
                                />
                                <p className="text-sm font-medium text-gray-700">
                                    {badge.label}
                                </p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-gray-600">Brak odznak</div>
                )}
            </div>
        </section>
    );
};

export default CockpitPage;
