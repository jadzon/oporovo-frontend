import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaGraduationCap, FaStar, FaDiscord, FaClock, FaUsers, FaTimes, FaInfoCircle } from 'react-icons/fa';
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

    // Aktualizacja timera – obliczenie czasu do rozpoczęcia, zakończenia lub przebiegu lekcji
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

    // Funkcja zwracająca kolor dla statusu lekcji
    const getStatusColor = () => {
        switch (lesson?.status) {
            case 'confirmed': return 'bg-green-500';
            case 'cancelled': return 'bg-red-500';
            case 'in_progress': return 'bg-purple-500';
            case 'scheduled': return 'bg-blue-500';
            default: return 'bg-gray-500';
        }
    };

    // Funkcja zwracająca czytelny tekst statusu lekcji
    const getStatusText = (status) => {
        switch (status) {
            case 'confirmed': return 'Potwierdzona';
            case 'cancelled': return 'Anulowana';
            case 'in_progress': return 'W trakcie';
            case 'scheduled': return 'Zaplanowana';
            default: return status || 'Nieznany';
        }
    };

    // Przekierowanie do profilu korepetytora
    const handleTutorClick = () => {
        if (tutor && Object.keys(tutor).length > 0) {
            openTutorModal(tutor);
        }
    };

    return (
        <>
            {/* HEADER */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                {hasHistory ? (
                    <button
                        onClick={goBack}
                        className="flex items-center text-purple-600 hover:text-purple-700"
                    >
                        <FaArrowLeft className="mr-2" />
                        Powrót
                    </button>
                ) : (
                    <div></div>
                )}
                {/* W nagłówku wyświetlany jest tylko tytuł lekcji */}
                <h2 className="text-lg font-semibold text-gray-700">
                    {lesson?.title || 'Lekcja'}
                </h2>
                <button
                    onClick={onClose}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
                >
                    <FaTimes className="text-xl" />
                </button>
            </div>

            {/* CONTENT */}
            <div className="flex-1 overflow-auto p-6 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Lewa kolumna – Szczegóły lekcji */}
                    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 space-y-4">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Szczegóły lekcji</h3>
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
                                <label className="text-sm text-gray-500">Opis</label>
                                <p className="text-gray-700 whitespace-pre-line">
                                    {lesson?.description || 'Brak opisu'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Prawa kolumna */}
                    <div className="space-y-6">
                        {/* Karta prowadzącego lekcji */}
                        <div
                            className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
                            onClick={handleTutorClick}
                        >
                            <div className="flex items-center gap-3 text-purple-600 mb-4">
                                <FaGraduationCap className="text-xl" />
                                <h3 className="text-lg font-semibold">Prowadzący lekcji</h3>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-lg">
                                    {tutor.avatar ? (
                                        <LazyLoadImage
                                            src={tutor.avatar}
                                            alt={`${tutor.first_name} ${tutor.last_name}`}
                                            effect="blur"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center w-full h-full bg-gray-100 text-gray-400">
                                            <FaGraduationCap className="text-3xl" />
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-900">
                                        {tutor.first_name} {tutor.last_name}
                                    </h4>
                                    {tutor.username && (
                                        <p className="text-sm text-gray-500">
                                            @{tutor.username}
                                        </p>
                                    )}
                                    <div className="flex items-center gap-2 mt-1">
                                        {[...Array(5)].map((_, i) => (
                                            <FaStar
                                                key={i}
                                                className={`w-5 h-5 ${
                                                    i < fullStars
                                                        ? 'text-amber-400'
                                                        : i === fullStars && halfStar
                                                            ? 'text-amber-400/50'
                                                            : 'text-gray-300'
                                                }`}
                                            />
                                        ))}
                                        <span className="ml-2 text-sm font-medium text-gray-600">
                      ({ratingValue.toFixed(1)})
                    </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Karta statusu lekcji */}
                        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex items-center gap-3 text-purple-600 mb-4">
                                <FaInfoCircle className="text-xl" />
                                <h3 className="text-lg font-semibold">Status lekcji</h3>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={`${getStatusColor()} w-3 h-3 rounded-full`} />
                                <p className="text-gray-900 font-medium">{getStatusText(lesson?.status)}</p>
                            </div>
                        </div>

                        {/* Karta terminu lekcji */}
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

                        {/* Karta uczestników – wyświetlana tylko, gdy są zapisani uczestnicy */}
                        {lesson?.students && lesson.students.length > 0 && (
                            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                                <div className="flex items-center gap-3 text-purple-600 mb-4">
                                    <FaUsers className="text-xl" />
                                    <h3 className="text-lg font-semibold">Uczestnicy ({lesson.students.length})</h3>
                                </div>
                                <div className="space-y-3">
                                    {lesson.students.map((stud) => (
                                        <div key={stud.id} className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-lg">
                                                {stud.avatar ? (
                                                    <LazyLoadImage
                                                        src={stud.avatar}
                                                        alt={`${stud.first_name} ${stud.last_name}`}
                                                        effect="blur"
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex items-center justify-center w-full h-full bg-gray-100 text-gray-400">
                                                        {stud.first_name?.[0]}{stud.last_name?.[0]}
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-gray-900 font-medium">
                                                    {stud.first_name} {stud.last_name}
                                                </p>
                                                {stud.username && (
                                                    <p className="text-sm text-gray-500">@{stud.username}</p>
                                                )}
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
