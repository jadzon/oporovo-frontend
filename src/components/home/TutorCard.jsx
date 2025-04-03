// src/components/tutorCard/TutorCard.jsx
import { useState } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { FaStar } from 'react-icons/fa';

const TutorCard = ({ tutor, onInfoClick }) => {
    // tutor might have:
    // - tutor.image
    // - tutor.name
    // - tutor.discordName
    // - tutor.rating
    // - tutor.reviewsCount
    // - tutor.subjects
    // - tutor.shortBio
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
                        src={tutor.image}
                        alt={tutor.name}
                        effect="blur"
                        className="w-full h-full object-cover"
                        afterLoad={() => setImageLoaded(true)}
                    />
                </div>
            </div>

            {/* MIDDLE: name, discord, rating, subjects */}
            <div className="flex-1 px-4 flex flex-col items-center text-center">
                <h3 className="text-base font-semibold text-gray-800">
                    {tutor.name}
                </h3>

                {/* Discord name under name */}
                {tutor.discordName && (
                    <p className="text-sm text-gray-500 mt-1">
                        {tutor.discordName}
                    </p>
                )}

                {/* Rating stars */}
                <div className="mt-2 flex items-center justify-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <FaStar
                            key={i}
                            className={`w-4 h-4 ${
                                i < Math.round(tutor.rating)
                                    ? 'text-yellow-400'
                                    : 'text-gray-300'
                            }`}
                        />
                    ))}
                    {tutor.reviewsCount !== undefined && (
                        <span className="ml-1 text-sm text-gray-600">
              ({tutor.reviewsCount})
            </span>
                    )}
                </div>

                {/* Subjects */}
                {tutor.subjects?.length > 0 && (
                    <p className="mt-2 text-sm text-gray-700">
                        {tutor.subjects.join(', ')}
                    </p>
                )}
            </div>

            {/* BOTTOM: "Info" button */}
            <div className="p-4">
                <button
                    className="w-full btn btn-primary"
                    onClick={() => onInfoClick?.(tutor)}
                >
                    Info
                </button>
            </div>
        </div>
    );
};

export default TutorCard;
