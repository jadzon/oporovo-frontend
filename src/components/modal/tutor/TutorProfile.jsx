import React from 'react';
import { formatUtils } from '../utils';
import { FaGraduationCap, FaBriefcase, FaTags, FaChalkboardTeacher, FaMoneyBillWave } from 'react-icons/fa';

const TutorProfile = ({ tutor, onScheduleLesson, onViewLesson }) => {
    const subjectOptions = tutor?.subjects?.length ? tutor.subjects : ['Matematyka', 'Fizyka', 'Informatyka'];
    const levelOptions = tutor?.levels?.length ? tutor.levels : ['Podstawówka', 'Liceum', 'Studia'];
    const education = [{ school: 'Uniwersytet Warszawski', degree: 'Magister Informatyki', year: '2019' }];
    const experience = ['Korepetycje online z matematyki (2 lata)', 'Prowadzenie zajęć wyrównawczych (1 rok)'];

    return (
        <div className="relative bg-gray-50 min-h-screen">
            <div className="max-w-4xl mx-auto space-y-10 py-12 px-4 sm:px-6 lg:px-8 pb-24">
                {/* Opis */}
                <section>
                    <p className="text-gray-800 text-lg leading-relaxed whitespace-pre-line">
                        {tutor?.description || 'Doświadczony nauczyciel z pasją do przekazywania wiedzy, pomagający uczniom osiągać ich cele edukacyjne.'}
                    </p>
                </section>

                {/* Edukacja */}
                <section className="border border-gray-300 rounded-lg p-6 shadow-sm bg-white">
                    <div className="flex items-center gap-3 mb-4">
                        <FaGraduationCap className="text-blue-900 text-xl" />
                        <h3 className="text-xl font-medium text-gray-900">Edukacja</h3>
                    </div>
                    {education.map((edu, idx) => (
                        <div key={idx} className="mb-4 last:mb-0">
                            <p className="font-medium text-gray-900">{edu.degree}</p>
                            <p className="text-sm text-gray-700">{edu.school} ({edu.year})</p>
                        </div>
                    ))}
                </section>

                {/* Doświadczenie */}
                <section className="border border-gray-300 rounded-lg p-6 shadow-sm bg-white">
                    <div className="flex items-center gap-3 mb-4">
                        <FaBriefcase className="text-blue-900 text-xl" />
                        <h3 className="text-xl font-medium text-gray-900">Doświadczenie</h3>
                    </div>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                        {experience.map((exp, idx) => <li key={idx}>{exp}</li>)}
                    </ul>
                </section>

                {/* Specjalizacje */}
                <section className="border border-gray-300 rounded-lg p-6 shadow-sm bg-white">
                    <div className="flex items-center gap-3 mb-4">
                        <FaTags className="text-blue-900 text-xl" />
                        <h3 className="text-xl font-medium text-gray-900">Specjalizacje</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {subjectOptions.map((sub) => (
                            <span key={sub} className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                                {sub}
                            </span>
                        ))}
                    </div>
                </section>

                {/* Poziomy nauczania */}
                <section className="border border-gray-300 rounded-lg p-6 shadow-sm bg-white">
                    <div className="flex items-center gap-3 mb-4">
                        <FaChalkboardTeacher className="text-blue-900 text-xl" />
                        <h3 className="text-xl font-medium text-gray-900">Poziomy nauczania</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {levelOptions.map((lvl) => (
                            <span key={lvl} className="px-2 py-1 bg-amber-50 text-amber-700 rounded-full text-sm font-medium">
                                {lvl}
                            </span>
                        ))}
                    </div>
                </section>

                {/* Cennik */}
                {tutor?.price && (
                    <section className="border border-gray-300 rounded-lg p-6 shadow-sm bg-white">
                        <div className="flex items-center gap-3 mb-4">
                            <FaMoneyBillWave className="text-blue-900 text-xl" />
                            <h3 className="text-xl font-medium text-gray-900">Cennik</h3>
                        </div>
                        <div className="space-y-2">
                            <p className="text-gray-700">
                                Stawka godzinowa: <span className="font-medium text-gray-900">{formatUtils.formatPrice(tutor.price)}</span>
                            </p>
                            <p className="text-sm text-gray-600">Minimalna długość lekcji: 45 minut</p>
                            <p className="text-sm text-gray-600">Cena za 45 minut: {formatUtils.formatPrice(tutor.price * 0.75)}</p>
                            <p className="text-sm text-gray-600">Cena za 90 minut: {formatUtils.formatPrice(tutor.price * 1.5)}</p>
                        </div>
                    </section>
                )}

                {/* Nadchodzące lekcje */}
                {tutor?.upcoming_lessons && tutor.upcoming_lessons.length > 0 && (
                    <section className="border border-gray-300 rounded-lg p-6 shadow-sm bg-white">
                        <h3 className="text-xl font-medium text-gray-900 mb-4">Nadchodzące lekcje</h3>
                        <div className="space-y-4">
                            {tutor.upcoming_lessons.map((lesson) => (
                                <div
                                    key={lesson.id}
                                    className="p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                                    onClick={() => onViewLesson(lesson)}
                                >
                                    <h4 className="font-medium text-gray-900">{lesson.title}</h4>
                                    <p className="text-sm text-gray-600">{formatUtils.formatDateTime(lesson.start_time)}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>

            {/* Przycisk fixed */}
            <div className="sticky bottom-0 left-0 right-0 py-4 flex justify-center">
                <button
                    onClick={onScheduleLesson}
                    className="btn inline-flex items-center gap-2 px-6 py-3 bg-blue-900 hover:bg-blue-800 text-white text-base font-medium rounded-md shadow-md transition-all duration-300 transform"
                >
                    Zaplanuj lekcję
                </button>
            </div>
        </div>
    );
};

export default TutorProfile;