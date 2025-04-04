import React from 'react';

// Reusable Skeleton component with a pulse animation.
export const Skeleton = ({
                             className = '',
                             height = 'h-4',
                             width = 'w-full',
                             rounded = 'rounded',
                         }) => {
    return (
        <div
            className={`${height} ${width} ${rounded} bg-gray-300 animate-pulse ${className}`}
        />
    );
};

/**
 * TutorCardSkeleton
 * Mimics the TutorCard:
 * - A circular tutor avatar at the top.
 * - Text lines for tutor name and username.
 * - A row simulating star ratings.
 * - Level badge placeholders.
 * - A full-width button at the bottom.
 */
export const TutorCardSkeleton = () => {
    return (
        <div className="w-64 bg-white rounded-xl shadow-lg overflow-hidden flex flex-col">
            {/* TOP: Tutor Avatar */}
            <div className="p-6 flex justify-center">
                <div className="w-28 h-28 rounded-full bg-gray-300 animate-pulse" />
            </div>
            {/* MIDDLE: Tutor Details */}
            <div className="flex-1 px-4 flex flex-col items-center text-center space-y-2">
                <Skeleton width="w-3/4" height="h-6" rounded="rounded" />
                <Skeleton width="w-1/2" height="h-4" rounded="rounded" />
                {/* Star Rating Placeholder */}
                <div className="flex space-x-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="w-5 h-5 bg-gray-300 rounded-full animate-pulse" />
                    ))}
                </div>
                {/* Level Badges Placeholder */}
                <div className="flex space-x-1">
                    {Array.from({ length: 2 }).map((_, i) => (
                        <Skeleton key={i} width="w-10" height="h-4" rounded="rounded-full" />
                    ))}
                </div>
            </div>
            {/* BOTTOM: Info Button */}
            <div className="p-4">
                <Skeleton height="h-10" width="w-full" rounded="rounded-md" />
            </div>
        </div>
    );
};

/**
 * LessonCardSkeleton
 * Mimics the LessonCard:
 * - A circular avatar at the top.
 * - Text placeholders for tutor name, username, lesson title, and date.
 * - A status indicator and an "Info" button at the bottom.
 */
export const LessonCardSkeleton = () => {
    return (
        <div className="w-64 h-96 bg-white rounded-xl shadow-lg overflow-hidden flex flex-col">
            {/* TOP: Tutor Avatar */}
            <div className="p-4 flex justify-center">
                <div className="w-24 h-24 rounded-full bg-gray-300 animate-pulse" />
            </div>
            {/* MIDDLE: Lesson Details */}
            <div className="flex-1 px-4 flex flex-col items-center text-center space-y-2">
                <Skeleton width="w-3/4" height="h-5" rounded="rounded" />
                <Skeleton width="w-1/2" height="h-4" rounded="rounded" />
                <Skeleton width="w-3/4" height="h-6" rounded="rounded" />
                <Skeleton width="w-1/2" height="h-4" rounded="rounded" />
            </div>
            {/* BOTTOM: Status Indicator and Info Button */}
            <div className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-gray-300 rounded-full animate-pulse" />
                    <Skeleton width="w-16" height="h-4" rounded="rounded" />
                </div>
                <Skeleton height="h-10" width="w-20" rounded="rounded-md" />
            </div>
        </div>
    );
};

/**
 * UpcomingLessonSkeleton
 * Mimics the UpcomingLessonCard:
 * - A left block with a circular tutor avatar.
 * - A right block with placeholders for:
 *   - Lesson title.
 *   - Tutor name/username.
 *   - Lesson description.
 *   - Date.
 *   - A status indicator.
 *   - An Info button.
 */
export const UpcomingLessonSkeleton = () => {
    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden w-full flex flex-col lg:flex-row">
            {/* LEFT: Tutor Avatar */}
            <div className="flex items-center justify-center p-6 lg:p-8">
                <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-full bg-gray-300 animate-pulse" />
            </div>
            {/* RIGHT: Lesson Details */}
            <div className="p-6 flex-1 flex flex-col justify-center space-y-2">
                <Skeleton width="w-3/4" height="h-8" rounded="rounded" />
                <Skeleton width="w-1/2" height="h-6" rounded="rounded" />
                <Skeleton width="w-full" height="h-4" rounded="rounded" />
                <Skeleton width="w-2/3" height="h-4" rounded="rounded" />
                {/* Status Indicator */}
                <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-gray-300 rounded-full animate-pulse" />
                    <Skeleton width="w-20" height="h-4" rounded="rounded" />
                </div>
                <Skeleton width="w-32" height="h-10" rounded="rounded-md" />
            </div>
        </div>
    );
};
