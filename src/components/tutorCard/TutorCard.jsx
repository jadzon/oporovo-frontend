import React from 'react';
import { FaStar } from 'react-icons/fa';

const TutorCard = ({ tutor, onInfoClick }) => {
    // Dane tutora
    const tutorAvatar = tutor?.avatar || '/images/default-avatar.png';
    const tutorUsername = tutor?.username || 'Nieznany';
    const tutorFullName =
        tutor?.first_name && tutor?.last_name
            ? `${tutor.first_name} ${tutor.last_name}`
            : tutorUsername;

    // Ocena tutora
    const fullStars = Math.floor(tutor.rating || 4.8);
    const halfStar = (tutor.rating || 4.8) - fullStars >= 0.5;
    const totalStars = 5;

    // Liczba dodatkowych przedmiotów i poziomów
    const subjects = tutor?.subjects || [];
    const levels = tutor?.levels || [];
    const displayedSubjects = subjects.slice(0, 2);
    const extraSubjects = subjects.length > 2 ? subjects.length - 2 : 0;
    const displayedLevels = levels.slice(0, 2);
    const extraLevels = levels.length > 2 ? levels.length - 2 : 0;

    return (
        <div className="bg-gray-50 shadow-sm border border-gray-200 rounded-lg overflow-hidden hover:bg-gray-100 transition-colors duration-200">
            {/* Górna sekcja - Avatar i ocena */}
            <div className="px-6 pt-4 pb-2 flex justify-between items-center">
                <div className="flex items-center">
                    <div className="w-16 h-16 mr-3 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200 shadow-sm">
                        <img
                            src={tutorAvatar}
                            alt={tutorUsername}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.target.src = '/images/default-avatar.png';
                            }}
                        />
                    </div>
                    <div className="flex items-center space-x-1.5">
                        {Array.from({ length: fullStars }).map((_, i) => (
                            <FaStar key={`full-${i}`} className="w-4 h-4 text-blue-900" />
                        ))}
                        {halfStar && <FaStar key="half" className="w-4 h-4 text-blue-900 opacity-75" />}
                        {Array.from({ length: totalStars - fullStars - (halfStar ? 1 : 0) }).map((_, i) => (
                            <FaStar key={`empty-${i}`} className="w-4 h-4 text-gray-200" />
                        ))}
                        <span className="ml-1 text-sm font-medium text-gray-600">({(tutor.rating || 4.8).toFixed(1)})</span>
                    </div>
                </div>
                <span className="text-sm text-gray-600 font-medium">{tutor.available ? 'Dostępny' : 'Niedostępny'}</span>
            </div>

            {/* Główna sekcja - Imię, username, specjalizacje i poziomy */}
            <div className="px-6 pb-4">
                <h2 className="text-xl font-medium text-gray-900 mb-1">{tutorFullName}</h2>
                <p className="text-sm text-gray-600 mb-3">@{tutorUsername}</p>

                {/* Specjalizacje i poziomy */}
                <div className="flex flex-wrap items-center gap-3 mb-4">
                    {displayedSubjects.map((subject, idx) => (
                        <span key={idx} className="text-sm px-3 py-1 bg-blue-50 text-blue-700 rounded-full">
                            {subject}
                        </span>
                    ))}
                    {extraSubjects > 0 && (
                        <span className="text-sm px-3 py-1 bg-blue-50 text-blue-700 rounded-full">
                            +{extraSubjects}
                        </span>
                    )}
                    {displayedLevels.map((level, idx) => (
                        <span key={idx} className="text-sm px-3 py-1 bg-amber-50 text-amber-700 rounded-full">
                            {level}
                        </span>
                    ))}
                    {extraLevels > 0 && (
                        <span className="text-sm px-3 py-1 bg-amber-50 text-amber-700 rounded-full">
                            +{extraLevels}
                        </span>
                    )}
                </div>

                {/* Dodatkowe informacje - cena i liczba lekcji */}
                <div className="flex items-center gap-3 text-sm text-gray-600 mb-1">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-gray-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    <span>{tutor.price ? `${tutor.price} zł/h` : 'Brak ceny'}</span>
                    {tutor.lessonsCount > 0 && (
                        <>
                            <span className="text-gray-500">·</span>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 text-gray-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                />
                            </svg>
                            <span>{tutor.lessonsCount} lekcji</span>
                        </>
                    )}
                </div>
            </div>

            {/* Stopka - Przycisk */}
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end">
                <button
                    className="btn text-sm font-medium text-blue-900 hover:text-blue-700 hover:underline transition-colors"
                    onClick={() => onInfoClick?.(tutor)}
                >
                    Szczegóły
                </button>
            </div>
        </div>
    );
};

export default TutorCard;