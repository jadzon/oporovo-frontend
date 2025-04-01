import { useState } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { FaStar, FaDiscord } from 'react-icons/fa';

const TutorCard = ({ tutor, onClick }) => {
    const [imageLoaded, setImageLoaded] = useState(false);

    return (
        <div
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
            onClick={() => onClick(tutor)}
        >
            <div className="p-6">
                <div className="flex flex-col items-center">
                    <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 relative">
                        {!imageLoaded && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="skeleton w-full h-full rounded-full"></div>
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

                    <h3 className="mt-4 text-xl font-semibold text-gray-800">{tutor.name}</h3>

                    <div className="flex items-center mt-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <FaStar
                                key={i}
                                className={`${
                                    i < tutor.rating ? 'text-yellow-400' : 'text-gray-300'
                                } w-4 h-4`}
                            />
                        ))}
                        <span className="ml-1 text-sm text-gray-600">({tutor.reviewsCount})</span>
                    </div>

                    <p className="mt-3 text-sm text-gray-600">{tutor.subjects.join(', ')}</p>

                    <p className="mt-4 text-sm text-center text-gray-700 line-clamp-3">
                        {tutor.shortBio}
                    </p>

                    <button className="mt-6 w-full btn btn-primary">
                        Zobacz profil
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TutorCard;