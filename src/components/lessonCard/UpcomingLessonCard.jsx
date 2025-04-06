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

const UpcomingLessonCard = ({ lesson, onInfoClick }) => {
    const [imageLoaded, setImageLoaded] = useState(false);

    const formattedDate = new Date(lesson.start_time).toLocaleString('pl-PL');
    const tutorAvatar = lesson.tutor?.avatar || '/images/default-avatar.png';
    const tutorFullName = lesson.tutor
        ? `${lesson.tutor.first_name} ${lesson.tutor.last_name}`
        : 'Nieznany';
    const tutorUsername = lesson.tutor?.username || '';

    return (
        <motion.div
            /**
             * layoutId matches the one used by LessonModal to achieve
             * a smooth shared-element transition (grow from card).
             */
            layoutId={`lesson-${lesson.id}1`}
            className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col lg:flex-row border border-gray-100"
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.2 }}
        >
            {/* Tutor Avatar */}
            <div className="flex items-center justify-center lg:justify-start p-6 bg-purple-50">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-white border-4 border-white shadow-lg relative">
                    {!imageLoaded && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 animate-pulse">
                            <div className="w-full h-full rounded-full" />
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
            <div className="p-6 flex-1 flex flex-col justify-center space-y-4">
                <h3 className="text-2xl font-bold text-gray-900 tracking-tight">{lesson.title}</h3>

                <div className="space-y-1">
                    <p className="text-lg font-semibold text-gray-900">{tutorFullName}</p>
                    {!!tutorUsername && <p className="text-sm text-gray-500">@{tutorUsername}</p>}
                </div>

                {!!lesson.description && (
                    <p className="text-gray-600 leading-relaxed">{lesson.description}</p>
                )}

                <div className="px-4 py-2 bg-purple-50 rounded-lg">
                    <p className="text-sm font-medium text-purple-700">{formattedDate}</p>
                </div>

                <div className="flex items-center gap-2">
          <span
              className={`w-3 h-3 rounded-full ${
                  statusMapping[lesson.status]?.color || 'bg-gray-400'
              }`}
          />
                    <span className="text-sm font-medium text-gray-700">
            {statusMapping[lesson.status]?.text || 'Nieznany'}
          </span>
                </div>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="self-start bg-purple-700 hover:bg-purple-700 text-white font-semibold py-2.5 px-6 rounded-lg shadow-md transition-colors"
                    onClick={() => onInfoClick?.(lesson)}
                >
                    Szczegóły
                </motion.button>
            </div>
        </motion.div>
    );
};

export default UpcomingLessonCard;
