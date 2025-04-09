// components/modal/course/CourseModalContent.jsx
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { useModal } from '../../../hooks/useModal';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { enrollCourse } from '../../../store/thunks/courseThunks.js';
import { formatUtils } from '../utils';
import 'react-lazy-load-image-component/src/effects/blur.css';

/**
 * Component for displaying course details
 */
const CourseModalContent = ({ course, onClose, hasHistory, goBack }) => {
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
        <div className="p-6 space-y-4">
            <h3 className="text-xl font-medium text-gray-900 mb-4">Wszyscy Studenci</h3>
            <div className="space-y-2">
                {course.students && course.students.length > 0 ? (
                    course.students.map((student) => (
                        <div
                            key={student.id}
                            className="cursor-pointer flex items-center gap-3 p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
                            onClick={() => handleStudentClick(student)}
                        >
                            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200 shadow-sm">
                                <LazyLoadImage
                                    src={student.avatar}
                                    alt={student.username}
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
                                <p className="text-sm text-gray-600">
                                    @{student.username}
                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 text-sm">Brak zapisanych studentów</p>
                )}
            </div>
        </div>
    );

    // Render student details (step 6)
    const renderStudentDetails = (student) => (
        <div className="p-6 space-y-4">
            <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200 shadow-sm">
                    <LazyLoadImage
                        src={student.avatar}
                        alt={student.username}
                        effect="blur"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.target.src = '/images/default-avatar.png';
                        }}
                    />
                </div>
                <div>
                    <h2 className="text-xl font-medium text-gray-900">
                        {student.first_name} {student.last_name}
                    </h2>
                    <p className="text-sm text-gray-600">
                        @{student.username}
                    </p>
                </div>
            </div>

            {/* Additional student details can be added here */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Dane kontaktowe</h3>
                <p className="text-sm text-gray-600">
                    {student.email || 'Brak danych kontaktowych'}
                </p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Status w kursie</h3>
                <span className="text-sm px-3 py-1 bg-blue-50 text-blue-700 rounded-full">
                    {student.status || 'Aktywny'}
                </span>
            </div>
        </div>
    );

    // Render full lessons list view (step 5)
    const renderFullLessons = () => (
        <div className="p-6 space-y-4">
            <h3 className="text-xl font-medium text-gray-900 mb-4">Wszystkie Lekcje</h3>
            <div className="space-y-2">
                {course.lessons && course.lessons.length > 0 ? (
                    course.lessons.map((lesson) => (
                        <div
                            key={lesson.id}
                            className="cursor-pointer p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
                            onClick={() => handleLessonClick(lesson)}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-900">
                                        {lesson.title}
                                    </p>
                                    <p className="text-sm text-gray-600 mt-1">
                                        {lesson.start_time
                                            ? formatUtils.formatDate(lesson.start_time)
                                            : 'Termin nie ustalony'}
                                    </p>
                                </div>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 text-blue-900"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 5l7 7-7 7"
                                    />
                                </svg>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 text-sm">Brak dostępnych lekcji</p>
                )}
            </div>
        </div>
    );

    // Determine header title based on step
    const getHeaderTitle = () => {
        switch (step) {
            case 1:
                return course?.name;
            case 4:
                return 'Wszyscy Studenci';
            case 5:
                return 'Wszystkie Lekcje';
            case 6:
                return `${selectedStudent?.first_name} ${selectedStudent?.last_name}`;
            default:
                return 'Kurs';
        }
    };

    return (
        <div className="bg-white flex flex-col h-full">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-white sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    {(hasHistory || step > 1) && (
                        <button
                            onClick={step > 1 ? handleBack : goBack}
                            className="text-sm text-blue-900 font-medium flex items-center gap-1"
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
                </div>

                <h2 className="text-lg font-semibold text-gray-800">{getHeaderTitle()}</h2>

                <button
                    onClick={onClose}
                    className="p-1 text-gray-400 hover:text-gray-600 rounded-full transition-colors"
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

            {/* Content */}
            <div className="flex-1 overflow-auto">
                {step === 1 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {/* Course Banner */}
                        {course.banner && (
                            <div className="w-full h-40 overflow-hidden border-b border-gray-200">
                                <LazyLoadImage
                                    src={course.banner}
                                    alt={course.name}
                                    effect="blur"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}

                        {/* Course Overview */}
                        <div className="p-6">
                            {/* Basic Information */}
                            <div className="mb-6">
                                {/* Subject and level tags */}
                                <div className="flex flex-wrap items-center gap-3 mb-4">
                                    {course.subject && (
                                        <span className="text-sm px-3 py-1 bg-blue-50 text-blue-700 rounded-full">
                                            {course.subject}
                                        </span>
                                    )}
                                    {course.level && (
                                        <span className="text-sm px-3 py-1 bg-amber-50 text-amber-700 rounded-full">
                                            {course.level}
                                        </span>
                                    )}
                                </div>

                                <p className="text-gray-600">
                                    {course?.description || 'Brak opisu kursu'}
                                </p>
                            </div>

                            {/* Course Information Cards */}
                            <div className="grid md:grid-cols-2 gap-6 mb-6">
                                {/* Price Info */}
                                <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
                                    <h3 className="text-sm font-medium text-gray-900 mb-3">Cena</h3>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-2xl font-medium text-gray-900">
                                            {course?.price ? formatUtils.formatPrice(course.price) : 'Darmowy'}
                                        </span>
                                        {course?.price && <span className="text-gray-500 text-sm">/ pełny kurs</span>}
                                    </div>
                                    <p className="mt-2 text-sm text-gray-600">
                                        Obejmuje {course?.lessons?.length || 0} lekcji
                                    </p>
                                    {course?.price && course?.lessons && course.lessons.length > 0 && (
                                        <p className="mt-1 text-sm text-gray-600">
                                            Cena za lekcję: {formatUtils.formatPrice(course.price / course.lessons.length)}
                                        </p>
                                    )}
                                </div>

                                {/* Tutor Info */}
                                <div className="border border-gray-300 rounded-lg p-4 bg-gray-50 shadow-sm">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Prowadzący</h3>
                                    <div className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 transition-colors">
                                        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 shadow-sm border border-gray-200">
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
                                                <p className="text-xs text-gray-600">@{course?.tutor?.username}</p>
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
                            </div>

                            {/* Program kursu (Lessons) */}
                            <div className="mb-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-medium text-gray-900">
                                        Program kursu
                                    </h3>
                                    {course.lessons && course.lessons.length > 3 && (
                                        <button
                                            className="text-sm font-medium text-blue-900 hover:text-blue-700 hover:underline transition-colors"
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
                                                className="cursor-pointer p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                                onClick={() => handleLessonClick(lesson)}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">
                                                            {lesson.title}
                                                        </p>
                                                        <p className="text-sm text-gray-600 mt-1">
                                                            {lesson.start_time
                                                                ? formatUtils.formatDate(lesson.start_time)
                                                                : 'Termin nie ustalony'}
                                                        </p>
                                                    </div>
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-5 w-5 text-blue-900"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M9 5l7 7-7 7"
                                                        />
                                                    </svg>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-500 text-sm p-3 border border-gray-200 rounded-lg">
                                            Brak dostępnych lekcji
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Studenci */}
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-medium text-gray-900">
                                        Uczestnicy ({course.students?.length || 0})
                                    </h3>
                                    {course.students && course.students.length > 3 && (
                                        <button
                                            className="text-sm font-medium text-blue-900 hover:text-blue-700 hover:underline transition-colors"
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
                                                className="cursor-pointer flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                                onClick={() => handleStudentClick(student)}
                                            >
                                                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200 shadow-sm">
                                                    <LazyLoadImage
                                                        src={student.avatar || '/images/default-avatar.png'}
                                                        alt={student.username}
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
                                                    <p className="text-sm text-gray-600">
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
                            </div>

                            {/* Enroll Button */}
                            {!isEnrolled && (
                                <div className="mt-8 flex justify-center">
                                    <button
                                        className="inline-flex items-center px-4 py-2 shadow-sm text-sm font-medium rounded-md text-white bg-blue-900 hover:bg-blue-800 transition-colors"
                                        onClick={handleEnroll}
                                    >
                                        Zapisz się na kurs
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
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

export default CourseModalContent;