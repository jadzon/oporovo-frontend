import React, { useState, useRef, useEffect } from 'react';
import { useModal } from '../../../hooks/useModal';
import { useSelector, useDispatch } from 'react-redux';
import { selectIsTutor, selectIsStudent } from '../../../store/selectors/authSelectors.js';

// Updated status mapping with more modern, muted colors
const statusMapping = {
    scheduled: { text: 'Zaplanowana', color: 'bg-blue-50 text-blue-600', icon: 'calendar' },
    confirmed: { text: 'Potwierdzona', color: 'bg-green-50 text-green-600', icon: 'check-circle' },
    in_progress: { text: 'W trakcie', color: 'bg-purple-50 text-purple-600', icon: 'play' },
    done: { text: 'Zakończona', color: 'bg-gray-50 text-gray-600', icon: 'check' },
    failed: { text: 'Nieudana', color: 'bg-red-50 text-red-600', icon: 'x-circle' },
    cancelled: { text: 'Anulowana', color: 'bg-gray-100 text-gray-600', icon: 'x' },
};

// Icon component
const Icon = ({ name, className = "h-5 w-5" }) => {
    const icons = {
        'check': (
            <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
        ),
        'check-circle': (
            <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
        ),
        'calendar': (
            <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
        ),
        'x-circle': (
            <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
        ),
        'x': (
            <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
        ),
        'play': (
            <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polygon points="10 8 16 12 10 16 10 8"></polygon>
            </svg>
        ),
        'more': (
            <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="1"></circle>
                <circle cx="12" cy="5" r="1"></circle>
                <circle cx="12" cy="19" r="1"></circle>
            </svg>
        ),
        'close': (
            <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
        ),
        'back': (
            <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
        ),
        'clock': (
            <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
        ),
        'discord': (
            <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.54 0c1.356 0 2.46 1.104 2.46 2.472v21.528l-2.58-2.28-1.452-1.344-1.536-1.428.636 2.22h-13.608c-1.356 0-2.46-1.104-2.46-2.472v-16.224c0-1.368 1.104-2.472 2.46-2.472h16.08zm-4.632 15.672c2.652-.084 3.672-1.824 3.672-1.824 0-3.864-1.728-6.996-1.728-6.996-1.728-1.296-3.372-1.26-3.372-1.26l-.168.192c2.04.624 2.988 1.524 2.988 1.524-1.248-.684-2.472-1.02-3.612-1.152-.864-.096-1.692-.072-2.424.024l-.204.024c-.42.036-1.44.192-2.724.756-.444.204-.708.348-.708.348s.996-.948 3.156-1.572l-.12-.144s-1.644-.036-3.372 1.26c0 0-1.728 3.132-1.728 6.996 0 0 1.008 1.74 3.66 1.824 0 0 .444-.54.804-.996-1.524-.456-2.1-1.416-2.1-1.416l.336.204.048.036.047.027.014.006.047.027c.3.168.6.3.876.408.492.192 1.08.384 1.764.516.9.168 1.956.228 3.108.012.564-.096 1.14-.264 1.74-.516.42-.156.888-.384 1.38-.708 0 0-.6.984-2.172 1.428.36.456.792.972.792.972zm-5.58-5.604c-.684 0-1.224.6-1.224 1.332 0 .732.552 1.332 1.224 1.332.684 0 1.224-.6 1.224-1.332.012-.732-.54-1.332-1.224-1.332zm4.38 0c-.684 0-1.224.6-1.224 1.332 0 .732.552 1.332 1.224 1.332.684 0 1.224-.6 1.224-1.332 0-.732-.54-1.332-1.224-1.332z" />
            </svg>
        ),
        'info': (
            <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
        ),
        'user': (
            <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
            </svg>
        ),
        'users': (
            <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
        )
    };

    return icons[name] || null;
};

