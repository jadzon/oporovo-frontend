import React from 'react';

const MiniUserCard = ({ user, onClick }) => {
    // Destructure properties from the user object and apply fallbacks
    const avatar = user.avatar || "/images/default-avatar.png";
    const username = user.username || "uczeń";
    const firstName = user.first_name || username;

    return (
        <div
            className="flex items-center hover:bg-gray-100 rounded-lg p-1.5 cursor-pointer"
            onClick={onClick}
        >
            <div className="w-8 h-8 mr-2 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
                <img
                    src={avatar}
                    alt={username}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        e.target.src = "/images/default-avatar.png";
                    }}
                />
            </div>
            <div>
                <div className="text-xs font-medium text-gray-700">
                    {firstName}
                </div>
                <div className="text-xs text-gray-500">
                    @{username}
                </div>
            </div>
        </div>
    );
};

export default MiniUserCard;
