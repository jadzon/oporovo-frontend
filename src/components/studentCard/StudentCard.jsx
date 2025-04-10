import React from 'react';

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
        <div className="bg-gray-50 shadow-sm border border-gray-200 rounded-lg overflow-hidden hover:bg-gray-100 transition-colors duration-200">
            {/* Kompaktowy layout z avatarem i danymi obok siebie */}
            <div className="p-4 flex items-start">
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200 shadow-sm mr-3">
                    <img
                        src={studentAvatar}
                        alt={studentUsername}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.target.src = '/images/default-avatar.png';
                        }}
                    />
                </div>

                {/* Informacje o uczniu */}
                <div className="flex-1">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="font-medium text-gray-900">{studentFullName}</h2>
                            <p className="text-xs text-gray-600">@{studentUsername}</p>
                        </div>
                        <span className="text-xs text-gray-600 font-medium">
                            {lessonsCount > 0 ? `${lessonsCount} lekcji` : 'Nowy'}
                        </span>
                    </div>

                    {/* Tagi przedmiotów i poziomów */}
                    <div className="flex flex-wrap gap-1 mt-2">
                        {displayedSubjects.map((subject, idx) => (
                            <span key={idx} className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full">
                                {subject}
                            </span>
                        ))}
                        {extraSubjects > 0 && (
                            <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full">
                                +{extraSubjects}
                            </span>
                        )}
                        {displayedLevels.map((level, idx) => (
                            <span key={idx} className="text-xs px-2 py-0.5 bg-amber-50 text-amber-700 rounded-full">
                                {level}
                            </span>
                        ))}
                        {extraLevels > 0 && (
                            <span className="text-xs px-2 py-0.5 bg-amber-50 text-amber-700 rounded-full">
                                +{extraLevels}
                            </span>
                        )}
                    </div>

                    {/* Przycisk */}
                    <div className="flex justify-end mt-2">
                        <button
                            className="text-xs font-medium text-blue-900 hover:text-blue-700 hover:underline transition-colors"
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