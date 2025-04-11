// View component for displaying lesson details
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { modalDataService } from '../api/modalDataService';
import { useModal } from '../core/useModal';
import ModalHeader from '../components/ModalHeader';
import ModalSection from '../components/ModalSection';
import ModalActions from '../components/ModalActions';
import ProfileCard from '../components/ProfileCard';
import LoadingState from '../components/LoadingState';
import { StatusBadge } from '../components/StatusBadge';
import { TimeDisplay } from '../components/TimeDisplay';
import { Icon } from '../components/Icon';

const LessonDetailsView = ({ lessonId }) => {
    const { openScheduleModal, closeModal } = useModal();
    const [lesson, setLesson] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isActionsOpen, setIsActionsOpen] = useState(false);

    // Get user role from Redux store
    const { user } = useSelector((state) => state.auth);
    const isTutor = user?.role === "tutor";

    // Fetch lesson data
    useEffect(() => {
        const fetchLessonData = async () => {
            try {
                setLoading(true);
                const lessonData = await modalDataService.getLesson(lessonId);
                setLesson(lessonData);
                setError(null);
            } catch (err) {
                console.error('Error fetching lesson:', err);
                setError('Nie udało się załadować szczegółów lekcji.');
            } finally {
                setLoading(false);
            }
        };

        if (lessonId) {
            fetchLessonData();
        }
    }, [lessonId]);

    // Handle action menu click
    const handleActionMenuClick = () => {
        setIsActionsOpen(!isActionsOpen);
    };

    // Format date and time
    const formatDate = (dateString) => {
        if (!dateString) return "Brak danych";
        const date = new Date(dateString);
        return date.toLocaleDateString("pl-PL", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    const formatTime = (dateString) => {
        if (!dateString) return "Brak danych";
        const date = new Date(dateString);
        return date.toLocaleTimeString("pl-PL", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    // Calculate duration in minutes
    const calculateDuration = () => {
        if (!lesson?.start_time || !lesson?.end_time) return null;
        const start = new Date(lesson.start_time);
        const end = new Date(lesson.end_time);
        const durationMs = end - start;
        return Math.floor(durationMs / 60000);
    };

    const duration = calculateDuration();

    // Action handlers
    const handleConfirmLesson = async () => {
        try {
            await modalDataService.confirmLesson(lessonId);
            // Refresh lesson data after confirmation
            const updatedLesson = await modalDataService.getLesson(lessonId);
            setLesson(updatedLesson);
        } catch (err) {
            console.error('Error confirming lesson:', err);
            setError('Nie udało się potwierdzić lekcji.');
        }
        setIsActionsOpen(false);
    };

    const handleCancelLesson = async () => {
        try {
            await modalDataService.cancelLesson(lessonId);
            // Refresh lesson data after cancellation
            const updatedLesson = await modalDataService.getLesson(lessonId);
            setLesson(updatedLesson);
        } catch (err) {
            console.error('Error canceling lesson:', err);
            setError('Nie udało się anulować lekcji.');
        }
        setIsActionsOpen(false);
    };

    const handleScheduleLesson = (tutor) => {
        if (tutor?.id) {
            openScheduleModal(tutor.id);
        }
    };

    const handleSendMessage = (person) => {
        console.log("Send message to:", person);
        // Message functionality can be implemented later
    };

    // Determine if lesson is upcoming or past
    const isUpcoming = lesson?.start_time && new Date(lesson.start_time) > new Date();

    // Determine if user can edit the lesson
    const canEditLesson = ["scheduled", "confirmed"].includes(lesson?.status);

    if (loading) {
        return (
            <div className="flex flex-col h-full">
                <ModalHeader title="Szczegóły lekcji" />
                <LoadingState message="Ładowanie szczegółów lekcji..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col h-full">
                <ModalHeader title="Szczegóły lekcji" />
                <div className="flex flex-col items-center justify-center flex-1 p-6">
                    <div className="text-red-500 mb-4">
                        <Icon name="x-circle" className="h-12 w-12 mx-auto" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Wystąpił błąd</h3>
                    <p className="text-gray-600 text-center">{error}</p>
                </div>
            </div>
        );
    }

    if (!lesson) {
        return (
            <div className="flex flex-col h-full">
                <ModalHeader title="Szczegóły lekcji" />
                <div className="flex flex-col items-center justify-center flex-1 p-6">
                    <p className="text-gray-600">Nie znaleziono lekcji.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            <ModalHeader title="Szczegóły lekcji" />

            {/* Lesson header with status and title */}
            <div className="bg-white px-4 py-4 border-b border-gray-100">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <StatusBadge status={lesson?.status || "scheduled"} size="sm" />
                            <span className="text-xs text-gray-500">{formatDate(lesson?.start_time)}</span>
                        </div>

                        <h1 className="text-xl font-semibold text-gray-900 mb-2">{lesson?.title || "Lekcja"}</h1>

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
                        {/* Discord button if available */}
                        {lesson?.discord_link && (
                            <a
                                href={lesson.discord_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#5865F2] hover:bg-[#4752c4] text-white text-xs font-medium rounded-full shadow-sm transition-colors"
                            >
                                <Icon name="discord" className="h-4 w-4" />
                                <span>Discord</span>
                            </a>
                        )}

                        {/* Actions dropdown - only show if can edit */}
                        {canEditLesson && (
                            <div className="relative">
                                <button
                                    onClick={handleActionMenuClick}
                                    className="p-1.5 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
                                    aria-label="Opcje lekcji"
                                >
                                    <Icon name="more" className="h-5 w-5" />
                                </button>

                                {/* Popup menu */}
                                {isActionsOpen && (
                                    <div className="absolute right-0 mt-2 w-56 rounded-xl shadow-md bg-white border border-gray-100 z-20">
                                        <div className="py-1" role="menu" aria-orientation="vertical">
                                            {isTutor && lesson?.status === "scheduled" && (
                                                <button
                                                    onClick={handleConfirmLesson}
                                                    className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-3"
                                                    role="menuitem"
                                                >
                                                    <Icon name="check-circle" className="h-5 w-5 text-green-500" />
                                                    <span>Potwierdź lekcję</span>
                                                </button>
                                            )}

                                            <button
                                                onClick={handleCancelLesson}
                                                className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-3"
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

                {/* Timing information block */}
                <div className="flex flex-wrap items-center gap-5 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                        <Icon name="calendar" className="h-4 w-4 text-gray-400" />
                        <span>{formatDate(lesson?.start_time)}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <Icon name="clock" className="h-4 w-4 text-gray-400" />
                        <span>
              {formatTime(lesson?.start_time)} - {formatTime(lesson?.end_time)}
            </span>
                    </div>

                    {duration && (
                        <div className="flex items-center gap-2">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 text-gray-400"
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

                {/* Time status display */}
                <TimeDisplay startTime={lesson?.start_time} endTime={lesson?.end_time} />
            </div>

            {/* Main content with scrolling */}
            <div className="flex-1 overflow-y-auto bg-gray-50">
                <div className="p-4 space-y-4">
                    {/* Tutor info */}
                    <ModalSection title="Prowadzący" icon="user" variant="card">
                        <ProfileCard
                            profile={lesson.tutor}
                            role="tutor"
                            onScheduleLesson={handleScheduleLesson}
                            onSendMessage={handleSendMessage}
                        />
                    </ModalSection>

                    {/* Lesson description */}
                    {lesson?.description && (
                        <ModalSection title="Opis lekcji" icon="book" variant="card">
                            <p className="text-gray-600 text-sm whitespace-pre-line">{lesson.description}</p>
                        </ModalSection>
                    )}

                    {/* Students section */}
                    {lesson?.students && lesson.students.length > 0 && (
                        <ModalSection title="Uczniowie" icon="users" variant="card">
                            <div className="space-y-2 max-h-80 overflow-y-auto">
                                {lesson.students.map((student) => (
                                    <ProfileCard
                                        key={student.id}
                                        profile={student}
                                        role="student"
                                        onSendMessage={handleSendMessage}
                                    />
                                ))}
                            </div>
                        </ModalSection>
                    )}

                    {/* Discord alert */}
                    {!lesson?.discord_link && isUpcoming && (
                        <div className="bg-white rounded-lg shadow-sm p-4 flex items-start gap-3">
                            <div className="rounded-full bg-gray-100 p-2 flex-shrink-0">
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
            </div>

            {/* Action buttons */}
            {canEditLesson && (
                <ModalActions
                    primaryAction={
                        isTutor && lesson?.status === "scheduled"
                            ? {
                                label: "Potwierdź lekcję",
                                icon: "check",
                                onClick: handleConfirmLesson
                            }
                            : null
                    }
                    secondaryAction={{
                        label: "Zaplanuj podobną lekcję",
                        icon: "calendar",
                        onClick: () => lesson.tutor && handleScheduleLesson(lesson.tutor)
                    }}
                    tertiaryAction={{
                        label: "Anuluj lekcję",
                        icon: "x",
                        onClick: handleCancelLesson
                    }}
                />
            )}
        </div>
    );
};

export default LessonDetailsView;