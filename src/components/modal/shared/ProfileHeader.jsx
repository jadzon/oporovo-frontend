import React from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { formatUtils } from '../utils';
import { Icon } from './Icon';
import 'react-lazy-load-image-component/src/effects/blur.css';

export const ProfileHeader = ({
                                  profile,
                                  rating = 0,
                                  showPrice = false,
                                  className = ""
                              }) => {
    const ratingValue = rating || 4.5;
    const fullStars = Math.floor(ratingValue);
    const halfStar = ratingValue - fullStars >= 0.5;

    return (
        <div className={`px-4 py-3 flex items-center gap-3 bg-white border-b border-gray-100 ${className}`}>
            <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                {profile?.avatar ? (
                    <LazyLoadImage
                        src={profile.avatar}
                        alt={`${profile.first_name} ${profile.last_name}`}
                        effect="blur"
                        className="object-cover w-full h-full"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full bg-gray-100 text-gray-400">
                        <Icon name="user" className="h-6 w-6" />
                    </div>
                )}
            </div>
            <div className="space-y-1">
                <h2 className="text-base font-medium text-gray-900">
                    {profile?.first_name} {profile?.last_name}
                </h2>
                <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                        <span key={i} className="inline-block">
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-3.5 w-3.5 ${
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
                    <span className="text-xs text-gray-600 ml-1">
            ({ratingValue.toFixed(1)})
          </span>
                </div>
                {profile?.username && (
                    <p className="text-xs text-gray-500">
                        @{profile.username}
                    </p>
                )}
            </div>
            {showPrice && profile?.price && (
                <div className="ml-auto bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full text-xs font-medium flex items-center">
                    <Icon name="money" className="h-3.5 w-3.5 mr-1" />
                    {formatUtils.formatPrice(profile.price)} / godz.
                </div>
            )}
        </div>
    );
};