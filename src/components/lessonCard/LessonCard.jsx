import React from 'react';
import { useSelector } from 'react-redux';

// Status mapping with original colors
const statusMapping = {
    scheduled: { text: 'Zaplanowana', color: 'bg-indigo-100 text-indigo-800' },
    confirmed: { text: 'Potwierdzona', color: 'bg-emerald-100 text-emerald-800' },
    in_progress: { text: 'W trakcie', color: 'bg-violet-100 text-violet-800' },
    done: { text: 'Zakończona', color: 'bg-slate-100 text-slate-700' },
    failed: { text: 'Nieudana', color: 'bg-rose-100 text-rose-800' },
    cancelled: { text: 'Anulowana', color: 'bg-slate-200 text-slate-800' },
};

const LessonCard = ({ lesson, onInfoClick }) => {
    // Get user role from Redux store
    const { user } = useSelector((state) => state.auth);
    const isTutor = user?.role === 'tutor';

    // Format start and end times
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

    // Calculate duration in minutes
    const durationMs = endTime - startTime;
    const durationMinutes = Math.floor(durationMs / 60000);

    // Count students (only show for tutors)
    const studentCount = lesson.students?.length || 0;

    return (
        <div className="bg-gray-50 shadow-sm border border-gray-200 rounded-lg overflow-hidden hover:bg-gray-100 transition-colors duration-200">
            {/* Status and date */}
            <div className="px-6 pt-4 pb-2 flex justify-between items-center">
                <span
                    className={`text-sm font-medium px-3 py-1 rounded-full ${
                        statusMapping[lesson.status]?.color || 'bg-slate-100 text-slate-700'
                    }`}
                >
                    {statusMapping[lesson.status]?.text || 'Nieznany'}
                </span>
                <span className="text-sm text-gray-600 font-medium">{formattedDate}</span>
            </div>

            {/* Lesson content section */}
            <div className="px-6 pb-4">
                <h2 className="text-xl font-medium text-gray-900 mb-3">{lesson.title}</h2>

                {/* Subject and level with original colors */}
                <div className="flex flex-wrap items-center gap-3 mb-4">
                    {lesson.subject && (
                        <span className="text-sm px-3 py-1 bg-blue-50 text-blue-700 rounded-full">
                            {lesson.subject}
                        </span>
                    )}
                    {lesson.level && (
                        <span className="text-sm px-3 py-1 bg-amber-50 text-amber-700 rounded-full">
                            {lesson.level}
                        </span>
                    )}
                </div>

                {/* Time info */}
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
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    <span>
                        {formattedStartTime} - {formattedEndTime}
                    </span>
                    <span className="text-gray-500">·</span>
                    <span>{durationMinutes} min</span>

                    {/* Show student count if there are students */}
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
                                {studentCount}{' '}
                                {studentCount === 1
                                    ? 'uczeń'
                                    : studentCount < 5
                                        ? 'uczniów'
                                        : 'uczniów'}
                            </span>
                        </>
                    )}
                </div>
            </div>

            {/* Person info - conditional display for tutor/student */}
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                {isTutor ? (
                    // TUTOR VIEW - Show students
                    <div className="flex-1">
                        {studentCount === 0 ? (
                            // No students case
                            <div className="flex items-center">
                                <div className="w-10 h-10 mr-3 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200 shadow-sm flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <div>
                                    <div className="text-xs text-gray-500 mb-0.5">Uczniowie:</div>
                                    <div className="text-sm font-medium text-gray-900">
                                        Brak zapisanych uczniów
                                    </div>
                                </div>
                            </div>
                        ) : (
                            // Students display with better styling
                            <div>
                                <div className="text-xs text-gray-500 mb-2">
                                    {studentCount === 1 ? "Uczeń:" : "Uczniowie:"}
                                </div>
                                <div className="flex flex-wrap items-center">
                                    {/* Show first 2 students */}
                                    {lesson.students.slice(0, 2).map((student, index) => (
                                        <div key={student.id || index} className="flex items-center mr-4 mb-1">
                                            <div className="w-8 h-8 mr-2 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200 shadow-sm">
                                                <img
                                                    src={student.avatar || '/images/default-avatar.png'}
                                                    alt={student.username || "Uczeń"}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.target.src = '/images/default-avatar.png';
                                                    }}
                                                />
                                            </div>
                                            <span className="text-sm font-medium text-gray-900">
                                                {student.first_name || student.username}
                                            </span>
                                        </div>
                                    ))}

                                    {/* Show +X for additional students */}
                                    {studentCount > 2 && (
                                        <div className="flex items-center">
                                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-800 font-medium text-xs mr-2 border border-blue-200">
                                                +{studentCount - 2}
                                            </div>
                                            <span className="text-sm text-gray-700">
                                                {studentCount > 3 ? "więcej uczniów" : "więcej"}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    // STUDENT VIEW - Show tutor
                    <div className="flex items-center">
                        <div className="w-10 h-10 mr-3 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200 shadow-sm">
                            <img
                                src={lesson.tutor?.avatar || '/images/default-avatar.png'}
                                alt={lesson.tutor?.username || "Nauczyciel"}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.src = '/images/default-avatar.png';
                                }}
                            />
                        </div>
                        <div>
                            <div className="text-xs text-gray-500 mb-0.5">Nauczyciel:</div>
                            <div className="text-sm font-medium text-gray-900">
                                {lesson.tutor?.first_name && lesson.tutor?.last_name
                                    ? `${lesson.tutor.first_name} ${lesson.tutor.last_name}`
                                    : lesson.tutor?.username || 'Nieznany'}
                            </div>
                            <div className="text-sm text-gray-600">@{lesson.tutor?.username || 'nieznany'}</div>
                        </div>
                    </div>
                )}

                {/* Action link */}
                <button
                    className="btn text-sm font-medium text-blue-900 hover:text-blue-700 hover:underline transition-colors whitespace-nowrap ml-2"
                    onClick={() => onInfoClick?.(lesson)}
                >
                    {'Szczegóły'}
                </button>
            </div>
        </div>
    );
};

export default LessonCard;