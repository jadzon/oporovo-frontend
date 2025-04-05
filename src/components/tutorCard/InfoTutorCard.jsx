import { useState } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { motion } from 'framer-motion';
import { FaStar, FaGraduationCap } from 'react-icons/fa';
import 'react-lazy-load-image-component/src/effects/blur.css';

const InfoTutorCard = ({ tutor, onInfoClick }) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const fullStars = Math.floor(tutor.rating);
    const halfStar = tutor.rating - fullStars >= 0.5;
    const totalStars = 5;

    return (
        <motion.div
            layoutId={`tutor-${tutor.id}`}
            className="w-80 bg-white rounded-xl shadow-lg overflow-hidden flex flex-col border border-gray-100"
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.2 }}
        >
            {/* Tutor Avatar */}
            <div className="p-6 flex justify-center bg-purple-50">
                <div className="w-32 h-32 rounded-full bg-white border-4 border-white shadow-lg relative overflow-hidden">
                    {!imageLoaded && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 animate-pulse">
                            <FaGraduationCap className="text-gray-300 text-3xl" />
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

            {/* Tutor Basic Info */}
            <div className="flex-1 px-6 py-4 flex flex-col items-center text-center space-y-3">
                <h3 className="text-xl font-bold text-gray-900 tracking-tight">
                    {tutor.first_name} {tutor.last_name}
                </h3>
                <p className="text-sm text-gray-500 font-medium">{tutor.username}</p>

                {/* Quote */}
                {tutor.quote && (
                    <p className="text-sm italic text-gray-600">"{tutor.quote}"</p>
                )}

                {/* Rating */}
                <div className="flex items-center space-x-1.5">
                    {Array.from({ length: fullStars }).map((_, i) => (
                        <FaStar key={`full-${i}`} className="w-5 h-5 text-purple-500" />
                    ))}
                    {halfStar && (
                        <FaStar key="half" className="w-5 h-5 text-purple-500 opacity-75" />
                    )}
                    {Array.from({ length: totalStars - fullStars - (halfStar ? 1 : 0) }).map((_, i) => (
                        <FaStar key={`empty-${i}`} className="w-5 h-5 text-gray-200" />
                    ))}
                    <span className="ml-1 text-sm font-medium text-gray-600">
            ({tutor.rating?.toFixed(1) || "N/A"})
          </span>
                </div>

                {/* Levels */}
                {tutor.levels && tutor.levels.length > 0 && (
                    <div className="flex flex-wrap justify-center gap-2">
                        {tutor.levels.map((level, idx) => (
                            <span
                                key={idx}
                                className="text-xs px-3 py-1 bg-purple-100 text-purple-700 rounded-full font-medium"
                            >
                {level}
              </span>
                        ))}
                    </div>
                )}

                {/* Subjects */}
                {tutor.subjects && tutor.subjects.length > 0 && (
                    <div className="flex flex-wrap justify-center gap-2">
                        {tutor.subjects.map((subject, idx) => (
                            <span
                                key={idx}
                                className="text-xs px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium"
                            >
                {subject}
              </span>
                        ))}
                    </div>
                )}

                {/* Price */}
                <div className="mt-2">
          <span className="text-lg font-bold text-purple-600">
            {tutor.price} zł
          </span>
                    <span className="text-sm font-normal text-gray-500">/godz.</span>
                </div>
            </div>

            {/* Info Button */}
            <div className="p-4 border-t border-gray-100">
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2.5 px-4 rounded-lg shadow-md transition-colors"
                    onClick={() => onInfoClick?.(tutor)}
                >
                    View Profile
                </motion.button>
            </div>
        </motion.div>
    );
};

export default InfoTutorCard;
