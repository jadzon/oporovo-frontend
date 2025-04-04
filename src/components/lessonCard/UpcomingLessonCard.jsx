import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useState } from 'react';
import { motion } from 'framer-motion';
import 'react-lazy-load-image-component/src/effects/blur.css';

// Map lesson statuses to Polish text and colors
const statusMapping = {
    scheduled: { text: 'Zaplanowana', color: 'bg-blue-500' },
    confirmed: { text: 'Potwierdzona', color: 'bg-green-500' },
    in_progress: { text: 'W trakcie', color: 'bg-orange-500' },
    done: { text: 'Zakończona', color: 'bg-gray-500' },
    failed: { text: 'Nieudana', color: 'bg-red-500' },
    cancelled: { text: 'Anulowana', color: 'bg-black' },
};

const UpcomingLessonCard = ({ lesson, onInfoClick }) => {
    const [imageLoaded, setImageLoaded] = useState(false);

    // Format the lesson start time to Polish locale
    const formattedDate = new Date(lesson.start_time).toLocaleString('pl-PL');

    // Tutor avatar, with fallback if not provided
    const tutorAvatar = lesson.tutor?.avatar || '/images/default-avatar.png';
    // Construct tutor full name and username from API fields
    const tutorFullName = lesson.tutor
        ? `${lesson.tutor.first_name} ${lesson.tutor.last_name}`
        : 'Nieznany';
    const tutorUsername = lesson.tutor?.username || '';

    return (
        <motion.div
            className="bg-white rounded-xl shadow-lg overflow-hidden w-full flex flex-col lg:flex-row"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.1 }}
        >
            {/* LEFT: Circular Tutor Avatar */}
            <div className="flex items-center justify-center lg:justify-start p-6">
                <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-full overflow-hidden bg-gray-100 relative">
                    {!imageLoaded && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="skeleton w-full h-full rounded-full" />
                        </div>
                    )}
                    <LazyLoadImage
                        src={tutorAvatar}
                        alt={tutorFullName}
                        effect="blur"
                        className="object-cover w-full h-full"
                        afterLoad={() => setImageLoaded(true)}
                    />
                </div>
            </div>

            {/* RIGHT: Lesson Details */}
            <div className="p-6 flex-1 flex flex-col justify-center">
                <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                    {lesson.title}
                </h3>
                <div className="mb-1">
                    <p className="text-lg text-gray-800">{tutorFullName}</p>
                    {tutorUsername && (
                        <p className="text-sm text-gray-500">{tutorUsername}</p>
                    )}
                </div>
                <p className="mt-1 text-lg text-gray-700 font-medium">
                    {lesson.description}
                </p>
                <p className="mt-1 text-sm text-gray-600">{formattedDate}</p>
                {/* Status indicator */}
                <div className="mt-3 flex items-center">
          <span
              className={`w-3 h-3 rounded-full ${
                  statusMapping[lesson.status]?.color || 'bg-gray-400'
              }`}
          ></span>
                    <span className="ml-2 text-sm text-gray-700">
            {statusMapping[lesson.status]?.text || 'Nieznany'}
          </span>
                </div>
                <div className="mt-4">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.95 }}
                        className="btn btn-outline rounded-md py-2 px-6 shadow-sm"
                        onClick={() => onInfoClick?.(lesson)}
                    >
                        Info
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
};

export default UpcomingLessonCard;
