import React from 'react';
import { formatUtils } from '../utils';
import { Icon } from '../shared/Icon';
import { Card } from '../shared/Card';

export const TutorProfile = ({ tutor, onScheduleLesson, onViewLesson }) => {
    const subjectOptions = tutor?.subjects?.length ? tutor.subjects : ['Matematyka', 'Fizyka', 'Informatyka'];
    const levelOptions = tutor?.levels?.length ? tutor.levels : ['Podstawówka', 'Liceum', 'Studia'];
    const education = [{ school: 'Uniwersytet Warszawski', degree: 'Magister Informatyki', year: '2019' }];
    const experience = ['Korepetycje online z matematyki (2 lata)', 'Prowadzenie zajęć wyrównawczych (1 rok)'];

    return (
        <div className="flex flex-col h-full">
            {/* Scrollable content area */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                <div className="space-y-4 pb-20"> {/* Extra padding at bottom to account for sticky button */}
                    {/* Opis */}
                    <Card>
                        <p className="text-gray-700 text-sm leading-relaxed">
                            {tutor?.description || 'Doświadczony nauczyciel z pasją do przekazywania wiedzy, pomagający uczniom osiągać ich cele edukacyjne.'}
                        </p>
                    </Card>

                    {/* Edukacja */}
                    <Card title="Edukacja" icon="graduation">
                        {education.map((edu, idx) => (
                            <div key={idx} className="mb-3 last:mb-0">
                                <p className="text-sm font-medium text-gray-900">{edu.degree}</p>
                                <p className="text-xs text-gray-600">{edu.school} ({edu.year})</p>
                            </div>
                        ))}
                    </Card>

                    {/* Doświadczenie */}
                    <Card title="Doświadczenie" icon="briefcase">
                        <ul className="space-y-2 text-sm text-gray-700">
                            {experience.map((exp, idx) => <li key={idx} className="flex items-baseline gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-1.5 flex-shrink-0"></span>
                                <span>{exp}</span>
                            </li>)}
                        </ul>
                    </Card>

                    {/* Specjalizacje */}
                    <Card title="Specjalizacje" icon="tag">
                        <div className="flex flex-wrap gap-2">
                            {subjectOptions.map((sub) => (
                                <span key={sub} className="px-2.5 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">
                                    {sub}
                                </span>
                            ))}
                        </div>
                    </Card>

                    {/* Poziomy nauczania */}
                    <Card title="Poziomy nauczania" icon="chalkboard">
                        <div className="flex flex-wrap gap-2">
                            {levelOptions.map((lvl) => (
                                <span key={lvl} className="px-2.5 py-1 bg-amber-50 text-amber-600 rounded-full text-xs font-medium">
                                    {lvl}
                                </span>
                            ))}
                        </div>
                    </Card>

                    {/* Cennik */}
                    {tutor?.price && (
                        <Card title="Cennik" icon="money">
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Stawka godzinowa:</span>
                                    <span className="font-medium text-gray-900">{formatUtils.formatPrice(tutor.price)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Cena za 45 minut:</span>
                                    <span className="font-medium text-gray-900">{formatUtils.formatPrice(tutor.price * 0.75)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Cena za 90 minut:</span>
                                    <span className="font-medium text-gray-900">{formatUtils.formatPrice(tutor.price * 1.5)}</span>
                                </div>
                                <p className="text-xs text-gray-500 mt-2">Minimalna długość lekcji: 45 minut</p>
                            </div>
                        </Card>
                    )}

                    {/* Nadchodzące lekcje */}
                    {tutor?.upcoming_lessons && tutor.upcoming_lessons.length > 0 && (
                        <Card title="Nadchodzące lekcje" icon="calendar">
                            <div className="space-y-2">
                                {tutor.upcoming_lessons.map((lesson) => (
                                    <div
                                        key={lesson.id}
                                        className="p-3 border border-gray-100 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                                        onClick={() => onViewLesson(lesson)}
                                    >
                                        <h4 className="text-sm font-medium text-gray-900">{lesson.title}</h4>
                                        <p className="text-xs text-gray-600 mt-1">{formatUtils.formatDateTime(lesson.start_time)}</p>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    )}
                </div>
            </div>

            {/* Fixed footer with button */}
            <div className="border-t border-gray-200 p-4 bg-white">
                <button
                    onClick={onScheduleLesson}
                    className="w-full flex justify-center items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors"
                >
                    <Icon name="calendar" className="h-4 w-4" />
                    Zaplanuj lekcję
                </button>
            </div>
        </div>
    );
};

export default TutorProfile;