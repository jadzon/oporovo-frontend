import { motion } from 'framer-motion';
import 'react-lazy-load-image-component/src/effects/blur.css';

const InfoTutorCardSkeleton = () => {
    return (
        <motion.div
            className="w-80 bg-white rounded-xl shadow-lg overflow-hidden flex flex-col border border-gray-100"
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            {/* Tutor Avatar Skeleton */}
            <div className="p-6 flex justify-center white">
                <div className="w-32 h-32 rounded-full bg-gray-200 animate-pulse" />
            </div>

            {/* Tutor Basic Info Skeleton */}
            <div className="flex-1 px-6 py-4 flex flex-col items-center text-center space-y-3">
                {/* Name Skeleton */}
                <div className="w-40 h-6 bg-gray-200 rounded animate-pulse" />
                {/* Username Skeleton */}
                <div className="w-28 h-4 bg-gray-200 rounded animate-pulse" />
                {/* Quote Skeleton */}
                <div className="w-48 h-4 bg-gray-200 rounded animate-pulse" />
                {/* Rating Skeleton */}
                <div className="flex space-x-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="w-5 h-5 bg-gray-200 rounded animate-pulse" />
                    ))}
                </div>
                {/* Levels Skeleton */}
                <div className="flex flex-wrap justify-center gap-2">
                    {Array.from({ length: 2 }).map((_, i) => (
                        <div key={i} className="w-16 h-4 bg-gray-200 rounded animate-pulse" />
                    ))}
                </div>
                {/* Subjects Skeleton */}
                <div className="flex flex-wrap justify-center gap-2">
                    {Array.from({ length: 2 }).map((_, i) => (
                        <div key={i} className="w-16 h-4 bg-gray-200 rounded animate-pulse" />
                    ))}
                </div>
                {/* Price Skeleton */}
                <div className="w-20 h-6 bg-gray-200 rounded animate-pulse" />
            </div>

            {/* Info Button Skeleton */}
            <div className="p-4 border-t border-gray-100">
                <div className="w-full h-10 bg-gray-200 rounded animate-pulse" />
            </div>
        </motion.div>
    );
};

export default InfoTutorCardSkeleton;
