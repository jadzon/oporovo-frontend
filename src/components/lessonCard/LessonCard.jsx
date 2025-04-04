// src/components/lessonCard/LessonCard.jsx
import { useState } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { motion } from 'framer-motion';
import 'react-lazy-load-image-component/src/effects/blur.css';

// Define a mapping from lesson statuses to Polish text and CSS classes (colors)
const statusMapping = {
    scheduled: { text: 'Zaplanowana', color: 'bg-blue-500' },
    confirmed: { text: 'Potwierdzona', color: 'bg-green-500' },
    in_progress: { text: 'W trakcie', color: 'bg-orange-500' },
    done: { text: 'Zakończona', color: 'bg-gray-500' },
    failed: { text: 'Nieudana', color: 'bg-red-500' },
    cancelled: { text: 'Anulowana', color: 'bg-black' },
};

const LessonCard = ({ lesson, onInfoClick }) => {
    const [imageLoaded, setImageLoaded] = useState(false);

    // Tutor image and details
    const tutorAvatar = lesson.tutor?.avatar || '/images/default-avatar.png';
    // Concatenate first and last name for tutor full name; fall back to username if missing.
    const tutorFullName = lesson.tutor?.first_name && lesson.tutor?.last_name
        ? `${lesson.tutor.first_name} ${lesson.tutor.last_name}`
        : lesson.tutor?.username || 'Nieznany';
    const tutorUsername = lesson.tutor?.username || 'Nieznany';

    // Format lesson start time as a localized string
    const lessonDate = new Date(lesson.start_time).toLocaleString('pl-PL');

    return (
        <motion.div
            className="w-64 h-96 bg-white rounded-xl shadow-lg overflow-hidden flex flex-col"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.1 }}
        >
            {/* TOP: Tutor Avatar */}
            <div className="p-4 flex justify-center">
                <div className="w-24 h-24 rounded-full bg-gray-100 relative overflow-hidden">
                    {!imageLoaded && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="skeleton w-full h-full rounded-full" />
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

            {/* MIDDLE: Lesson Details */}
            <div className="flex-1 px-4 flex flex-col items-center text-center space-y-1">
                {/* Tutor Full Name */}
                <p className="text-base font-medium text-gray-800">
                    {tutorFullName}
                </p>
                {/* Tutor Username */}
                <p className="text-sm text-gray-500">
                    @{tutorUsername}
                </p>
                {/* Lesson Topic */}
                <h3 className="text-lg font-semibold text-gray-800 mt-2">
                    {lesson.title}
                </h3>
                {/* Lesson Date */}
                <p className="mt-1 text-sm text-gray-600">
                    {lessonDate}
                </p>
            </div>

            {/* BOTTOM: Lesson Status and Info Button */}
            <div className="p-4 flex items-center justify-between">
                <div className="flex items-center">
          <span
              className={`w-4 h-4 rounded-full ${statusMapping[lesson.status]?.color || 'bg-gray-400'}`}
          ></span>
                    <span className="ml-2 text-sm text-gray-700">
            {statusMapping[lesson.status]?.text || 'Nieznany'}
          </span>
                </div>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.1 }}
                    className="btn btn-primary rounded-md py-2 px-4 shadow-sm"
                    onClick={() => onInfoClick?.(lesson)}
                >
                    Info
                </motion.button>
            </div>
        </motion.div>
    );
};

export default LessonCard;
