import React from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { formatUtils } from '../utils';

/**
 * Reusable profile header used in different modals
 */
const ProfileHeader = ({
                           profile,
                           rating = 0,
                           showPrice = false,
                           className = ""
                       }) => {
    const ratingValue = rating || 4.5;
    const fullStars = Math.floor(ratingValue);
    const halfStar = ratingValue - fullStars >= 0.5;

    return (
        <div className={`px-6 py-4 flex items-center gap-4 bg-white border-b border-gray-200 ${className}`}>
            <div className="w-16 h-16 rounded-full border-2 border-gray-100 overflow-hidden">
                {profile?.avatar ? (
                    <LazyLoadImage
                        src={profile.avatar}
                        alt={`${profile.first_name} ${profile.last_name}`}
                        effect="blur"
                        className="object-cover w-full h-full"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full bg-gray-100 text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                )}
            </div>
            <div className="space-y-1">
                <h2 className="text-lg font-semibold text-gray-800">
                    {profile?.first_name} {profile?.last_name}
                </h2>
                <div className="flex items-center gap-2">
                    <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                            <span key={i} className="inline-block">
                                <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${
                                    i < fullStars
                                        ? 'text-amber-400'
                                        : i === fullStars && halfStar
                                            ? 'text-amber-400/50'
                                            : 'text-gray-300'
                                }`} viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            </span>
                        ))}
                    </div>
                    <span className="text-sm font-medium text-gray-600">
                        ({ratingValue.toFixed(1)})
                    </span>
                </div>
                {profile?.username && (
                    <p className="text-sm text-gray-500">
                        @{profile.username}
                    </p>
                )}
                {showPrice && profile?.price && (
                    <p className="text-sm font-medium text-indigo-600 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {formatUtils.formatPrice(profile.price)} / godzina
                    </p>
                )}
            </div>
        </div>
    );
};

export default ProfileHeader;