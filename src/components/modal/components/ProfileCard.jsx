import React from 'react';
import { Icon } from './Icon';
import ProfileHoverCard from '../../profileHoverCard/ProfileHoverCard';

const ProfileCard = ({
                         profile,
                         role = 'user', // 'tutor', 'student', 'user'
                         showHoverCard = true,
                         className = ''
                     }) => {
    if (!profile) return null;

    const {
        id,
        avatar,
        first_name,
        last_name,
        username,
        subjects = [],
        levels = []
    } = profile;

    // Get role icon
    const getRoleIcon = () => {
        switch(role) {
            case 'tutor':
                return <Icon name="graduation" className="h-3.5 w-3.5 text-gray-500" />;
            case 'student':
                return <Icon name="user" className="h-3.5 w-3.5 text-gray-500" />;
            default:
                return <Icon name="user" className="h-3.5 w-3.5 text-gray-500" />;
        }
    };

    // Content to display, wrapped in HoverCard if enabled
    const profileContent = (
        <div className={`flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors ${className}`}>
            <div className="w-12 h-12 mr-3 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
                {avatar ? (
                    <img
                        src={avatar}
                        alt={`${first_name || ''} ${last_name || ''}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.target.src = "/images/default-avatar.png";
                        }}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-600">
                        <Icon name="user" className="h-5 w-5" />
                    </div>
                )}
            </div>

            <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-800 truncate">
                    {first_name} {last_name}
                </div>

                <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                    {getRoleIcon()}
                    <span>@{username || 'user'}</span>
                </div>

                {(subjects.length > 0 || levels.length > 0) && (
                    <div className="mt-1 flex flex-wrap gap-1">
                        {subjects.slice(0, 1).map((subject, idx) => (
                            <span key={idx} className="text-xs px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded-full">
                                {subject}
                            </span>
                        ))}

                        {levels.slice(0, 1).map((level, idx) => (
                            <span key={idx} className="text-xs px-1.5 py-0.5 bg-amber-50 text-amber-600 rounded-full">
                                {level}
                            </span>
                        ))}

                        {(subjects.length + levels.length) > 2 && (
                            <span className="text-xs text-gray-500">
                                +{subjects.length + levels.length - 2} więcej
                            </span>
                        )}
                    </div>
                )}
            </div>
            {/* Buttons removed */}
        </div>
    );

    if (showHoverCard && id) {
        return (
            <ProfileHoverCard
                userId={id}
                userData={profile}
                placement="right"
            >
                {profileContent}
            </ProfileHoverCard>
        );
    }

    return profileContent;
};

export default ProfileCard;