import { useState } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { BookOpen, GraduationCap, Users } from 'lucide-react';
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
        <div className="bg-white shadow-sm border border-gray-100 rounded-xl overflow-hidden hover:bg-gray-50 transition-colors duration-200">
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
                                <BookOpen className="text-gray-300 h-12 w-12" />
                            </div>
                        )}
                    </div>
                </div>

                {/* Middle section - Course Info with Author at bottom */}
                <div className="flex-grow p-4 flex flex-col">
                    <div className="flex-grow">
                        <div className="flex flex-wrap justify-between items-start mb-2">
                            <h3 className="text-lg font-medium text-gray-900">{course.name || "Tytuł kursu"}</h3>
                        </div>

                        {/* Subject and Level badges */}
                        <div className="flex flex-wrap gap-2 mb-3">
                            {course.subject && (
                                <span className="px-2.5 py-1 bg-gray-50 text-gray-700 rounded-full text-xs font-medium">
                                    {course.subject}
                                </span>
                            )}
                            {course.level && (
                                <span className="px-2.5 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-medium">
                                    {course.level}
                                </span>
                            )}
                        </div>

                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{course.description || "Opis kursu"}</p>

                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                                <BookOpen className="h-4 w-4 text-black" />
                                <span>{lessonsCount} lekcji</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-black" />
                                <span>{studentsCount} uczniów</span>
                            </div>
                        </div>
                    </div>

                    {/* Author section - at the bottom of middle column */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center">
                            <div className="w-8 h-8 mr-2 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-100">
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
                                <div className="text-xs text-gray-500 mb-0.5">Nauczyciel:</div>
                                <p className="text-xs font-medium text-gray-900">{tutorFullName}</p>
                                <p className="text-xs text-gray-600">@{tutorUsername}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right section - Price and actions */}
                <div className="md:w-48 p-4 md:border-l border-gray-100 flex md:flex-col justify-between items-center md:items-end">
                    {/* Price */}
                    <div className="text-center md:text-right mb-0 md:mb-6">
                        <p className="text-gray-600 text-xs mb-0.5">Cena</p>
                        <p className="text-xl font-bold text-gray-900">
                            {course.price ? `${course.price} zł` : 'Brak ceny'}
                        </p>
                    </div>

                    {/* Action Button */}
                    <button
                        onClick={() => onInfoClick?.(course)}
                        className="px-4 py-2 bg-black hover:bg-gray-800 text-white text-sm font-medium rounded-full shadow-sm transition-colors flex items-center gap-2"
                    >
                        <GraduationCap className="h-4 w-4" />
                        <span>Szczegóły</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InfoCourseCard;