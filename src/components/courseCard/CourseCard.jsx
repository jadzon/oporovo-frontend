import { useState } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { motion } from 'framer-motion';
import 'react-lazy-load-image-component/src/effects/blur.css';

const CourseCard = ({ course, onInfoClick }) => {
    const [avatarLoaded, setAvatarLoaded] = useState(false);

    // Tutor info
    const tutorAvatar = course.tutor?.avatar || '/images/default-avatar.png';
    const tutorFullName =
        course.tutor?.first_name && course.tutor?.last_name
            ? `${course.tutor.first_name} ${course.tutor.last_name}`
            : course.tutor?.username || 'Nieznany';
    const tutorUsername = course.tutor?.username || 'nieznany';

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden hover:bg-gray-50 transition-colors duration-200"
        >
            {/* Course Banner */}
            {course.banner ? (
                <div className="w-full h-36 overflow-hidden border-b border-gray-100">
                    <LazyLoadImage
                        src={course.banner}
                        alt={course.name}
                        effect="blur"
                        className="w-full h-full object-cover"
                    />
                </div>
            ) : (
                <div className="w-full h-36 bg-gray-100 flex items-center justify-center border-b border-gray-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                </div>
            )}

            {/* Status and Type */}
            <div className="px-6 pt-4 pb-2 flex justify-between items-center">
                <span className="text-sm font-medium px-3 py-1 rounded-full bg-blue-50 text-blue-900">
                    {course.status || 'Dostępny'}
                </span>
                {course.type && (
                    <span className="text-sm text-gray-600 font-medium">
                        {course.type}
                    </span>
                )}
            </div>

            {/* Course Details */}
            <div className="px-6 pb-4">
                <h2 className="text-xl font-medium text-gray-900 mb-3">{course.name}</h2>

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

                {/* Description */}
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {course.description || 'Brak opisu kursu.'}
                </p>

                {/* Additional Info */}
                <div className="flex items-center gap-3 text-sm text-gray-600">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-gray-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        />
                    </svg>
                    <span>{course.lessons_count || 0} lekcji</span>

                    {course.duration && (
                        <>
                            <span className="text-gray-500">·</span>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 text-gray-500"
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
                            <span>{course.duration}</span>
                        </>
                    )}
                </div>
            </div>

            {/* Tutor info */}
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center">
                    <div className="w-10 h-10 mr-3 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200 shadow-sm">
                        <LazyLoadImage
                            src={tutorAvatar}
                            alt={tutorUsername}
                            effect="blur"
                            className="w-full h-full object-cover"
                            afterLoad={() => setAvatarLoaded(true)}
                            onError={(e) => {
                                e.target.src = '/images/default-avatar.png';
                            }}
                        />
                    </div>
                    <div>
                        <div className="text-sm font-medium text-gray-900">
                            {tutorFullName}
                        </div>
                        <div className="text-sm text-gray-600">@{tutorUsername}</div>
                    </div>
                </div>

                {/* Action link */}
                <button
                    className="text-sm font-medium text-blue-900 hover:text-blue-700 hover:underline transition-colors"
                    onClick={() => onInfoClick?.(course)}
                >
                    Szczegóły
                </button>
            </div>
        </motion.div>
    );
};

export default CourseCard;