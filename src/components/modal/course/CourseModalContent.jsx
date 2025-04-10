import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useModal } from '../../../hooks/useModal';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { enrollCourse } from '../../../store/thunks/courseThunks.js';
import { formatUtils } from '../utils';
import { ModalHeader } from '../shared/ModalHeader';
import { Card } from '../shared/Card';
import { Icon } from '../shared/Icon';
import 'react-lazy-load-image-component/src/effects/blur.css';

export const CourseModalContent = ({ course, onClose, hasHistory, goBack }) => {
    const { openTutorModal, openLessonModal } = useModal();
    const dispatch = useDispatch();

    // Get current user from redux store
    const user = useSelector((state) => state.auth.user);

    // Compute enrollment status by checking if the current user's ID is in course.students
    const isEnrolled =
        course.students && user
            ? course.students.some((student) => student.id === user.id)
            : false;

    // Steps:
    // 1 = Course Overview
    // 4 = Full Students List view
    // 5 = Full Lessons List view
    // 6 = Student Details view (from full students view)
    const [step, setStep] = useState(1);
    const [prevStep, setPrevStep] = useState(1);
    const [selectedStudent, setSelectedStudent] = useState(null);

    // Handle enrolling in a course
    const handleEnroll = () => {
        dispatch(enrollCourse(course.id))
            .unwrap()
            .then((updatedCourse) => {
                console.log("Enrolled successfully:", updatedCourse);
                // Optionally show success feedback
            })
            .catch((error) => {
                console.error("Enrollment failed:", error);
                // Optionally display an error message
            });
    };

    // Open a lesson modal with details
    const handleLessonClick = (lesson) => {
        const enhancedLesson = {
            ...lesson,
            // If lesson doesn't have students data, use course students
            students: lesson.students || course.students
        };
        openLessonModal(enhancedLesson);
    };

    // Open the tutor profile modal
    const handleTutorClick = () => {
        if (course?.tutor) {
            openTutorModal(course.tutor);
        }
    };

    // View student details
    const handleStudentClick = (student) => {
        setSelectedStudent(student);
        setPrevStep(step === 5 ? 5 : 1);
        setStep(6);
    };

    // Back button resets state based on where we came from
    const handleBack = () => {
        if (step === 6) {
            setStep(prevStep);
        } else {
            setStep(1);
        }
        setSelectedStudent(null);
    };

    // Render full students list view (step 4)
    const renderFullStudents = () => (
        <div className="p-4">
            <Card title="Wszyscy Studenci" icon="users">
                <div className="space-y-2 mt-2">
                    {course.students && course.students.length > 0 ? (
                        course.students.map((student) => (
                            <div
                                key={student.id}
                                className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                                onClick={() => handleStudentClick(student)}
                            >
                                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                                    <LazyLoadImage
                                        src={student.avatar || '/images/default-avatar.png'}
                                        alt={student.username || "Student"}
                                        effect="blur"
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.src = '/images/default-avatar.png';
                                        }}
                                    />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">
                                        {student.first_name} {student.last_name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        @{student.username}
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 text-sm">Brak zapisanych studentów</p>
                    )}
                </div>
            </Card>
        </div>
    );

    // Render student details (step 6)
    const renderStudentDetails = (student) => (
        <div className="p-4 space-y-4">
            <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                    <LazyLoadImage
                        src={student.avatar || '/images/default-avatar.png'}
                        alt={student.username || "Student"}
                        effect="blur"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.target.src = '/images/default-avatar.png';
                        }}
                    />
                </div>
                <div>
                    <h2 className="text-lg font-medium text-gray-900">
                        {student.first_name} {student.last_name}
                    </h2>
                    <p className="text-xs text-gray-500">
                        @{student.username}
                    </p>
                </div>
            </div>

            <Card title="Dane kontaktowe" icon="user">
                <p className="text-sm text-gray-600">
                    {student.email || 'Brak danych kontaktowych'}
                </p>
            </Card>

            <Card title="Status w kursie" icon="info">
        <span className="text-xs px-2.5 py-1 bg-blue-50 text-blue-600 rounded-full inline-block">
          {student.status || 'Aktywny'}
        </span>
            </Card>
        </div>
    );

    // Render full lessons list view (step 5)
    const renderFullLessons = () => (
        <div className="p-4">
            <Card title="Wszystkie Lekcje" icon="calendar">
                <div className="space-y-2 mt-2">
                    {course.lessons && course.lessons.length > 0 ? (
                        course.lessons.map((lesson) => (
                            <div
                                key={lesson.id}
                                className="p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
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
                        <p className="text-gray-500 text-sm">Brak dostępnych lekcji</p>
                    )}
                </div>
            </Card>
        </div>
    );

    // Determine header title based on step
    const getHeaderTitle = () => {
        switch (step) {
            case 1:
                return course?.name || "Kurs";
            case 4:
                return 'Wszyscy Studenci';
            case 5:
                return 'Wszystkie Lekcje';
            case 6:
                return `${selectedStudent?.first_name || ""} ${selectedStudent?.last_name || ""}`;
            default:
                return 'Kurs';
        }
    };

    return (
        <div className="flex flex-col h-full bg-white">
            {/* Header */}
            <ModalHeader
                title={getHeaderTitle()}
                onClose={onClose}
                hasHistory={hasHistory || step > 1}
                goBack={step > 1 ? handleBack : goBack}
            />

            {/* Content */}
            <div className="flex-1 overflow-y-auto bg-gray-50">
                {step === 1 && (
                    <div className="space-y-4 p-4">
                        {/* Course Banner */}
                        {course.banner && (
                            <div className="w-full h-40 overflow-hidden rounded-lg shadow-sm">
                                <LazyLoadImage
                                    src={course.banner}
                                    alt={course.name || "Kurs"}
                                    effect="blur"
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.src = '/images/default-banner.png';
                                    }}
                                />
                            </div>
                        )}

                        {/* Course Overview */}
                        <Card>
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
                        </Card>

                        {/* Course Information Cards */}
                        <div className="grid md:grid-cols-2 gap-4">
                            {/* Price Info */}
                            <Card title="Cena" icon="money">
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
                            </Card>

                            {/* Tutor Info */}
                            <Card title="Prowadzący" icon="user">
                                <div
                                    className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-50 transition-colors cursor-pointer"
                                    onClick={handleTutorClick}
                                >
                                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                                        <LazyLoadImage
                                            src={course?.tutor?.avatar || '/images/default-avatar.png'}
                                            alt={`${course?.tutor?.first_name || ''} ${course?.tutor?.last_name || ''}`}
                                            effect="blur"
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.src = '/images/default-avatar.png';
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-900">
                                            {course?.tutor?.first_name} {course?.tutor?.last_name}
                                        </h4>
                                        {course?.tutor?.username && (
                                            <p className="text-xs text-gray-500">@{course?.tutor?.username}</p>
                                        )}
                                        <span className="text-xs text-blue-600 mt-1 block">
                      Zobacz profil
                    </span>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {/* Program kursu (Lessons) */}
                        <Card title="Program kursu" icon="calendar">
                            <div className="flex justify-between items-center mb-3">
                                {course.lessons && course.lessons.length > 3 && (
                                    <button
                                        className="text-xs font-medium text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                                        onClick={() => setStep(5)}
                                    >
                                        Zobacz wszystkie
                                    </button>
                                )}
                            </div>

                            <div className="space-y-2">
                                {course?.lessons && course.lessons.length > 0 ? (
                                    course.lessons.slice(0, 3).map((lesson) => (
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
                        </Card>

                        {/* Studenci */}
                        <Card title={`Uczestnicy (${course.students?.length || 0})`} icon="users">
                            <div className="flex justify-between items-center mb-3">
                                {course.students && course.students.length > 3 && (
                                    <button
                                        className="text-xs font-medium text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                                        onClick={() => setStep(4)}
                                    >
                                        Zobacz wszystkich
                                    </button>
                                )}
                            </div>

                            <div className="space-y-2">
                                {course.students && course.students.length > 0 ? (
                                    course.students.slice(0, 3).map((student) => (
                                        <div
                                            key={student.id}
                                            className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                                            onClick={() => handleStudentClick(student)}
                                        >
                                            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                                                <LazyLoadImage
                                                    src={student.avatar || '/images/default-avatar.png'}
                                                    alt={student.username || "Student"}
                                                    effect="blur"
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.target.src = '/images/default-avatar.png';
                                                    }}
                                                />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">
                                                    {student.first_name} {student.last_name}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    @{student.username}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500 text-sm p-3 border border-gray-200 rounded-lg">
                                        Brak zapisanych studentów
                                    </p>
                                )}
                            </div>
                        </Card>

                        {/* Enroll Button */}
                        {!isEnrolled && (
                            <div className="sticky bottom-0 left-0 right-0 pt-4 pb-6 bg-gray-50">
                                <button
                                    className="w-full flex justify-center items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors"
                                    onClick={handleEnroll}
                                >
                                    <Icon name="book" className="h-4 w-4" />
                                    Zapisz się na kurs
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Full Students List (step 4) */}
                {step === 4 && renderFullStudents()}

                {/* Full Lessons List (step 5) */}
                {step === 5 && renderFullLessons()}

                {/* Student Details (step 6) */}
                {step === 6 && selectedStudent && renderStudentDetails(selectedStudent)}
            </div>
        </div>
    );
};