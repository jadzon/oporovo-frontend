import { motion } from 'framer-motion';
import 'react-lazy-load-image-component/src/effects/blur.css';

const InfoTutorCardSkeleton = () => {
    return (
        <motion.div
            className="bg-white shadow-sm border border-gray-100 rounded-xl overflow-hidden"
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            <div className="flex flex-col md:flex-row">
                {/* Left column - Avatar skeleton - full height with small padding */}
                <div className="md:w-32 p-0 flex-shrink-0 relative overflow-hidden">
                    <div className="h-full w-full md:h-auto md:pb-[100%] md:relative">
                        <div className="h-32 w-32 md:h-full md:w-full md:absolute bg-gray-200 animate-pulse p-2"></div>
                    </div>
                </div>

                {/* Middle section - Basic Info skeleton */}
                <div className="flex-grow p-4">
                    <div className="flex flex-wrap justify-between items-start mb-4">
                        <div className="space-y-2">
                            {/* Name Skeleton */}
                            <div className="w-40 h-6 bg-gray-200 rounded animate-pulse" />
                            {/* Title Skeleton */}
                            <div className="w-48 h-4 bg-gray-200 rounded animate-pulse" />
                        </div>
                        <div>
                            {/* Rating Skeleton */}
                            <div className="flex space-x-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <div key={i} className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
                                ))}
                                <div className="w-8 h-4 ml-1.5 bg-gray-200 rounded animate-pulse" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3 mb-4">
                        {/* Subjects Skeleton */}
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
                            <div className="w-32 h-4 bg-gray-200 rounded animate-pulse" />
                        </div>
                        {/* Students Skeleton */}
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
                            <div className="w-40 h-4 bg-gray-200 rounded animate-pulse" />
                        </div>
                    </div>

                    {/* Levels Skeleton */}
                    <div className="flex flex-wrap gap-2 mb-3">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="w-24 h-6 bg-gray-200 rounded-full animate-pulse" />
                        ))}
                    </div>

                    {/* More button Skeleton */}
                    <div className="w-16 h-5 bg-gray-200 rounded animate-pulse" />
                </div>

                {/* Right section - Price and buttons skeleton */}
                <div className="md:w-48 p-4 md:border-l border-gray-100 flex flex-col items-center md:items-end justify-between">
                    <div className="text-center md:text-right mb-4 w-full">
                        <div className="w-full flex flex-col items-center md:items-end">
                            <div className="w-20 h-3 bg-gray-200 rounded animate-pulse mb-1" />
                            <div className="w-16 h-6 bg-gray-200 rounded animate-pulse" />
                        </div>
                    </div>

                    <div className="w-full space-y-2">
                        <div className="w-full h-10 bg-gray-200 rounded-full animate-pulse" />
                        <div className="w-full h-10 bg-gray-200 rounded-full animate-pulse" />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default InfoTutorCardSkeleton;