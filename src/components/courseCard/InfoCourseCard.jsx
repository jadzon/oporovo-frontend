import { useState } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { FaGraduationCap, FaBook, FaUsers } from 'react-icons/fa';
import 'react-lazy-load-image-component/src/effects/blur.css';

const InfoCourseCard = ({ course, onInfoClick }) => {
    const [avatarLoaded, setAvatarLoaded] = useState(false);

    // Tutor information with proper fallback.
    const tutorAvatar = course.tutor?.avatar || '/images/default-avatar.png';
    const tutorFullName =
        course.tutor?.first_name && course.tutor?.last_name
            ? `${course.tutor.first_name} ${course.tutor.last_name}`
            : course.tutor?.username || 'Nieznany';
    const tutorUsername = course.tutor?.username || 'nieznany';

    // Calculate lessons count or set a fallback value
    const lessonsCount = course.lessons?.length || 8;
    const studentsCount = course.students?.length || 24;

    return (
        <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden hover:bg-gray-50 transition-colors duration-200">
            <div className="flex flex-col md:flex-row">
                {/* Left column - Square Banner */}
                <div className="md:w-44 flex-shrink-0">
                    <div className="aspect-square w-full relative">
                        {course.banner ? (
                            <LazyLoadImage
                                src={course.banner}
                                alt={course.name || "Kurs"}
                                effect="blur"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                <FaBook className="text-gray-300 text-4xl" />
                            </div>
                        )}
                    </div>
                </div>

                {/* Middle section - Course Info with Author at bottom */}
                <div className="flex-grow p-4 flex flex-col">
                    <div className="flex-grow">
                        <div className="flex flex-wrap justify-between items-start mb-2">
                            <h3 className="text-xl font-medium text-gray-900">{course.name || "Tytuł kursu"}</h3>
                        </div>

                        {/* Subject and Level badges */}
                        <div className="flex flex-wrap gap-2 mb-3">
                            {course.subject && (
                                <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                                    {course.subject}
                                </span>
                            )}
                            {course.level && (
                                <span className="px-2 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-medium">
                                    {course.level}
                                </span>
                            )}
                        </div>

                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{course.description || "Opis kursu"}</p>

                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                            <div className="flex items-center">
                                <FaGraduationCap className="text-blue-900 mr-2" />
                                <span>{lessonsCount} lekcji</span>
                            </div>

                            <div className="flex items-center">
                                <FaUsers className="text-blue-900 mr-2" />
                                <span>{studentsCount} uczniów</span>
                            </div>
                        </div>
                    </div>

                    {/* Author section - at the bottom of middle column */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex items-center">
                            <div className="w-8 h-8 mr-2 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200 shadow-sm">
                                <img
                                    src={tutorAvatar}
                                    alt={tutorUsername}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.src = '/images/default-avatar.png';
                                    }}
                                />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-gray-900">{tutorFullName}</p>
                                <p className="text-xs text-gray-600">@{tutorUsername}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right section - Price and actions */}
                <div className="md:w-48 p-4 md:border-l border-gray-200 flex md:flex-col justify-between items-center md:items-end">
                    {/* Price */}
                    <div className="text-center md:text-right mb-0 md:mb-6">
                        <p className="text-gray-600 text-sm">Cena</p>
                        <p className="text-2xl font-bold text-gray-900">
                            {course.price ? `${course.price} zł` : 'Brak ceny'}
                        </p>
                    </div>

                    {/* Action Button */}
                    <button
                        onClick={() => onInfoClick?.(course)}
                        className="min-w-24 px-4 py-2.5 bg-blue-900 hover:bg-blue-800 text-white text-sm font-medium rounded-md shadow-sm transition-colors"
                    >
                        Szczegóły
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InfoCourseCard;