// src/components/ui/Skeleton.jsx
import React from 'react';

export const Skeleton = ({
                             className = '',
                             height = 'h-4',
                             width = 'w-full',
                             rounded = 'rounded',
                         }) => {
    return (
        <div className={`skeleton ${height} ${width} ${rounded} ${className}`} />
    );
};

// Normal Lesson/Tutor card skeleton
export const TutorCardSkeleton = () => {
    return (
        <div className="w-56 h-80 bg-white rounded-xl shadow-md overflow-hidden flex flex-col items-center p-4">
            <Skeleton width="w-24" height="h-24" rounded="rounded-full" />
            <div className="mt-4 w-3/4">
                <Skeleton height="h-4" />
            </div>
            <div className="mt-2 w-1/2">
                <Skeleton height="h-3" />
            </div>
            <div className="mt-3 w-1/2">
                <Skeleton height="h-3" />
            </div>
            <div className="mt-auto w-full">
                <Skeleton height="h-10" width="w-full" rounded="rounded-lg" />
            </div>
        </div>
    );
};

export const LessonCardSkeleton = TutorCardSkeleton;

/**
 * Skeleton for the bigger UpcomingLessonCard (horizontal).
 */
export const UpcomingLessonSkeleton = () => {
    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden w-full flex flex-col lg:flex-row">
            {/* LEFT image block */}
            <div className="w-full lg:w-1/3 h-48 lg:h-auto bg-gray-100 relative">
                <Skeleton height="h-full" width="w-full" />
            </div>
            {/* RIGHT content */}
            <div className="p-6 flex-1 flex flex-col justify-center">
                <Skeleton height="h-6" width="w-3/4" />
                <Skeleton className="mt-2" height="h-4" width="w-1/2" />
                <Skeleton className="mt-4" height="h-4" width="w-1/3" />
                <Skeleton className="mt-2" height="h-4" width="w-1/2" />
                <Skeleton className="mt-4" height="h-10" width="w-32" rounded="rounded-md" />
            </div>
        </div>
    );
};
