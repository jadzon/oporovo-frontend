import React, { useState, useRef, useEffect } from 'react';
import { useModal } from '../../../hooks/useModal';
import { useSelector, useDispatch } from 'react-redux';
import { selectIsTutor, selectIsStudent } from '../../../store/selectors/authSelectors.js';
import { Icon } from '../shared/Icon';
import { ModalHeader } from '../shared/ModalHeader';
import { StatusBadge } from '../shared/StatusBadge';
import { TimeDisplay } from '../shared/TimeDisplay';
import { Card } from '../shared/Card';

export const LessonModalContent = ({ lesson, onClose, hasHistory, goBack }) => {
    const { openTutorModal } = useModal();
    const tutor = lesson?.tutor || {};
    const [isActionsOpen, setIsActionsOpen] = useState(false);
    const actionsRef = useRef(null);
    const dispatch = useDispatch();

    const isTutor = useSelector(selectIsTutor);
    const isStudent = useSelector(selectIsStudent);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (actionsRef.current && !actionsRef.current.contains(event.target)) {
                setIsActionsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Format date and time
    const formatDate = (dateString) => {
        if (!dateString) return 'Brak danych';
        const date = new Date(dateString);
        return date.toLocaleDateString('pl-PL', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    const formatTime = (dateString) => {
        if (!dateString) return 'Brak danych';
        const date = new Date(dateString);
        return date.toLocaleTimeString('pl-PL', {
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

    // Action handlers
    const handleCancelLesson = () => {
        console.log('Anulowanie lekcji:', lesson.id);
        setIsActionsOpen(false);
    };

    const handlePostponeLesson = () => {
        console.log('Przekładanie lekcji:', lesson.id);
        setIsActionsOpen(false);
    };

    const handleConfirmLesson = () => {
        console.log('Potwierdzanie lekcji:', lesson.id);
        setIsActionsOpen(false);
    };

    const canEditLesson = ['scheduled', 'confirmed'].includes(lesson?.status);

    // Determine if lesson is upcoming or past
    const isUpcoming = lesson?.start_time && new Date(lesson.start_time) > new Date();

    return (
        <div className="flex flex-col h-full bg-white">
            {/* Modern minimal header */}
            <ModalHeader
                title="Szczegóły lekcji"
                onClose={onClose}
                hasHistory={hasHistory}
                goBack={goBack}
            />

            {/* Content area with scrolling */}
            <div className="flex-1 overflow-y-auto bg-gray-50">
                {/* Lesson header - Clean card with prominent info */}
                <div className="bg-white px-4 py-4 mb-3 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <StatusBadge status={lesson?.status || 'scheduled'} size="sm" />

                                <span className="text-xs text-gray-500">
                  {formatDate(lesson?.start_time)}
                </span>
                            </div>

                            <h1 className="text-xl font-semibold text-gray-900 mb-2">{lesson?.title || 'Lekcja'}</h1>

                            <div className="flex flex-wrap items-center gap-2 mb-3">
                                {lesson?.subject && (
                                    <span className="text-xs px-2.5 py-1 bg-blue-50 text-blue-600 rounded-full">
                    {lesson.subject}
                  </span>
                                )}
                                {lesson?.level && (
                                    <span className="text-xs px-2.5 py-1 bg-amber-50 text-amber-600 rounded-full">
                    {lesson.level}
                  </span>
                                )}
                            </div>
                        </div>

                        {/* Actions menu */}
                        <div className="flex items-center gap-3">
                            {/* Discord button */}
                            {lesson?.discord_link && (
                                <a href={lesson.discord_link}
                                   target="_blank"
                                   rel="noopener noreferrer"
                                   className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded-lg shadow-sm transition-colors"
                                >
                                    <Icon name="discord" className="h-4 w-4" />
                                    <span>Discord</span>
                                </a>
                            )}

                            {/* Actions dropdown - only show if can edit */}
                            {(isTutor || isStudent) && canEditLesson && (
                                <div className="relative" ref={actionsRef}>
                                    <button
                                        onClick={() => setIsActionsOpen(!isActionsOpen)}
                                        className="p-1.5 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
                                        aria-label="Opcje lekcji"
                                    >
                                        <Icon name="more" className="h-5 w-5" />
                                    </button>

                                    {/* Popup menu - styled like Twitter/Facebook dropdown */}
                                    {isActionsOpen && (
                                        <div className="absolute right-0 mt-2 w-56 rounded-xl shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20">
                                            <div className="py-1" role="menu" aria-orientation="vertical">
                                                {isTutor && lesson?.status === 'scheduled' && (
                                                    <button
                                                        onClick={handleConfirmLesson}
                                                        className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                                                        role="menuitem"
                                                    >
                                                        <Icon name="check-circle" className="h-5 w-5 text-green-500" />
                                                        <span>Potwierdź lekcję</span>
                                                    </button>
                                                )}

                                                <button
                                                    onClick={handlePostponeLesson}
                                                    className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                                                    role="menuitem"
                                                >
                                                    <Icon name="calendar" className="h-5 w-5 text-blue-500" />
                                                    <span>Przełóż lekcję</span>
                                                </button>

                                                <button
                                                    onClick={handleCancelLesson}
                                                    className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                                                    role="menuitem"
                                                >
                                                    <Icon name="x-circle" className="h-5 w-5 text-red-500" />
                                                    <span>Anuluj lekcję</span>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Timing information block - More compact */}
                    <div className="flex flex-wrap items-center gap-5 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                            <Icon name="calendar" className="h-4 w-4 text-gray-400" />
                            <span>{formatDate(lesson?.start_time)}</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <Icon name="clock" className="h-4 w-4 text-gray-400" />
                            <span>{formatTime(lesson?.start_time)} - {formatTime(lesson?.end_time)}</span>
                        </div>

                        {duration && (
                            <div className="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{duration} min</span>
                            </div>
                        )}
                    </div>

                    {/* Time status display for the lesson */}
                    <TimeDisplay startTime={lesson?.start_time} endTime={lesson?.end_time} />
                </div>

                {/* Main content - 2-column layout at larger sizes */}
                <div className="px-4 pb-6">
                    <div className="flex flex-col lg:flex-row gap-4">
                        {/* Left column - wider */}
                        <div className="flex-1 space-y-4">
                            {/* Tutor card - Now moved to top of left column */}
                            <Card title="Prowadzący" icon="user">
                                <div
                                    onClick={handleTutorClick}
                                    className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                                >
                                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                                        <img
                                            src={tutor.avatar || '/images/default-avatar.png'}
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
                                            <p className="text-xs text-gray-500">@{tutor.username}</p>
                                        )}
                                        <span className="text-xs text-blue-600 mt-1 block">
                      Zobacz profil
                    </span>
                                    </div>
                                </div>
                            </Card>

                            {/* Lesson description - Cleaner card */}
                            {lesson?.description && (
                                <Card title="Opis lekcji" icon="book">
                                    <p className="text-gray-600 text-sm whitespace-pre-line">
                                        {lesson.description}
                                    </p>
                                </Card>
                            )}

                            {/* Students section - More social media style */}
                            {lesson?.students && lesson.students.length > 0 && (
                                <Card title="Uczniowie" icon="users">
                                    <div className="flex justify-between items-center mb-3">
                    <span className="text-xs text-gray-500 font-medium">
                      {lesson.students.length} {lesson.students.length === 1 ? 'osoba' : 'osób'}
                    </span>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-80 overflow-y-auto">
                                        {lesson.students.map((student) => (
                                            <div
                                                key={student.id}
                                                className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                                            >
                                                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
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
                                                        <p className="text-xs text-gray-500">@{student.username}</p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            )}

                            {/* Discord alert - Now looks like a Twitter/Facebook notification */}
                            {!lesson?.discord_link && isUpcoming && (
                                <div className="bg-white rounded-lg shadow-sm p-4 flex items-start gap-3">
                                    <div className="rounded-full bg-blue-100 p-2 flex-shrink-0">
                                        <Icon name="info" className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-700">
                                            Link do Discorda będzie dostępny 15 minut przed rozpoczęciem lekcji
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right column - narrower, additional details */}
                        <div className="lg:w-64 space-y-4">
                            {/* Lesson details card */}
                            <Card title="Informacje dodatkowe" icon="info">
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-gray-500">Status</span>
                                        <StatusBadge status={lesson?.status || 'scheduled'} size="xs" />
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-gray-500">Data</span>
                                        <span className="text-xs font-medium text-gray-700">
                      {formatDate(lesson?.start_time)}
                    </span>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-gray-500">Rozpoczęcie</span>
                                        <span className="text-xs font-medium text-gray-700">
                      {formatTime(lesson?.start_time)}
                    </span>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-gray-500">Zakończenie</span>
                                        <span className="text-xs font-medium text-gray-700">
                      {formatTime(lesson?.end_time)}
                    </span>
                                    </div>

                                    {duration && (
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-gray-500">Czas trwania</span>
                                            <span className="text-xs font-medium text-gray-700">{duration} min</span>
                                        </div>
                                    )}

                                    {lesson?.students && (
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-gray-500">Liczba uczniów</span>
                                            <span className="text-xs font-medium text-gray-700">{lesson.students.length}</span>
                                        </div>
                                    )}
                                </div>
                            </Card>

                            {/* Action buttons - stacked vertically */}
                            {canEditLesson && (
                                <Card className="space-y-2">
                                    {isTutor && lesson?.status === 'scheduled' && (
                                        <button
                                            onClick={handleConfirmLesson}
                                            className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors flex justify-center items-center gap-2"
                                        >
                                            <Icon name="check" className="h-4 w-4" />
                                            <span>Potwierdź lekcję</span>
                                        </button>
                                    )}

                                    <button
                                        onClick={handlePostponeLesson}
                                        className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors flex justify-center items-center gap-2"
                                    >
                                        <Icon name="calendar" className="h-4 w-4" />
                                        <span>Przełóż lekcję</span>
                                    </button>

                                    <button
                                        onClick={handleCancelLesson}
                                        className="w-full px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-lg shadow-sm transition-colors flex justify-center items-center gap-2"
                                    >
                                        <Icon name="x" className="h-4 w-4" />
                                        <span>Anuluj lekcję</span>
                                    </button>
                                </Card>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};