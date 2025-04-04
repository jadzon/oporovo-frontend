import { useState } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { motion } from 'framer-motion';
import 'react-lazy-load-image-component/src/effects/blur.css';

const statusMapping = {
    scheduled: { text: 'Zaplanowana', color: 'bg-purple-600' },
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
            className="w-64 h-96 bg-white rounded-xl shadow-lg overflow-hidden flex flex-col"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.15 }}
        >
            {/* Tutor Avatar */}
            <div className="p-4 flex justify-center">
                <div className="w-24 h-24 rounded-full bg-gray-100 relative overflow-hidden">
                    {!imageLoaded && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-full h-full bg-gray-300 animate-pulse rounded-full" />
                        </div>
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
            <div className="flex-1 px-4 flex flex-col items-center text-center space-y-2">
                <p className="text-base font-semibold text-gray-900">{tutorFullName}</p>
                <p className="text-sm text-gray-500">@{tutorUsername}</p>
                <h3 className="text-lg font-bold text-gray-900 mt-2">{lesson.title}</h3>
                <p className="mt-1 text-sm text-gray-600">{lessonDate}</p>
            </div>

            {/* Status & Info Button */}
            <div className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <span className={`w-4 h-4 rounded-full ${statusMapping[lesson.status]?.color || 'bg-gray-400'}`}></span>
                    <span className="text-sm text-gray-700">{statusMapping[lesson.status]?.text || 'Nieznany'}</span>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.05}}
                    className="btn bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded shadow transition"
                    onClick={() => onInfoClick?.(lesson)}
                >
                    Info
                </motion.button>
            </div>
        </motion.div>
    );
};

export default LessonCard;
