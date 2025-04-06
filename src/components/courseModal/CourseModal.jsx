import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RiCloseLine, RiArrowLeftLine } from 'react-icons/ri';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { FaStar, FaClock, FaUsers, FaBookOpen, FaGraduationCap } from 'react-icons/fa';

const CourseModal = ({ course, onClose }) => {
    const [step, setStep] = useState(1); // 1 = Course, 2 = Lesson, 3 = Tutor
    const [selectedLesson, setSelectedLesson] = useState(null);
    const [selectedTutor, setSelectedTutor] = useState(null);

    const handleLessonClick = (lesson) => {
        setSelectedLesson(lesson);
        setStep(2);
    };

    const handleTutorClick = () => {
        setSelectedTutor(course.tutor);
        setStep(3);
    };

    const handleBack = () => {
        setStep(1);
        setSelectedLesson(null);
        setSelectedTutor(null);
    };

    const renderTutorProfile = (tutor) => {
        const ratingValue = tutor.rating ?? 4.8;
        const fullStars = Math.floor(ratingValue);
        const halfStar = ratingValue - fullStars >= 0.5;

        return (
            <div className="space-y-6">
                {/* Tutor Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <button
                        onClick={handleBack}
                        className="flex items-center text-purple-600 hover:text-purple-700"
                    >
                        <RiArrowLeftLine className="mr-2" /> Powrót do kursu
                    </button>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
                    >
                        <RiCloseLine className="text-2xl" />
                    </button>
                </div>

                {/* Tutor Content */}
                <div className="p-6 space-y-6">
                    {/* Profile Header */}
                    <div className="px-6 py-4 flex items-center gap-5 bg-gradient-to-r from-purple-50 to-indigo-50">
                        <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden">
                            {tutor.avatar ? (
                                <LazyLoadImage
                                    src={tutor.avatar}
                                    alt={`${tutor.first_name} ${tutor.last_name}`}
                                    effect="blur"
                                    className="object-cover w-full h-full"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full bg-gray-100 text-gray-400">
                                    <FaGraduationCap className="text-3xl" />
                                </div>
                            )}
                        </div>
                        <div className="space-y-1.5">
                            <h2 className="text-2xl font-bold text-gray-900">
                                {tutor.first_name} {tutor.last_name}
                            </h2>
                            <div className="flex items-center gap-2">
                                {[...Array(5)].map((_, i) => (
                                    <FaStar
                                        key={i}
                                        className={`w-4 h-4 ${
                                            i < fullStars ? 'text-amber-400' :
                                                (i === fullStars && halfStar ? 'text-amber-400/50' : 'text-gray-300')
                                        }`}
                                    />
                                ))}
                                <span className="text-sm font-medium text-gray-600">
                                    ({ratingValue.toFixed(1)})
                                </span>
                            </div>
                            <p className="text-sm text-gray-500">
                                {tutor.subjects?.join(' • ') || 'Brak specjalizacji'}
                            </p>
                        </div>
                    </div>

                    {/* Tutor Details */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                                <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-3">
                                    <FaBookOpen className="text-purple-600" />
                                    Specjalizacje
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {tutor.subjects?.map(subject => (
                                        <span
                                            key={subject}
                                            className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm font-medium"
                                        >
                                            {subject}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                    Poziomy nauczania
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {tutor.levels?.map(level => (
                                        <span
                                            key={level}
                                            className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium"
                                        >
                                            {level}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                                <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-3">
                                    <FaGraduationCap className="text-purple-600" />
                                    Doświadczenie
                                </h3>
                                <ul className="space-y-3">
                                    {tutor.experience?.map((exp, idx) => (
                                        <li
                                            key={idx}
                                            className="flex items-start before:content-['•'] before:mr-2 before:text-purple-600 before:font-bold"
                                        >
                                            <span className="text-gray-600">{exp}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                    O mnie
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {tutor.description || 'Brak dodatkowego opisu'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderLessonDetails = (lesson) => {
        const lessonStart = new Date(lesson.start_time);
        const lessonEnd = new Date(lesson.end_time);
        const now = new Date();
        let timePercentage = 0;

        if (now > lessonStart && now < lessonEnd) {
            const totalDuration = lessonEnd - lessonStart;
            const elapsed = now - lessonStart;
            timePercentage = (elapsed / totalDuration) * 100;
        }

        return (
            <div className="space-y-6">
                {/* Lesson Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <button
                        onClick={handleBack}
                        className="flex items-center text-purple-600 hover:text-purple-700"
                    >
                        <RiArrowLeftLine className="mr-2" /> Powrót do kursu
                    </button>
                    <span className="text-sm font-medium text-gray-500">
                        {lesson.status}
                    </span>
                </div>

                {/* Lesson Content */}
                <div className="p-6 space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Lesson Basics */}
                        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 space-y-4">
                            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                <FaBookOpen className="text-purple-600" />
                                {lesson.title}
                            </h3>
                            <p className="text-gray-600 whitespace-pre-line">
                                {lesson.description || 'Brak opisu lekcji'}
                            </p>
                        </div>

                        {/* Time Progress */}
                        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 space-y-4">
                            <div className="flex items-center gap-3 text-purple-600">
                                <FaClock className="text-xl" />
                                <h3 className="text-lg font-semibold">Termin lekcji</h3>
                            </div>
                            <div className="space-y-2">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div className="text-gray-600">
                                        <span className="block text-xs text-gray-500 mb-1">Start:</span>
                                        {lessonStart.toLocaleString('pl-PL')}
                                    </div>
                                    <div className="text-gray-600">
                                        <span className="block text-xs text-gray-500 mb-1">Koniec:</span>
                                        {lessonEnd.toLocaleString('pl-PL')}
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <motion.div
                                            className="h-full bg-purple-600"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${timePercentage}%` }}
                                            transition={{ duration: 0.5 }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tutor Card */}
                    <div
                        className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={handleTutorClick}
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-lg">
                                <LazyLoadImage
                                    src={course.tutor?.avatar}
                                    alt={course.tutor?.username}
                                    effect="blur"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div>
                                <h4 className="text-lg font-semibold text-gray-900">
                                    {course.tutor?.first_name} {course.tutor?.last_name}
                                </h4>
                                <div className="flex items-center gap-2 mt-1">
                                    {[...Array(5)].map((_, i) => (
                                        <FaStar
                                            key={i}
                                            className={`w-4 h-4 ${
                                                i < Math.floor(course.tutor?.rating)
                                                    ? 'text-amber-400'
                                                    : 'text-gray-300'
                                            }`}
                                        />
                                    ))}
                                    <span className="text-sm text-gray-600">
                                        ({course.tutor?.rating?.toFixed(1)})
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <AnimatePresence>
            {course && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <motion.div
                        layoutId={`course-${course.id}`}
                        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl mx-4 h-[90vh] flex flex-col"
                        initial={{ scale: 0.95, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.95, y: 20 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                onClick={step === 1 ? onClose : handleBack}
                                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
                            >
                                {step === 1 ? (
                                    <RiCloseLine className="text-2xl" />
                                ) : (
                                    <RiArrowLeftLine className="text-2xl" />
                                )}
                            </motion.button>
                            <h2 className="text-lg font-semibold text-gray-700">
                                {step === 1 ? course.name :
                                    step === 2 ? selectedLesson?.title :
                                        selectedTutor?.first_name}
                            </h2>
                            <div /> {/* Spacer */}
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
                                            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                                                <h3 className="text-xl font-bold text-gray-900 mb-4">
                                                    Opis kursu
                                                </h3>
                                                <p className="text-gray-600 leading-relaxed">
                                                    {course.description || 'Brak opisu kursu'}
                                                </p>
                                            </div>

                                            {/* Pricing Card */}
                                            <div className="bg-purple-50 p-5 rounded-xl border border-purple-100">
                                                <div className="flex items-baseline gap-2">
                                                    <span className="text-3xl font-bold text-purple-600">
                                                        {course.price ? `${course.price}zł` : 'Darmowy'}
                                                    </span>
                                                    <span className="text-gray-500">/ pełny kurs</span>
                                                </div>
                                                <p className="mt-2 text-sm text-purple-700">
                                                    Obejmuje {course.lessons?.length || 0} lekcji
                                                </p>
                                            </div>
                                        </div>

                                        {/* Right Column */}
                                        <div className="space-y-6">
                                            {/* Tutor Card */}
                                            <div
                                                className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
                                                onClick={handleTutorClick}
                                            >
                                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                                    Prowadzący
                                                </h3>
                                                <div className="flex items-center gap-4">
                                                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-lg">
                                                        <LazyLoadImage
                                                            src={course.tutor?.avatar}
                                                            alt={course.tutor?.username}
                                                            effect="blur"
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-lg font-semibold text-gray-900">
                                                            {course.tutor?.first_name} {course.tutor?.last_name}
                                                        </h4>
                                                        <p className="text-sm text-gray-500">
                                                            @{course.tutor?.username}
                                                        </p>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <span className="text-sm text-purple-600">
                                                                {course.tutor?.subjects?.join(', ')}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Lessons List */}
                                            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                                    Program kursu ({course.lessons?.length || 0})
                                                </h3>
                                                {course.lessons?.length > 0 ? (
                                                    <div className="space-y-3">
                                                        {course.lessons.map((lesson) => (
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
                                                                            {new Date(lesson.start_time).toLocaleDateString('pl-PL')}
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
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {step === 2 && selectedLesson && renderLessonDetails(selectedLesson)}
                            {step === 3 && selectedTutor && renderTutorProfile(selectedTutor)}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CourseModal;