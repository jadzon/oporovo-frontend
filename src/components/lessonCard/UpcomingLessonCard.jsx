import React from 'react';

const statusMapping = {
    scheduled: { text: 'Zaplanowana', color: 'bg-indigo-100 text-indigo-800' },
    confirmed: { text: 'Potwierdzona', color: 'bg-emerald-100 text-emerald-800' },
    in_progress: { text: 'W trakcie', color: 'bg-violet-100 text-violet-800' },
    done: { text: 'Zakończona', color: 'bg-slate-100 text-slate-700' },
    failed: { text: 'Nieudana', color: 'bg-rose-100 text-rose-800' },
    cancelled: { text: 'Anulowana', color: 'bg-slate-200 text-slate-800' },
};

const UpcomingLessonCard = ({ lesson, onInfoClick }) => {
    // Tutor data extraction
    const tutorAvatar = lesson.tutor?.avatar || '/images/default-avatar.png';
    const tutorFullName =
        lesson.tutor?.first_name && lesson.tutor?.last_name
            ? `${lesson.tutor.first_name} ${lesson.tutor.last_name}`
            : lesson.tutor?.username || 'Nieznany';
    const tutorUsername = lesson.tutor?.username || 'Nieznany';

    // Format lesson date and time details
    const startTime = new Date(lesson.start_time);
    const endTime = new Date(lesson.end_time);
    const formattedDate = startTime.toLocaleDateString('pl-PL', {
        day: 'numeric',
        month: 'short',
    });
    const formattedStartTime = startTime.toLocaleTimeString('pl-PL', {
        hour: '2-digit',
        minute: '2-digit',
    });
    const formattedEndTime = endTime.toLocaleTimeString('pl-PL', {
        hour: '2-digit',
        minute: '2-digit',
    });
    const durationMinutes = Math.floor((endTime - startTime) / 60000);
    const studentCount = lesson.students?.length || 0;

    return (
        <div className="bg-gray-50 rounded-lg border border-gray-300 overflow-hidden">
            <div className="md:flex">
                {/* Left Column – Avatar with tutor info */}
                <div className="md:w-1/3 bg-gray-100 flex flex-col items-center justify-center p-8">
                    <div className="w-24 h-24 rounded-full overflow-hidden bg-white border border-gray-200 shadow-sm">
                        <img
                            src={tutorAvatar}
                            alt={tutorFullName}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.target.src = '/images/default-avatar.png';
                            }}
                        />
                    </div>
                    <div className="mt-4 text-center">
                        <div className="text-lg font-medium text-gray-900">{tutorFullName}</div>
                        <div className="text-sm text-gray-600">@{tutorUsername}</div>
                    </div>
                </div>

                {/* Right Column – Lesson details */}
                <div className="md:w-2/3 p-8 flex flex-col justify-between">
                    {/* Header: Status and Date */}
                    <div className="flex justify-between items-center mb-6">
                        <span
                            className={`text-sm font-medium px-3 py-1.5 rounded-full ${
                                statusMapping[lesson.status]?.color || 'bg-slate-100 text-slate-700'
                            }`}
                        >
                            {statusMapping[lesson.status]?.text || 'Nieznany'}
                        </span>
                        <span className="text-sm text-gray-600 font-medium">{formattedDate}</span>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-200 my-6"></div>

                    {/* Lesson Information */}
                    <div>
                        <h2 className="text-2xl font-medium text-gray-900 mb-4">{lesson.title}</h2>

                        {/* Subject/Level badges */}
                        <div className="flex flex-wrap items-center gap-3 mb-4">
                            {lesson.subject && (
                                <span className="text-sm px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full">
                                    {lesson.subject}
                                </span>
                            )}
                            {lesson.level && (
                                <span className="text-sm px-3 py-1.5 bg-amber-50 text-amber-700 rounded-full">
                                    {lesson.level}
                                </span>
                            )}
                        </div>

                        {/* Time details */}
                        <div className="flex items-center gap-3 text-sm text-gray-700 mb-4">
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
                            <span>
                                {formattedStartTime} - {formattedEndTime}
                            </span>
                            <span className="text-gray-500">·</span>
                            <span>{durationMinutes} min</span>
                            {studentCount > 0 && (
                                <>
                                    <span className="text-gray-500 ml-1">·</span>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4 text-gray-500 ml-1"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                                        />
                                    </svg>
                                    <span>
                                        {studentCount} {studentCount === 1 ? 'uczeń' : 'uczniów'}
                                    </span>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Action Button */}
                    <div className="flex justify-end">
                        <button
                            className="btn font-medium text-blue-900 hover:text-blue-700 hover:underline transition-colors"
                            onClick={() => onInfoClick?.(lesson)}
                        >
                            Szczegóły
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpcomingLessonCard;