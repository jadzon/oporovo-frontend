// components/modal/lesson/LessonModalContent.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaGraduationCap, FaInfoCircle, FaClock, FaUsers, FaTimes, FaDiscord } from 'react-icons/fa';
import { useModal } from '../../../hooks/useModal';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { StatusBadge, TimeDisplay } from '../shared';
import { formatUtils } from '../utils';

/**
 * Lesson details modal component
 */
const LessonModalContent = ({ lesson, onClose, hasHistory, goBack }) => {
    const { openTutorModal } = useModal();
    const tutor = lesson?.tutor || {};

    // Redirect to tutor profile
    const handleTutorClick = () => {
        if (tutor && Object.keys(tutor).length > 0) {
            openTutorModal(tutor);
        }
    };

    return (
        <>
            {/* Header */}
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

            {/* Content */}
            <div className="flex-1 overflow-auto p-6 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Left column - Lesson details */}
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

                    {/* Right column */}
                    <div className="space-y-6">
                        {/* Tutor card */}
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
                                </div>
                            </div>
                        </div>

                        {/* Lesson status */}
                        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex items-center gap-3 text-purple-600 mb-4">
                                <FaInfoCircle className="text-xl" />
                                <h3 className="text-lg font-semibold">Status lekcji</h3>
                            </div>
                            <StatusBadge status={lesson?.status} />
                        </div>

                        {/* Lesson time */}
                        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 space-y-4">
                            <div className="flex items-center gap-3 text-purple-600">
                                <FaClock className="text-xl" />
                                <h3 className="text-lg font-semibold">Termin lekcji</h3>
                            </div>
                            <div className="space-y-2">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div className="text-gray-600">
                                        <span className="block text-xs text-gray-500 mb-1">Rozpoczęcie:</span>
                                        {formatUtils.formatDateTime(lesson?.start_time)}
                                    </div>
                                    <div className="text-gray-600">
                                        <span className="block text-xs text-gray-500 mb-1">Zakończenie:</span>
                                        {formatUtils.formatDateTime(lesson?.end_time)}
                                    </div>
                                </div>

                                {/* Time progress bar */}
                                <TimeDisplay
                                    startTime={lesson?.start_time}
                                    endTime={lesson?.end_time}
                                />
                            </div>
                        </div>

                        {/* Students section */}
                        {lesson?.students && lesson.students.length > 0 && (
                            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                                <div className="flex items-center gap-3 text-purple-600 mb-4">
                                    <FaUsers className="text-xl" />
                                    <h3 className="text-lg font-semibold">Uczestnicy ({lesson.students.length})</h3>
                                </div>
                                <div className="space-y-3">
                                    {lesson.students.map((student) => (
                                        <div key={student.id} className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-lg">
                                                {student.avatar ? (
                                                    <LazyLoadImage
                                                        src={student.avatar}
                                                        alt={`${student.first_name} ${student.last_name}`}
                                                        effect="blur"
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex items-center justify-center w-full h-full bg-gray-100 text-gray-400">
                                                        {student.first_name?.[0]}{student.last_name?.[0]}
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-gray-900 font-medium">
                                                    {student.first_name} {student.last_name}
                                                </p>
                                                {student.username && (
                                                    <p className="text-sm text-gray-500">@{student.username}</p>
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