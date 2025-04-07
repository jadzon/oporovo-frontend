// components/modal/CourseModalContent.jsx
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import {FaArrowLeft, FaStar, FaTimes, FaUsers, FaGraduationCap} from 'react-icons/fa';
import { useModal } from '../../hooks/useModal';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { enrollCourse } from '../../store/thunks/courseThunks.js';
import 'react-lazy-load-image-component/src/effects/blur.css';

const CourseModalContent = ({ course, onClose, hasHistory, goBack }) => {
    const { openTutorModal, openLessonModal } = useModal();
    const dispatch = useDispatch();

    // Get current user from redux store.
    const user = useSelector((state) => state.auth.user);
    // Compute enrollment status by checking if the current user's ID is in course.students.
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

    const handleEnroll = () => {
        dispatch(enrollCourse(course.id))
            .unwrap()
            .then((updatedCourse) => {
                console.log("Enrolled successfully:", updatedCourse);
                // Optionally, you can update local UI state or show a success message here.
            })
            .catch((error) => {
                console.error("Enrollment failed:", error);
                // Optionally, display an error message to the user.
            });
    };

    // Directly navigate to full lesson details
    const handleLessonClick = (lesson) => {
        const enhancedLesson = {
            ...lesson,
            // If lesson doesn't have students data, use course students
            students: lesson.students || course.students
        };
        openLessonModal(enhancedLesson);
    };

    // Directly open the full tutor profile
    const handleTutorClick = () => {
        if (course?.tutor) {
            openTutorModal(course.tutor);
        }
    };

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
        <div className="p-6 space-y-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Wszyscy Studenci</h3>
            <div className="space-y-3">
                {course.students && course.students.length > 0 ? (
                    course.students.map((student) => (
                        <motion.div
                            key={student.id}
                            whileHover={{ x: 5 }}
                            className="group cursor-pointer flex items-center gap-4 p-3 rounded-lg hover:bg-purple-50 transition-colors"
                            onClick={() => handleStudentClick(student)}
                        >
                            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-lg">
                                <LazyLoadImage
                                    src={student.avatar}
                                    alt={student.username}
                                    effect="blur"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">
                                    {student.first_name} {student.last_name}
                                </p>
                                <p className="text-sm text-gray-500">
                                    @{student.username}
                                </p>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <p className="text-gray-500">Brak zapisanych studentów</p>
                )}
            </div>
        </div>
    );

    // Render student details (step 6)
    const renderStudentDetails = (student) => (
        <div className="p-6 space-y-6">
            <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-lg">
                    <LazyLoadImage
                        src={student.avatar}
                        alt={student.username}
                        effect="blur"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                        {student.first_name} {student.last_name}
                    </h2>
                    <p className="text-sm text-gray-500">
                        Nickname: @{student.username}
                    </p>
                </div>
            </div>
            {/* Additional student details can be added here if needed */}
        </div>
    );

    // Render full lessons list view (step 5)
    const renderFullLessons = () => (
        <div className="p-6 space-y-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Wszystkie Lekcje</h3>
            <div className="space-y-3">
                {course.lessons && course.lessons.length > 0 ? (
                    course.lessons.map((lesson) => (
                        <motion.div
                            key={lesson.id}
                            whileHover={{ x: 5 }}
                            className="group cursor-pointer p-3 rounded-lg hover:bg-purple-50 transition-colors"
                            onClick={() => handleLessonClick(lesson)}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-gray-900">
                                        {lesson.title}
                                    </p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {lesson.start_time
                                            ? new Date(lesson.start_time).toLocaleDateString('pl-PL')
                                            : 'Termin nie ustalony'}
                                    </p>
                                </div>
                                <span className="text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  →
                </span>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <p className="text-gray-500">Brak dostępnych lekcji</p>
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
        <>
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                {(hasHistory || step > 1) ? (
                    <button
                        onClick={step > 1 ? handleBack : goBack}
                        className="flex items-center text-purple-600 hover:text-purple-700"
                    >
                        <FaArrowLeft className="mr-2" />
                        {step > 1 ? 'Powrót' : 'Wstecz'}
                    </button>
                ) : (
                    <div></div>
                )}
                <h2 className="text-lg font-semibold text-gray-700">
                    {getHeaderTitle()}
                </h2>
                <button
                    onClick={onClose}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
                >
                    <FaTimes className="text-xl" />
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto">
                {step === 1 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="p-6 space-y-6"
                    >
                        {/* Course Overview */}
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Left Column */}
                            <div className="space-y-4">
                                {/* Course Description */}
                                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                                        Opis kursu
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        {course?.description || 'Brak opisu kursu'}
                                    </p>
                                </div>

                                {/* Course Level */}
                                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                                        Poziom kursu
                                    </h3>
                                    <p className="text-gray-600">
                                        {course.level || 'Brak informacji o poziomie'}
                                    </p>
                                </div>

                                {/* Pricing Card */}
                                <div className="bg-purple-50 p-5 rounded-xl border border-purple-100">
                                    <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-purple-600">
                      {course?.price ? `${course.price}zł` : 'Darmowy'}
                    </span>
                                        <span className="text-gray-500">/ pełny kurs</span>
                                    </div>
                                    <p className="mt-2 text-sm text-purple-700">
                                        Obejmuje {course?.lessons?.length || 0} lekcji
                                    </p>
                                    {course?.price && course?.lessons && course.lessons.length > 0 && (
                                        <p className="mt-1 text-sm text-purple-700">
                                            Cena za lekcję: {(course.price / course.lessons.length).toFixed(2)} zł
                                        </p>
                                    )}
                                </div>

                                {/* Students Preview */}
                                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                                    <div className="flex items-center gap-3 text-purple-600 mb-4">
                                        <FaUsers className="text-xl"/>
                                        <h3 className="text-lg font-semibold">Uczestnicy ({course.students.length})</h3>
                                    </div>
                                    <div className="space-y-3 mt-4">
                                        {course.students && course.students.length > 0 ? (
                                            course.students.slice(0, 3).map((student) => (
                                                <motion.div
                                                    key={student.id}
                                                    whileHover={{x: 5}}
                                                    className="group cursor-pointer flex items-center gap-4 p-3 rounded-lg hover:bg-purple-50 transition-colors"
                                                    onClick={() => handleStudentClick(student)}
                                                >
                                                    <div
                                                        className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-lg">
                                                        <LazyLoadImage
                                                            src={student.avatar}
                                                            alt={student.username}
                                                            effect="blur"
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900">
                                                            {student.first_name} {student.last_name}
                                                        </p>
                                                        <p className="text-sm text-gray-500">
                                                            @{student.username}
                                                        </p>
                                                    </div>
                                                </motion.div>
                                            ))
                                        ) : (
                                            <p className="text-gray-500">Brak zapisanych studentów</p>
                                        )}
                                    </div>
                                    {course.students && course.students.length > 3 && (
                                        <div className="mt-4 flex justify-center">
                                            <button
                                                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
                                                onClick={() => setStep(4)}
                                            >
                                                Zobacz wszystkich
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="space-y-6">
                                {/* Tutor Card - Direct redirect to full profile */}
                                <div
                                    className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
                                    onClick={handleTutorClick}
                                >
                                    <div className="flex items-center gap-3 text-purple-600 mb-4">
                                        <FaGraduationCap className="text-xl"/>
                                        <h3 className="text-lg font-semibold">Prowadzący kurs</h3>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-lg">
                                            <LazyLoadImage
                                                src={course?.tutor?.avatar}
                                                alt={course?.tutor?.username}
                                                effect="blur"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-semibold text-gray-900">
                                                {course?.tutor?.first_name} {course?.tutor?.last_name}
                                            </h4>
                                            <p className="text-sm text-gray-500">
                                                @{course?.tutor?.username}
                                            </p>
                                            <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-purple-600">
                          {course?.tutor?.subjects?.join(', ')}
                        </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Lessons Preview - Direct navigate to full lesson details */}
                                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                        Program kursu ({course?.lessons?.length || 0})
                                    </h3>
                                    {course?.lessons && course.lessons.length > 0 ? (
                                        <div className="space-y-3">
                                            {course.lessons.slice(0, 3).map((lesson) => (
                                                <motion.div
                                                    key={lesson.id}
                                                    whileHover={{ x: 5 }}
                                                    className="group cursor-pointer p-3 rounded-lg hover:bg-purple-50 transition-colors"
                                                    onClick={() => handleLessonClick(lesson)}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <p className="font-medium text-gray-900">
                                                                {lesson.title}
                                                            </p>
                                                            <p className="text-sm text-gray-500 mt-1">
                                                                {lesson.start_time
                                                                    ? new Date(lesson.start_time).toLocaleDateString('pl-PL')
                                                                    : 'Termin nie ustalony'}
                                                            </p>
                                                        </div>
                                                        <span className="text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity">
                              →
                            </span>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500">Brak dostępnych lekcji</p>
                                    )}
                                    {course.lessons && course.lessons.length > 3 && (
                                        <div className="mt-4 flex justify-center">
                                            <button
                                                className="btn px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
                                                onClick={() => setStep(5)}
                                            >
                                                Zobacz wszystkie
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Enroll Button at the bottom (rendered only if user is not enrolled) */}
                        {!isEnrolled && (
                            <div className="mt-6 flex justify-center">
                                <button
                                    className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
                                    onClick={handleEnroll}
                                >
                                    Zapisz się na kurs
                                </button>
                            </div>
                        )}
                    </motion.div>
                )}

                {/* Full Students List (step 4) */}
                {step === 4 && renderFullStudents()}

                {/* Full Lessons List (step 5) */}
                {step === 5 && renderFullLessons()}

                {/* Student Details (step 6) */}
                {step === 6 && selectedStudent && renderStudentDetails(selectedStudent)}
            </div>
        </>
    );
};

export default CourseModalContent;