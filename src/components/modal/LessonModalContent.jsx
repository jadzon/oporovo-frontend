// components/modal/LessonModalContent.jsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaGraduationCap, FaStar, FaDiscord, FaClock, FaUsers, FaTimes } from 'react-icons/fa';
import { useModal } from '../../hooks/useModal';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

const LessonModalContent = ({ lesson, onClose, hasHistory, goBack }) => {
    const { openTutorModal } = useModal();
    const [timeText, setTimeText] = useState('');
    const [timePercentage, setTimePercentage] = useState(0);

    const tutor = lesson?.tutor || {};
    const ratingValue = tutor.rating ?? 4.8;
    const fullStars = Math.floor(ratingValue);
    const halfStar = ratingValue - fullStars >= 0.5;

    // Calculate lesson time status (not started, in progress, completed)
    useEffect(() => {
        if (!lesson) return;
        const lessonStart = new Date(lesson.start_time);
        const lessonEnd = new Date(lesson.end_time);
        const totalDuration = lessonEnd - lessonStart;

        const updateTimer = () => {
            const now = new Date();
            let diff, prefix, percentage = 0;

            if (now < lessonStart) {
                diff = lessonStart - now;
                prefix = 'Rozpocznie się za: ';
            } else if (now > lessonEnd) {
                diff = now - lessonEnd;
                prefix = 'Lekcja zakończona: ';
                percentage = 100;
            } else {
                diff = now - lessonStart;
                prefix = 'Lekcja trwa: ';
                percentage = (diff / totalDuration) * 100;
            }

            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            setTimeText(`${prefix}${hours}h ${minutes}m ${seconds}s`);
            setTimePercentage(Math.min(100, percentage));
        };

        updateTimer();
        const timerId = setInterval(updateTimer, 1000);
        return () => clearInterval(timerId);
    }, [lesson?.start_time, lesson?.end_time]);

    // Get appropriate status color
    const getStatusColor = () => {
        switch(lesson?.status) {
            case 'confirmed': return 'bg-green-500';
            case 'cancelled': return 'bg-red-500';
            case 'in_progress': return 'bg-purple-500';
            case 'scheduled': return 'bg-blue-500';
            default: return 'bg-gray-500';
        }
    };

    // Handle navigation to tutor profile
    const handleTutorClick = () => {
        if (tutor && Object.keys(tutor).length > 0) {
            openTutorModal(tutor);
        }
    };

    // Format status text
    const getStatusText = (status) => {
        switch(status) {
            case 'confirmed': return 'Potwierdzona';
            case 'cancelled': return 'Anulowana';
            case 'in_progress': return 'W trakcie';
            case 'scheduled': return 'Zaplanowana';
            default: return status || 'Nieznany';
        }
    };

    return (
        <>
            {/* HEADER */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                {hasHistory ? (
                    <button
                        onClick={goBack}
                        className="p-2 hover:bg-gray-50 rounded-lg text-gray-600 hover:text-purple-600 transition-colors"
                    >
                        <FaArrowLeft className="text-lg" />
                    </button>
                ) : (
                    <div></div>
                )}
                <div className="flex items-center gap-2">
                    <span className={`${getStatusColor()} w-3 h-3 rounded-full`} />
                    <span className="text-sm font-medium text-gray-700">
            {getStatusText(lesson?.status)}
          </span>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <FaTimes className="text-xl" />
                </button>
            </div>

            {/* TUTOR PROFILE SECTION */}
            <div
                className="px-6 py-5 flex items-center gap-5 bg-gradient-to-r from-purple-50 to-indigo-50 cursor-pointer hover:bg-gradient-to-r hover:from-purple-100 hover:to-indigo-100 transition-colors"
                onClick={handleTutorClick}
            >
                <div className="w-20 h-20 rounded-full border-4 border-white shadow-lg overflow-hidden">
                    {tutor.avatar ? (
                        <LazyLoadImage
                            src={tutor.avatar}
                            alt={`${tutor.first_name} ${tutor.last_name}`}
                            effect="blur"
                            className="object-cover w-full h-full"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full bg-gray-100 text-gray-400">
                            <FaGraduationCap className="text-3xl" />
                        </div>
                    )}
                </div>
                <div className="space-y-1.5">
                    <h2 className="text-2xl font-bold text-gray-900">
                        {tutor.first_name} {tutor.last_name}
                    </h2>
                    <div className="flex items-center gap-2">
                        {[...Array(5)].map((_, i) => (
                            <FaStar
                                key={i}
                                className={`w-4 h-4 ${
                                    i < fullStars ? 'text-amber-400' :
                                        (i === fullStars && halfStar ? 'text-amber-400/50' : 'text-gray-300')
                                }`}
                            />
                        ))}
                        <span className="text-sm font-medium text-gray-600">
              ({ratingValue.toFixed(1)})
            </span>
                    </div>
                </div>
            </div>

            {/* CONTENT */}
            <div className="flex-1 overflow-auto p-6 space-y-6">
                {/* Lesson Details */}
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900">Szczegóły lekcji</h3>
                        <div className="space-y-3">
                            <div>
                                <label className="text-sm text-gray-500">Przedmiot</label>
                                <p className="font-medium text-gray-900">
                                    {lesson?.subject || 'Brak informacji'}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm text-gray-500">Poziom</label>
                                <p className="font-medium text-gray-900">
                                    {lesson?.level || 'Brak informacji'}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm text-gray-500">Tytuł</label>
                                <p className="font-medium text-gray-900">{lesson?.title || 'Brak tytułu'}</p>
                            </div>
                            <div>
                                <label className="text-sm text-gray-500">Opis</label>
                                <p className="text-gray-700 whitespace-pre-line">
                                    {lesson?.description || 'Brak opisu'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        {/* Time Progress */}
                        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 space-y-4">
                            <div className="flex items-center gap-3 text-purple-600">
                                <FaClock className="text-xl" />
                                <h3 className="text-lg font-semibold">Termin lekcji</h3>
                            </div>
                            <div className="space-y-2">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div className="text-gray-600">
                                        <span className="block text-xs text-gray-500 mb-1">Rozpoczęcie:</span>
                                        {lesson?.start_time ? new Date(lesson.start_time).toLocaleString('pl-PL') : 'Nie określono'}
                                    </div>
                                    <div className="text-gray-600">
                                        <span className="block text-xs text-gray-500 mb-1">Zakończenie:</span>
                                        {lesson?.end_time ? new Date(lesson.end_time).toLocaleString('pl-PL') : 'Nie określono'}
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <motion.div
                                            className="h-full bg-purple-600"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${timePercentage}%` }}
                                            transition={{ duration: 0.5 }}
                                        />
                                    </div>
                                    <p className="mt-2 text-lg font-medium text-gray-900">{timeText}</p>
                                </div>
                            </div>
                        </div>

                        {/* Participants */}
                        {lesson?.students?.length > 0 && (
                            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 space-y-4">
                                <div className="flex items-center gap-3 text-purple-600">
                                    <FaUsers className="text-xl" />
                                    <h3 className="text-lg font-semibold">Uczestnicy ({lesson.students.length})</h3>
                                </div>
                                <div className="grid grid-cols-1 gap-3">
                                    {lesson.students.map((stud) => (
                                        <div key={stud.id} className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center overflow-hidden">
                                                {stud.avatar ? (
                                                    <img
                                                        src={stud.avatar}
                                                        alt={`${stud.first_name} ${stud.last_name}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <span className="text-sm font-medium text-purple-600">
                            {stud.first_name?.[0]}{stud.last_name?.[0]}
                          </span>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-gray-900 font-medium">
                                                    {stud.first_name} {stud.last_name}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    @{stud.username}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Discord CTA */}
                <motion.div
                    className="text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <a
                        href={lesson?.discord_link || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-md shadow-lg transition-all hover:shadow-xl"
                    >
                        <FaDiscord className="text-xl" />
                        <span>Dołącz do rozmowy na Discord</span>
                    </a>
                    {!lesson?.discord_link && (
                        <p className="mt-2 text-sm text-red-500">
                            Link do Discorda będzie dostępny 15 minut przed rozpoczęciem lekcji
                        </p>
                    )}
                </motion.div>
            </div>
        </>
    );
};

export default LessonModalContent;