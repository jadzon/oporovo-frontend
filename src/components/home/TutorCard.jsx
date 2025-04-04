import { useState } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { motion } from 'framer-motion';
import { FaStar } from 'react-icons/fa';
import 'react-lazy-load-image-component/src/effects/blur.css';

const TutorCard = ({ tutor, onInfoClick }) => {
    const [imageLoaded, setImageLoaded] = useState(false);

    // Calculate stars based on tutor.rating
    const fullStars = Math.floor(tutor.rating);
    const halfStar = tutor.rating - fullStars >= 0.5;
    const totalStars = 5;

    return (
        <motion.div
            layoutId={`tutor-${tutor.id}`}
            className="w-64 bg-white rounded-xl shadow-lg overflow-hidden flex flex-col"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.1 }}
        >
            {/* TOP: Tutor Avatar */}
            <div className="p-6 flex justify-center">
                <div className="w-28 h-28 rounded-full bg-gray-100 relative overflow-hidden">
                    {!imageLoaded && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="skeleton w-full h-full rounded-full" />
                        </div>
                    )}
                    <LazyLoadImage
                        src={tutor.avatar}
                        alt={`${tutor.first_name} ${tutor.last_name}`}
                        effect="blur"
                        className="w-full h-full object-cover"
                        afterLoad={() => setImageLoaded(true)}
                    />
                </div>
            </div>

            {/* MIDDLE: Tutor Details */}
            <div className="flex-1 px-4 flex flex-col items-center text-center space-y-1">
                <h3 className="text-xl font-semibold text-gray-800">
                    {tutor.first_name} {tutor.last_name}
                </h3>
                <p className="text-sm text-gray-500">{tutor.username}</p>
                <div className="mt-2 flex items-center">
                    {Array.from({ length: fullStars }).map((_, i) => (
                        <FaStar key={`full-${i}`} className="w-5 h-5 text-yellow-400" />
                    ))}
                    {halfStar && (
                        <FaStar key="half" className="w-5 h-5 text-yellow-400 opacity-50" />
                    )}
                    {Array.from({ length: totalStars - fullStars - (halfStar ? 1 : 0) }).map((_, i) => (
                        <FaStar key={`empty-${i}`} className="w-5 h-5 text-gray-300" />
                    ))}
                    <span className="ml-2 text-sm text-gray-600">
            ({tutor.rating.toFixed(1)})
          </span>
                </div>
                {tutor.levels && tutor.levels.length > 0 && (
                    <div className="mt-2 flex flex-wrap justify-center gap-1">
                        {tutor.levels.map((level, idx) => (
                            <span
                                key={idx}
                                className="text-xs px-2 py-1 bg-purple-100 text-purple-600 rounded-full"
                            >
                {level}
              </span>
                        ))}
                    </div>
                )}
            </div>

            {/* BOTTOM: Info Button */}
            <div className="p-4">
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.1 }}
                    className="w-full btn btn-primary rounded-md py-2 px-4 shadow-sm"
                    onClick={() => onInfoClick?.(tutor)}
                >
                    Info
                </motion.button>
            </div>
        </motion.div>
    );
};

export default TutorCard;
