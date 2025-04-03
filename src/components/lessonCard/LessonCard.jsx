// src/components/lessonCard/LessonCard.jsx
import { useState } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

const LessonCard = ({ lesson, onInfoClick }) => {
    // Lesson fields might include:
    // - lesson.image
    // - lesson.fullName
    // - lesson.discordName
    // - lesson.mainSubject (e.g. "Matematyka")
    // - lesson.subTopic (e.g. "Granice i rachunek")
    // - lesson.date
    // - lesson.time
    // etc.
    const [imageLoaded, setImageLoaded] = useState(false);

    return (
        <div className="w-64 h-96 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col">
            {/* TOP: circular avatar */}
            <div className="p-4 flex justify-center">
                <div className="w-24 h-24 rounded-full bg-gray-100 relative overflow-hidden">
                    {!imageLoaded && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="skeleton w-full h-full rounded-full" />
                        </div>
                    )}
                    <LazyLoadImage
                        src={lesson.image}
                        alt={lesson.fullName}
                        effect="blur"
                        className="w-full h-full object-cover"
                        afterLoad={() => setImageLoaded(true)}
                    />
                </div>
            </div>

            {/* MIDDLE: name, discord, subject, sub-topic, date/time */}
            <div className="flex-1 px-4 flex flex-col items-center text-center">
                <h3 className="text-base font-semibold text-gray-800">
                    {lesson.fullName}
                </h3>
                <p className="text-sm text-gray-500 mt-1">{lesson.discordName}</p>

                <p className="mt-2 text-sm text-gray-700">
                    {lesson.mainSubject || 'N/A'}
                </p>

                {/* If you have a more specific sub-topic or lesson detail */}
                {lesson.subTopic && (
                    <p className="mt-1 text-sm text-gray-600 italic">
                        {lesson.subTopic}
                    </p>
                )}

                {/* Date/time can be combined or separate */}
                {lesson.date && (
                    <p className="mt-2 text-sm text-gray-600">
                        {lesson.date}
                    </p>
                )}
            </div>

            {/* BOTTOM: "Info" button */}
            <div className="p-4">
                <button
                    className="w-full btn btn-primary"
                    onClick={() => onInfoClick?.(lesson)}
                >
                    Info
                </button>
            </div>
        </div>
    );
};

export default LessonCard;