const LessonModalContent = ({ lesson, onClose, hasHistory, goBack }) => {
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
            <div className="px-4 py-3 flex items-center justify-between bg-white sticky top-0 z-10 border-b border-gray-100 shadow-sm">
                <div className="flex items-center gap-2">
                    {hasHistory && (
                        <button
                            onClick={goBack}
                            className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
                            aria-label="Wróć"
                        >
                            <Icon name="back" className="h-5 w-5" />
                        </button>
                    )}
                    <h2 className="text-lg font-medium text-gray-900">Szczegóły lekcji</h2>
                </div>

                <div className="flex items-center gap-1">
                    {/* Actions menu */}
                    {(isTutor || isStudent) && canEditLesson && (
                        <div className="relative" ref={actionsRef}>
                            <button
                                onClick={() => setIsActionsOpen(!isActionsOpen)}
                                className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
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

                    <button
                        onClick={onClose}
                        className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
                        aria-label="Zamknij"
                    >
                        <Icon name="close" className="h-5 w-5" />
                    </button>
                </div>
            </div>

            {/* Content area with scrolling */}
            <div className="flex-1 overflow-y-auto bg-gray-50">
                {/* Lesson header - Clean card with prominent info */}
                <div className="bg-white px-4 py-5 mb-3 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1.5 ${
                    statusMapping[lesson?.status]?.color || 'bg-gray-100 text-gray-700'
                }`}>
                  {statusMapping[lesson?.status]?.icon && (
                      <Icon name={statusMapping[lesson?.status].icon} className="h-3.5 w-3.5" />
                  )}
                    {statusMapping[lesson?.status]?.text || 'Nieznany status'}
                </span>

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

                        {/* Discord button */}
                        {lesson?.discord_link && (
                            <a href={lesson.discord_link}
                               target="_blank"
                               rel="noopener noreferrer"
                               className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors"
                            >
                                <Icon name="discord" className="h-4 w-4" />
                                <span>Dołącz do Discord</span>
                            </a>
                        )}
                    </div>

                    {/* Timing information block - More compact */}
                    <div className="flex flex-wrap items-center gap-5 mt-4 text-sm text-gray-600">
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
                </div>

                {/* Main content - 2-column layout at larger sizes */}
                <div className="px-4 pb-6">
                    <div className="flex flex-col lg:flex-row gap-4">
                        {/* Left column - wider */}
                        <div className="flex-1 space-y-4">
                            {/* Tutor card - Now moved to top of left column */}
                            <div className="bg-white rounded-lg shadow-sm p-4">
                                <h3 className="text-sm font-medium text-gray-700 mb-3">Prowadzący</h3>

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
                            </div>

                            {/* Lesson description - Cleaner card */}
                            {lesson?.description && (
                                <div className="bg-white rounded-lg shadow-sm p-4">
                                    <h3 className="text-sm font-medium text-gray-700 mb-3">Opis lekcji</h3>
                                    <p className="text-gray-600 text-sm whitespace-pre-line">
                                        {lesson.description}
                                    </p>
                                </div>
                            )}

                            {/* Students section - More social media style */}
                            {lesson?.students && lesson.students.length > 0 && (
                                <div className="bg-white rounded-lg shadow-sm p-4">
                                    <div className="flex justify-between items-center mb-3">
                                        <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                            <Icon name="users" className="h-4 w-4 text-gray-500" />
                                            Uczniowie
                                        </h3>
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
                                </div>
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
                            <div className="bg-white rounded-lg shadow-sm p-4">
                                <h3 className="text-sm font-medium text-gray-700 mb-3">Informacje dodatkowe</h3>

                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-gray-500">Status</span>
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusMapping[lesson?.status]?.color || 'bg-gray-100 text-gray-600'}`}>
                      {statusMapping[lesson?.status]?.text || 'Nieznany'}
                    </span>
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
                            </div>

                            {/* Action buttons - stacked vertically */}
                            {canEditLesson && (
                                <div className="bg-white rounded-lg shadow-sm p-4">
                                    <div className="space-y-2">
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
                                    </div>
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