// src/components/lessonCard/UpcomingLessonCard.jsx
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useState } from 'react';
import 'react-lazy-load-image-component/src/effects/blur.css';

/**
 * A bigger, horizontal card for the top upcoming lesson.
 */
const UpcomingLessonCard = ({ lesson, onInfoClick }) => {
    const [imageLoaded, setImageLoaded] = useState(false);

    return (
        <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden w-full flex flex-col lg:flex-row">
            {/* LEFT: Larger image area */}
            <div className="relative w-full lg:w-1/3 h-48 lg:h-auto bg-gray-100 overflow-hidden flex justify-center items-center">
                {!imageLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="skeleton w-full h-full" />
                    </div>
                )}
                <LazyLoadImage
                    src={lesson.image}
                    alt={lesson.fullName}
                    effect="blur"
                    className="object-cover w-full h-full"
                    afterLoad={() => setImageLoaded(true)}
                />
            </div>

            {/* RIGHT: Text content */}
            <div className="p-6 flex-1 flex flex-col justify-center">
                <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mb-2">
                    {lesson.fullName}
                </h3>
                <p className="text-sm md:text-base text-gray-500">
                    Discord: {lesson.discordName}
                </p>

                {/* Subject / Subtopic */}
                <p className="mt-4 text-base md:text-lg text-gray-700 font-medium">
                    {lesson.mainSubject}
                </p>
                {lesson.subTopic && (
                    <p className="text-sm text-gray-600 italic mt-1">
                        {lesson.subTopic}
                    </p>
                )}

                {/* Date/Time */}
                {lesson.date && (
                    <p className="mt-3 text-sm md:text-base text-gray-600">
                        {lesson.date}
                    </p>
                )}

                {/* Info button */}
                <div className="mt-4">
                    <button
                        className="btn btn-outline"
                        onClick={() => onInfoClick?.(lesson)}
                    >
                        Info
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UpcomingLessonCard;
