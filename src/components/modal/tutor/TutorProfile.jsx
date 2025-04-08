// components/modal/tutor/TutorProfile.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { FaGraduationCap, FaBookOpen, FaMoneyBillWave } from 'react-icons/fa';
import { formatUtils } from '../utils';

/**
 * Component for displaying tutor profile details
 */
const TutorProfile = ({ tutor, onScheduleLesson, onViewLesson }) => {
    // Subject options based on tutor's specializations
    const subjectOptions = tutor?.subjects?.length
        ? tutor.subjects
        : ['Matematyka', 'Fizyka', 'Informatyka'];

    // Level options based on tutor's teaching levels
    const levelOptions = tutor?.levels?.length
        ? tutor.levels
        : ['Podstawówka', 'Liceum', 'Studia'];

    // Education data (would come from API in real implementation)
    const education = [
        { school: 'Uniwersytet Warszawski', degree: 'Magister Informatyki', year: '2019' },
    ];

    // Experience data (would come from API in real implementation)
    const experience = [
        'Korepetycje online z matematyki (2 lata)',
        'Prowadzenie zajęć wyrównawczych (1 rok)',
    ];

    return (
        <div className="space-y-8">
            <div className="prose prose-sm max-w-none">
                <p className="text-gray-600 leading-relaxed">
                    {tutor?.description || 'Doświadczony nauczyciel z pasją do przekazywania wiedzy. Specjalizuję się w przedmiotach ścisłych, szczególnie matematyce i fizyce. Pomagam uczniom rozwiązywać problemy i rozwijać umiejętności analitycznego myślenia.'}
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-3">
                            <FaGraduationCap className="text-purple-600" />
                            Edukacja
                        </h3>
                        {education.map((edu, idx) => (
                            <div key={idx} className="mb-4 last:mb-0">
                                <p className="font-medium text-gray-900">
                                    {edu.degree}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {edu.school} ({edu.year})
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-3">
                            <FaBookOpen className="text-purple-600" />
                            Specjalizacje
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {subjectOptions.map((sub) => (
                                <span
                                    key={sub}
                                    className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm font-medium"
                                >
                                    {sub}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Price card */}
                    {tutor?.price && (
                        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                            <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-3">
                                <FaMoneyBillWave className="text-green-600" />
                                Cennik
                            </h3>
                            <div className="space-y-2">
                                <p className="text-gray-700">
                                    Stawka godzinowa: <span className="font-bold text-green-600">{formatUtils.formatPrice(tutor.price)}</span>
                                </p>
                                <p className="text-sm text-gray-500">Minimalna długość lekcji: 45 minut</p>
                                <p className="text-sm text-gray-500">
                                    Cena za 45 minut: {formatUtils.formatPrice(tutor.price * 0.75)}
                                </p>
                                <p className="text-sm text-gray-500">
                                    Cena za 90 minut: {formatUtils.formatPrice(tutor.price * 1.5)}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="space-y-4">
                    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                            Doświadczenie
                        </h3>
                        <ul className="space-y-3">
                            {experience.map((exp, idx) => (
                                <li
                                    key={idx}
                                    className="flex items-start before:content-['•'] before:mr-2 before:text-purple-600 before:font-bold"
                                >
                                    <span className="text-gray-600">
                                        {exp}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                            Poziomy nauczania
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {levelOptions.map((lvl) => (
                                <span
                                    key={lvl}
                                    className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium"
                                >
                                    {lvl}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Upcoming lessons with this tutor */}
            {tutor?.upcoming_lessons && tutor.upcoming_lessons.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Nadchodzące lekcje</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {tutor.upcoming_lessons.map(lesson => (
                            <div
                                key={lesson.id}
                                className="p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-purple-50 transition-colors"
                                onClick={() => onViewLesson(lesson)}
                            >
                                <h4 className="font-medium">{lesson.title}</h4>
                                <p className="text-sm text-gray-600">
                                    {formatUtils.formatDateTime(lesson.start_time)}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="text-center border-t pt-6">
                <button
                    onClick={onScheduleLesson}
                    className="btn px-8 py-3 rounded-md bg-purple-600 text-white font-semibold hover:shadow-lg transition-all hover:bg-purple-700"
                >
                    Zaplanuj lekcję
                </button>
            </div>
        </div>
    );
};

export default TutorProfile;