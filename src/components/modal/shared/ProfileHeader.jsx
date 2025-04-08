import React from 'react';
import { FaGraduationCap, FaStar, FaMoneyBillWave } from 'react-icons/fa';
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
        <div className={`px-6 py-4 flex items-center gap-5 bg-gradient-to-r from-purple-50 to-indigo-50 ${className}`}>
            <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden">
                {profile?.avatar ? (
                    <LazyLoadImage
                        src={profile.avatar}
                        alt={`${profile.first_name} ${profile.last_name}`}
                        effect="blur"
                        className="object-cover w-full h-full"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full bg-gray-100 text-gray-400">
                        <FaGraduationCap className="text-3xl" />
                    </div>
                )}
            </div>
            <div className="space-y-1.5">
                <h2 className="text-2xl font-bold text-gray-900">
                    {profile?.first_name} {profile?.last_name}
                </h2>
                <div className="flex items-center gap-2">
                    <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                            <FaStar
                                key={i}
                                className={`w-4 h-4 ${
                                    i < fullStars
                                        ? 'text-amber-400'
                                        : i === fullStars && halfStar
                                            ? 'text-amber-400/50'
                                            : 'text-gray-300'
                                }`}
                            />
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
                    <p className="text-sm font-medium text-green-600 flex items-center">
                        <FaMoneyBillWave className="mr-1" />
                        {formatUtils.formatPrice(profile.price)} / godzina
                    </p>
                )}
            </div>
        </div>
    );
};

export default ProfileHeader;