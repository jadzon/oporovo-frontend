import { useState } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { motion } from 'framer-motion';
import 'react-lazy-load-image-component/src/effects/blur.css';

const statusMapping = {
    scheduled: { text: 'Zaplanowana', color: 'bg-purple-700' },
    confirmed: { text: 'Potwierdzona', color: 'bg-green-600' },
    in_progress: { text: 'W trakcie', color: 'bg-purple-500' },
    done: { text: 'Zakończona', color: 'bg-gray-600' },
    failed: { text: 'Nieudana', color: 'bg-red-600' },
    cancelled: { text: 'Anulowana', color: 'bg-gray-800' },
};

const LessonCard = ({ lesson, onInfoClick }) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const tutorAvatar = lesson.tutor?.avatar || '/images/default-avatar.png';
    const tutorFullName = lesson.tutor?.first_name && lesson.tutor?.last_name
        ? `${lesson.tutor.first_name} ${lesson.tutor.last_name}`
        : lesson.tutor?.username || 'Nieznany';
    const tutorUsername = lesson.tutor?.username || 'Nieznany';
    const lessonDate = new Date(lesson.start_time).toLocaleString('pl-PL');

    return (
        <motion.div
            className="w-72 bg-white rounded-xl shadow-lg overflow-hidden flex flex-col border border-gray-100"
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.2 }}
        >
            {/* Tutor Avatar Section */}
            <div className="p-6 flex justify-center bg-purple-50">
                <div className="w-28 h-28 rounded-full bg-white border-4 border-white shadow-lg relative overflow-hidden">
                    {!imageLoaded && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 animate-pulse rounded-full" />
                    )}
                    <LazyLoadImage
                        src={tutorAvatar}
                        alt={tutorUsername}
                        effect="blur"
                        className="w-full h-full object-cover"
                        afterLoad={() => setImageLoaded(true)}
                    />
                </div>
            </div>

            {/* Lesson Details */}
            <div className="flex-1 px-6 py-4 flex flex-col items-center text-center space-y-3">
                <h3 className="text-xl font-bold text-gray-900 tracking-tight">
                    {tutorFullName}
                </h3>
                <p className="text-sm text-gray-500 font-medium">@{tutorUsername}</p>

                <div className="w-full space-y-4">
                    <h4 className="text-lg font-semibold text-gray-900">{lesson.title}</h4>
                    <div className="px-4 py-2 bg-purple-50 rounded-lg">
                        <p className="text-sm font-medium text-purple-700">{lessonDate}</p>
                    </div>
                </div>
            </div>

            {/* Status & Button */}
            <div className="p-4 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${statusMapping[lesson.status]?.color || 'bg-gray-400'}`} />
                    <span className="text-sm font-medium text-gray-700">
                        {statusMapping[lesson.status]?.text || 'Nieznany'}
                    </span>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="bg-purple-700 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors text-sm"
                    onClick={() => onInfoClick?.(lesson)}
                >
                    Szczegóły
                </motion.button>
            </div>
        </motion.div>
    );
};

export default LessonCard;