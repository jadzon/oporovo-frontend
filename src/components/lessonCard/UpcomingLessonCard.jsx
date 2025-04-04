import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useState } from 'react';
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

const UpcomingLessonCard = ({ lesson, onInfoClick }) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const formattedDate = new Date(lesson.start_time).toLocaleString('pl-PL');
    const tutorAvatar = lesson.tutor?.avatar || '/images/default-avatar.png';
    const tutorFullName = lesson.tutor
        ? `${lesson.tutor.first_name} ${lesson.tutor.last_name}`
        : 'Nieznany';
    const tutorUsername = lesson.tutor?.username || '';

    return (
        <motion.div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col lg:flex-row"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.15 }}>
            {/* Tutor Avatar */}
            <div className="flex items-center justify-center lg:justify-start p-6">
                <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-full overflow-hidden bg-gray-100 relative">
                    {!imageLoaded && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-full h-full bg-gray-300 animate-pulse rounded-full" />
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

            {/* Lesson Details */}
            <div className="p-6 flex-1 flex flex-col justify-center space-y-3">
                <h3 className="text-2xl font-bold text-gray-900">{lesson.title}</h3>
                <div>
                    <p className="text-lg text-gray-900">{tutorFullName}</p>
                    {tutorUsername && <p className="text-sm text-gray-500">{tutorUsername}</p>}
                </div>
                <p className="text-lg text-gray-700 font-medium">{lesson.description}</p>
                <p className="text-sm text-gray-600">{formattedDate}</p>
                <div className="flex items-center space-x-2">
                    <span className={`w-3 h-3 rounded-full ${statusMapping[lesson.status]?.color || 'bg-gray-400'}`}></span>
                    <span className="text-sm text-gray-700">{statusMapping[lesson.status]?.text || 'Nieznany'}</span>
                </div>
                <motion.button
                    className="btn bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-6 rounded shadow transition"
                    onClick={() => onInfoClick?.(lesson)}
                >
                    Info
                </motion.button>
            </div>
        </motion.div>
    );
};

export default UpcomingLessonCard;
