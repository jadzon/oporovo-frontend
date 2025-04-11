import { useState } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { motion } from 'framer-motion';
import { BookOpen, Clock, User } from 'lucide-react';
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

    // Status badge component - mimicking the StatusBadge from LessonCard
    const StatusBadge = ({ status }) => {
        const getStatusStyles = () => {
            switch (status?.toLowerCase()) {
                case 'active':
                    return 'bg-emerald-50 text-emerald-600';
                case 'soon':
                    return 'bg-amber-50 text-amber-600';
                case 'completed':
                    return 'bg-gray-100 text-gray-600';
                default:
                    return 'bg-gray-50 text-gray-600';
            }
        };

        return (
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${getStatusStyles()}`}>
                {status === 'active' ? 'Aktywny' :
                    status === 'soon' ? 'Wkrótce' :
                        status === 'completed' ? 'Zakończony' : 'Dostępny'}
            </span>
        );
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white shadow-sm border border-gray-100 rounded-xl overflow-hidden hover:bg-gray-50 transition-colors duration-200"
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
                <div className="w-full h-36 bg-gray-100 flex items-center justify-center border-b border-gray-100">
                    <BookOpen className="h-12 w-12 text-gray-300" />
                </div>
            )}

            {/* Status and Type */}
            <div className="px-4 pt-3 pb-2 flex justify-between items-center">
                <StatusBadge status={course.status || 'available'} />
                {course.type && (
                    <span className="text-xs text-gray-500 font-medium">
                        {course.type}
                    </span>
                )}
            </div>

            {/* Course Details */}
            <div className="px-4 pb-3">
                <h2 className="text-base font-medium text-gray-900 mb-2">{course.name}</h2>

                {/* Subject and level tags */}
                <div className="flex flex-wrap items-center gap-2 mb-3">
                    {course.subject && (
                        <span className="text-xs px-2.5 py-1 bg-gray-50 text-gray-600 rounded-full">
                            {course.subject}
                        </span>
                    )}
                    {course.level && (
                        <span className="text-xs px-2.5 py-1 bg-amber-50 text-amber-600 rounded-full">
                            {course.level}
                        </span>
                    )}
                </div>

                {/* Description */}
                <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                    {course.description || 'Brak opisu kursu.'}
                </p>

                {/* Additional Info */}
                <div className="flex items-center gap-3 text-xs text-gray-600">
                    <div className="flex items-center gap-1.5">
                        <BookOpen className="h-3.5 w-3.5 text-gray-400" />
                        <span>{course.lessons_count || 0} lekcji</span>
                    </div>

                    {course.duration && (
                        <>
                            <span className="text-gray-300">|</span>
                            <div className="flex items-center gap-1.5">
                                <Clock className="h-3.5 w-3.5 text-gray-400" />
                                <span>{course.duration}</span>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Tutor info */}
            <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center">
                    <div className="w-8 h-8 mr-2 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-100">
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
                        <div className="text-xs text-gray-500 mb-0.5">Nauczyciel:</div>
                        <div className="text-xs font-medium text-gray-700">
                            {tutorFullName}
                        </div>
                        <div className="text-xs text-gray-500">@{tutorUsername}</div>
                    </div>
                </div>

                {/* Action button */}
                <button
                    className="btn ml-2 px-3 py-1.5 text-xs font-medium text-black hover:bg-gray-50 rounded-full transition-colors hover:underline"
                    onClick={() => onInfoClick?.(course)}
                >
                    Szczegóły
                </button>
            </div>
        </motion.div>
    );
};

export default CourseCard;