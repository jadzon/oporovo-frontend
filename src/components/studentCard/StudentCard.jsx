import React from 'react';
import { Icon } from '../modal/index.js';

const StudentCard = ({ student, onInfoClick }) => {
    // Student data
    const studentAvatar = student?.avatar || '/images/default-avatar.png';
    const studentUsername = student?.username || 'Nieznany';
    const studentFullName =
        student?.first_name && student?.last_name
            ? `${student.first_name} ${student.last_name}`
            : studentUsername;

    // Subjects and levels
    const subjects = student?.subjects || [];
    const levels = student?.levels || [];
    const displayedSubjects = subjects.slice(0, 2);
    const extraSubjects = subjects.length > 2 ? subjects.length - 2 : 0;
    const displayedLevels = levels.slice(0, 2);
    const extraLevels = levels.length > 2 ? levels.length - 2 : 0;

    // Lesson count
    const lessonsCount = student?.lessonsCount || 0;

    return (
        <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden hover:bg-gray-50 transition-colors duration-200">
            {/* Compact layout with avatar and data side by side */}
            <div className="p-4 flex items-start">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200 mr-3">
                    <img
                        src={studentAvatar}
                        alt={studentUsername}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.target.src = '/images/default-avatar.png';
                        }}
                    />
                </div>

                {/* Student information */}
                <div className="flex-1">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-sm font-medium text-gray-900">{studentFullName}</h2>
                            <p className="text-xs text-gray-500">@{studentUsername}</p>
                        </div>
                        <div className="flex items-center text-xs text-gray-500 font-medium">
                            {lessonsCount > 0 ? (
                                <>
                                    <Icon name="book" className="h-3.5 w-3.5 mr-1 text-gray-400" />
                                    {lessonsCount} lekcji
                                </>
                            ) : (
                                <span className="px-2 py-0.5 bg-green-50 text-green-600 rounded-full text-xs">
                                    Nowy
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Subject and level tags */}
                    {(subjects.length > 0 || levels.length > 0) && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                            {displayedSubjects.map((subject, idx) => (
                                <span key={idx} className="text-xs px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full">
                                    {subject}
                                </span>
                            ))}
                            {extraSubjects > 0 && (
                                <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full">
                                    +{extraSubjects}
                                </span>
                            )}
                            {displayedLevels.map((level, idx) => (
                                <span key={idx} className="text-xs px-2 py-0.5 bg-amber-50 text-amber-600 rounded-full">
                                    {level}
                                </span>
                            ))}
                            {extraLevels > 0 && (
                                <span className="text-xs px-2 py-0.5 bg-amber-50 text-amber-600 rounded-full">
                                    +{extraLevels}
                                </span>
                            )}
                        </div>
                    )}

                    {/* Action button */}
                    <div className="flex justify-end mt-3">
                        <button
                            className="px-3 py-1 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
                            onClick={() => onInfoClick?.(student)}
                        >
                            Zobacz profil
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentCard;