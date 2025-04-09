import React from 'react';
import { useModal } from '../../../hooks/useModal';

// Status mapping with original colors
const statusMapping = {
    scheduled: { text: 'Zaplanowana', color: 'bg-indigo-100 text-indigo-800' },
    confirmed: { text: 'Potwierdzona', color: 'bg-emerald-100 text-emerald-800' },
    in_progress: { text: 'W trakcie', color: 'bg-violet-100 text-violet-800' },
    done: { text: 'Zakończona', color: 'bg-slate-100 text-slate-700' },
    failed: { text: 'Nieudana', color: 'bg-rose-100 text-rose-800' },
    cancelled: { text: 'Anulowana', color: 'bg-slate-200 text-slate-800' },
};

const LessonModalContent = ({ lesson, onClose, hasHistory, goBack }) => {
    const { openTutorModal } = useModal();
    const tutor = lesson?.tutor || {};

    // Format date and time
    const formatDateTime = (dateString) => {
        if (!dateString) return 'Brak danych';
        const date = new Date(dateString);
        return date.toLocaleString('pl-PL', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const calculateDuration = () => {
        if (!lesson?.start_time || !lesson?.end_time) return null;
        const start = new Date(lesson.start_time);
        const end = new Date(lesson.end_time);
        const durationMs = end - start;
        return Math.floor(durationMs / 60000);
    };

    const duration = calculateDuration();

    const handleTutorClick = () => {
        if (tutor && Object.keys(tutor).length > 0) {
            openTutorModal(tutor);
        }
    };

    return (
        <div className="flex flex-col h-full max-h-screen bg-gray-50">
            {/* Header - fixed */}
            <div className="px-8 py-6 border-b border-gray-300 flex items-center justify-between bg-gray-50 sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    {hasHistory && (
                        <button
                            onClick={goBack}
                            className="text-sm text-blue-900 font-medium flex items-center gap-1 mr-2"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 19l-7-7 7-7"
                                />
                            </svg>
                            Powrót
                        </button>
                    )}
                    <span
                        className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                            statusMapping[lesson?.status]?.color || 'bg-gray-100 text-gray-700'
                        }`}
                    >
                        {statusMapping[lesson?.status]?.text || 'Nieznany status'}
                    </span>
                </div>

                <h2 className="text-2xl font-medium text-gray-900">{lesson?.title || 'Lekcja'}</h2>

                <button
                    onClick={onClose}
                    className="btn p-1 text-gray-500 hover:text-gray-700 rounded-full transition-colors"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto">
                <div className="p-8">
                    {/* Top section with key information */}
                    <div className="mb-8 flex flex-wrap items-start justify-between">
                        <div className="mb-4 md:mb-0">
                            <div className="flex flex-wrap gap-3 mb-4">
                                {lesson?.subject && (
                                    <span className="text-sm px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full">
                                        {lesson.subject}
                                    </span>
                                )}
                                {lesson?.level && (
                                    <span className="text-sm px-3 py-1.5 bg-amber-50 text-amber-700 rounded-full">
                                        {lesson.level}
                                    </span>
                                )}
                            </div>

                            <div className="flex flex-wrap gap-4 text-sm text-gray-700">
                                <div className="flex items-center gap-2">
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
                                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                        />
                                    </svg>
                                    <span>{formatDateTime(lesson?.start_time)}</span>
                                </div>

                                {duration && (
                                    <div className="flex items-center gap-2">
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
                                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                        <span>{duration} min</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <a
                            href={lesson?.discord_link || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white text-sm font-medium rounded-md shadow-sm transition-colors"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                viewBox="0 0 640 512"
                            >
                                <path
                                    fill="currentColor"
                                    d="M524.531,69.836a1.5,1.5,0,0,0-.764-.7A485.065,485.065,0,0,0,404.081,32.03a1.816,1.816,0,0,0-1.923.91,337.461,337.461,0,0,0-14.9,30.6,447.848,447.848,0,0,0-134.426,0,309.541,309.541,0,0,0-15.135-30.6,1.89,1.89,0,0,0-1.924-.91A483.689,483.689,0,0,0,116.085,69.137a1.712,1.712,0,0,0-.788.676C39.068,183.651,18.186,294.69,28.43,404.354a2.016,2.016,0,0,0,.765,1.375A487.666,487.666,0,0,0,176.02,479.918a1.9,1.9,0,0,0,2.063-.676A348.2,348.2,0,0,0,208.12,430.4a1.86,1.86,0,0,0-1.019-2.588,321.173,321.173,0,0,1-45.868-21.853,1.885,1.885,0,0,1-.185-3.126c3.082-2.309,6.166-4.711,9.109-7.137a1.819,1.819,0,0,1,1.9-.256c96.229,43.917,200.41,43.917,295.5,0a1.812,1.812,0,0,1,1.924.233c2.944,2.426,6.027,4.851,9.132,7.16a1.884,1.884,0,0,1-.162,3.126,301.407,301.407,0,0,1-45.89,21.83,1.875,1.875,0,0,0-1,2.611,391.055,391.055,0,0,0,30.014,48.815,1.864,1.864,0,0,0,2.063.7A486.048,486.048,0,0,0,610.7,405.729a1.882,1.882,0,0,0,.765-1.352C623.729,277.594,590.933,167.465,524.531,69.836ZM222.491,337.58c-28.972,0-52.844-26.587-52.844-59.239S193.056,219.1,222.491,219.1c29.665,0,53.306,26.82,52.843,59.239C275.334,310.993,251.924,337.58,222.491,337.58Zm195.38,0c-28.971,0-52.843-26.587-52.843-59.239S388.437,219.1,417.871,219.1c29.667,0,53.307,26.82,52.844,59.239C470.715,310.993,447.538,337.58,417.871,337.58Z"
                                />
                            </svg>
                            <span>Dołącz do Discord</span>
                        </a>
                    </div>

                    {/* Main content - two columns on desktop */}
                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Left column - Wider */}
                        <div className="md:col-span-2 space-y-8">
                            {/* Description */}
                            {lesson?.description && (
                                <div className="border-b border-gray-300 pb-8">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Opis lekcji</h3>
                                    <p className="text-gray-700 whitespace-pre-line">
                                        {lesson.description}
                                    </p>
                                </div>
                            )}

                            {/* Students Section */}
                            {lesson?.students && lesson.students.length > 0 && (
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-medium text-gray-900">Uczniowie</h3>
                                        <span className="text-sm text-gray-600">
                                            {lesson.students.length} {lesson.students.length === 1 ? 'osoba' : 'osób'}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1">
                                        {lesson.students.map((student) => (
                                            <div
                                                key={student.id}
                                                className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-300 rounded-md shadow-sm hover:bg-gray-100 transition-colors"
                                            >
                                                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
                                                    {student.avatar ? (
                                                        <img
                                                            src={student.avatar}
                                                            alt={`${student.first_name || ''} ${student.last_name || ''}`}
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => {
                                                                e.target.src = '/images/default-avatar.png';
                                                            }}
                                                        />
                                                    ) : (
                                                        <div className="flex items-center justify-center w-full h-full bg-gray-200 text-gray-500 text-xs font-medium">
                                                            {student.first_name?.[0]}
                                                            {student.last_name?.[0]}
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {student.first_name} {student.last_name}
                                                    </p>
                                                    {student.username && (
                                                        <p className="text-xs text-gray-600">@{student.username}</p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right column - Narrower */}
                        <div className="space-y-8">
                            {/* Tutor Card */}
                            <div className="border border-gray-300 rounded-lg p-4 bg-gray-50 shadow-sm">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Prowadzący</h3>
                                <div className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 transition-colors">
                                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 shadow-sm border border-gray-200">
                                        <img
                                            src={tutor.avatar}
                                            alt={`${tutor.first_name || ''} ${tutor.last_name || ''}`}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.src = '/images/default-avatar.png';
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-900">
                                            {tutor.first_name} {tutor.last_name}
                                        </h4>
                                        {tutor.username && (
                                            <p className="text-xs text-gray-600">@{tutor.username}</p>
                                        )}
                                        <div
                                            className="text-xs text-blue-900 font-medium mt-1 hover:text-blue-700 hover:underline cursor-pointer transition-colors"
                                            onClick={handleTutorClick}
                                        >
                                            Zobacz profil
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Additional information */}
                            <div className="border border-gray-300 rounded-lg p-4 bg-gray-50 shadow-sm">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Informacje dodatkowe</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-700">Status:</span>
                                        <span
                                            className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                                statusMapping[lesson?.status]?.color || 'bg-gray-100 text-gray-700'
                                            }`}
                                        >
                                            {statusMapping[lesson?.status]?.text || 'Nieznany'}
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-700">Data rozpoczęcia:</span>
                                        <span className="text-gray-900">
                                            {new Date(lesson?.start_time).toLocaleDateString('pl-PL')}
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-700">Godzina rozpoczęcia:</span>
                                        <span className="text-gray-900">
                                            {new Date(lesson?.start_time).toLocaleTimeString('pl-PL', {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-700">Godzina zakończenia:</span>
                                        <span className="text-gray-900">
                                            {new Date(lesson?.end_time).toLocaleTimeString('pl-PL', {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </span>
                                    </div>

                                    {duration && (
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-700">Czas trwania:</span>
                                            <span className="text-gray-900">{duration} min</span>
                                        </div>
                                    )}

                                    {lesson?.students && (
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-700">Liczba uczniów:</span>
                                            <span className="text-gray-900">{lesson.students.length}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {!lesson?.discord_link && (
                                <div className="bg-gray-100 text-gray-800 p-4 rounded-lg border border-gray-200">
                                    <p className="text-sm">
                                        Link do Discorda będzie dostępny 15 minut przed rozpoczęciem lekcji
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LessonModalContent;