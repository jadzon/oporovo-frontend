// View component for displaying course details
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { modalDataService } from '../api/modalDataService';
import { useModal } from '../core/useModal';
import ModalHeader from '../components/ModalHeader';
import ModalSection from '../components/ModalSection';
import ModalActions from '../components/ModalActions';
import ProfileCard from '../components/ProfileCard';
import LoadingState from '../components/LoadingState';
import { Icon } from '../../../utils/Icon.jsx';
import { formatUtils } from '../../../utils';

const CourseDetailsView = ({ courseId }) => {
    const { openLessonModal, showConfirmation, openScheduleModal } = useModal();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [enrolling, setEnrolling] = useState(false);

    // Get user from Redux store
    const { user } = useSelector((state) => state.auth);

    // Compute enrollment status by checking if the current user's ID is in course.students
    const isEnrolled = course?.students && user
        ? course.students.some((student) => student.id === user.id)
        : false;

    // Fetch course data
    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                setLoading(true);
                const courseData = await modalDataService.getCourse(courseId);
                setCourse(courseData);
                setError(null);
            } catch (err) {
                console.error('Error fetching course:', err);
                setError('Nie udało się załadować szczegółów kursu.');
            } finally {
                setLoading(false);
            }
        };

        if (courseId) {
            fetchCourseData();
        }
    }, [courseId]);

    // Handle enrolling in a course
    const handleEnroll = async () => {
        try {
            setEnrolling(true);
            await modalDataService.enrollCourse(courseId);

            // Show confirmation
            showConfirmation({
                type: 'success',
                title: 'Zapisano na kurs',
                message: 'Zostałeś pomyślnie zapisany na kurs',
                data: { title: course.name }
            });

            // Refresh course data
            const updatedCourse = await modalDataService.getCourse(courseId);
            setCourse(updatedCourse);
        } catch (err) {
            console.error('Error enrolling in course:', err);
            setError('Nie udało się zapisać na kurs.');
        } finally {
            setEnrolling(false);
        }
    };

    // Open a lesson modal with details
    const handleLessonClick = (lesson) => {
        const enhancedLesson = {
            ...lesson,
            // If lesson doesn't have students data, use course students
            students: lesson.students || course.students
        };
        openLessonModal(enhancedLesson.id);
    };

    // Schedule lesson with the tutor
    const handleScheduleLesson = (tutor) => {
        if (tutor?.id) {
            openScheduleModal(tutor.id);
        }
    };

    const handleSendMessage = (person) => {
        console.log("Send message to:", person);
        // Message functionality can be implemented later
    };

    if (loading) {
        return (
            <div className="flex flex-col h-full">
                <ModalHeader title="Szczegóły kursu" />
                <LoadingState message="Ładowanie szczegółów kursu..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col h-full">
                <ModalHeader title="Szczegóły kursu" />
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

    if (!course) {
        return (
            <div className="flex flex-col h-full">
                <ModalHeader title="Szczegóły kursu" />
                <div className="flex flex-col items-center justify-center flex-1 p-6">
                    <p className="text-gray-600">Nie znaleziono kursu.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            <ModalHeader title={course.name || "Kurs"} />

            {/* Content area with scrolling */}
            <div className="flex-1 overflow-y-auto bg-gray-50">
                <div className="space-y-4 p-4 pb-20">
                    {/* Course Banner */}
                    {course.banner && (
                        <div className="w-full h-40 overflow-hidden rounded-lg shadow-sm">
                            <img
                                src={course.banner}
                                alt={course.name || "Kurs"}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.src = '/images/default-banner.png';
                                }}
                            />
                        </div>
                    )}

                    {/* Course Overview */}
                    <ModalSection variant="card">
                        {/* Subject and level tags */}
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                            {course.subject && (
                                <span className="text-xs px-2.5 py-1 bg-blue-50 text-blue-600 rounded-full">
                  {course.subject}
                </span>
                            )}
                            {course.level && (
                                <span className="text-xs px-2.5 py-1 bg-amber-50 text-amber-600 rounded-full">
                  {course.level}
                </span>
                            )}
                        </div>

                        <p className="text-sm text-gray-600">
                            {course?.description || 'Brak opisu kursu'}
                        </p>
                    </ModalSection>

                    {/* Course Information Cards */}
                    <div className="grid md:grid-cols-2 gap-4">
                        {/* Price Info */}
                        <ModalSection title="Cena" icon="money" variant="card">
                            <div className="flex items-baseline gap-2">
                <span className="text-lg font-medium text-gray-900">
                  {course?.price ? formatUtils.formatPrice(course.price) : 'Darmowy'}
                </span>
                                {course?.price && <span className="text-xs text-gray-500">/ pełny kurs</span>}
                            </div>
                            <p className="mt-2 text-xs text-gray-600">
                                Obejmuje {course?.lessons?.length || 0} lekcji
                            </p>
                            {course?.price && course?.lessons && course.lessons.length > 0 && (
                                <p className="mt-1 text-xs text-gray-600">
                                    Cena za lekcję: {formatUtils.formatPrice(course.price / course.lessons.length)}
                                </p>
                            )}
                        </ModalSection>

                        {/* Tutor Info */}
                        <ModalSection title="Prowadzący" icon="user" variant="card">
                            <ProfileCard
                                profile={course.tutor}
                                role="tutor"
                                onScheduleLesson={handleScheduleLesson}
                                onSendMessage={handleSendMessage}
                            />
                        </ModalSection>
                    </div>

                    {/* Program kursu (Lessons) */}
                    <ModalSection
                        title="Program kursu"
                        icon="calendar"
                        variant="card"
                    >
                        <div className="space-y-2">
                            {course?.lessons && course.lessons.length > 0 ? (
                                course.lessons.slice(0, 5).map((lesson) => (
                                    <div
                                        key={lesson.id}
                                        className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                                        onClick={() => handleLessonClick(lesson)}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">
                                                    {lesson.title || "Lekcja bez tytułu"}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {lesson.start_time
                                                        ? formatUtils.formatDate(lesson.start_time)
                                                        : 'Termin nie ustalony'}
                                                </p>
                                            </div>
                                            <Icon name="back" className="h-4 w-4 text-gray-400 rotate-180" />
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 text-sm p-3 border border-gray-200 rounded-lg">
                                    Brak dostępnych lekcji
                                </p>
                            )}
                        </div>
                    </ModalSection>

                    {/* Studenci */}
                    <ModalSection
                        title={`Uczestnicy (${course.students?.length || 0})`}
                        icon="users"
                        variant="card"
                    >
                        <div className="space-y-2">
                            {course.students && course.students.length > 0 ? (
                                course.students.slice(0, 5).map((student) => (
                                    <ProfileCard
                                        key={student.id}
                                        profile={student}
                                        role="student"
                                        onSendMessage={handleSendMessage}
                                    />
                                ))
                            ) : (
                                <p className="text-gray-500 text-sm p-3 border border-gray-200 rounded-lg">
                                    Brak zapisanych studentów
                                </p>
                            )}
                        </div>
                    </ModalSection>
                </div>
            </div>

            {/* Enroll Button */}
            {!isEnrolled && (
                <ModalActions
                    primaryAction={{
                        label: enrolling ? "Zapisywanie..." : "Zapisz się na kurs",
                        icon: "book",
                        onClick: handleEnroll,
                        disabled: enrolling
                    }}
                    secondaryAction={{
                        label: "Zaplanuj lekcję indywidualną",
                        icon: "calendar",
                        onClick: () => course.tutor && handleScheduleLesson(course.tutor)
                    }}
                />
            )}
        </div>
    );
};

export default CourseDetailsView;