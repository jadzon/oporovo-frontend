import { useState } from 'react';
import { Icon } from '../modal/shared/Icon';

const InfoTutorCard = ({ tutor, onInfoClick }) => {
    const [expanded, setExpanded] = useState(false);

    // Format rating
    const rating = tutor.rating || 4.8;
    const reviewCount = tutor.reviewCount || 12;

    // Format subjects and levels for display
    const displaySubjects = tutor.subjects?.slice(0, 3) || ['Matematyka', 'Fizyka', 'Informatyka'];
    const hasMoreSubjects = tutor.subjects?.length > 3 || false;
    const levels = tutor.levels || ['Podstawówka', 'Liceum', 'Studia'];

    // Format other info
    const activeStudents = tutor.activeStudents || 14;
    const totalLessons = tutor.totalLessons || 1532;
    const price = tutor.price || 120;

    // Format experience title
    const experienceTitle = tutor.experienceTitle || 'Nauczyciel z 6-letnim doświadczeniem';

    const toggleExpand = () => {
        setExpanded(!expanded);
    };

    // Generate star rating display
    const renderStars = () => {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating - fullStars >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

        return (
            <div className="flex items-center">
                {/* Full stars */}
                {[...Array(fullStars)].map((_, i) => (
                    <svg key={`full-${i}`} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                ))}

                {/* Half star */}
                {hasHalfStar && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" fill="url(#halfStar)" />
                        <defs>
                            <linearGradient id="halfStar" x1="0" x2="100%" y1="0" y2="0">
                                <stop offset="50%" stopColor="currentColor" />
                                <stop offset="50%" stopColor="#E5E7EB" />
                            </linearGradient>
                        </defs>
                    </svg>
                )}

                {/* Empty stars */}
                {[...Array(emptyStars)].map((_, i) => (
                    <svg key={`empty-${i}`} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-300" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                ))}

                <span className="ml-1.5 text-sm font-medium text-gray-700">{rating.toFixed(1)}</span>
                <span className="ml-1 text-xs text-gray-500">({reviewCount})</span>
            </div>
        );
    };

    return (
        <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden hover:bg-gray-50 transition-colors duration-200">
            <div className="flex flex-col md:flex-row">
                {/* Left column - Avatar */}
                <div className="md:w-40 p-4 flex-shrink-0">
                    <div className="w-24 h-24 mx-auto md:mx-0 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                        <img
                            src={tutor.avatar || '/images/default-avatar.png'}
                            alt={`${tutor.first_name} ${tutor.last_name}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.target.src = '/images/default-avatar.png';
                            }}
                        />
                    </div>
                </div>

                {/* Middle section - Basic Info */}
                <div className="flex-grow p-4">
                    <div className="flex flex-wrap justify-between items-start mb-3">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">
                                {tutor.first_name} {tutor.last_name}
                            </h2>
                            <p className="text-sm text-gray-600 mt-0.5">{experienceTitle}</p>
                        </div>
                        <div>
                            {renderStars()}
                        </div>
                    </div>

                    <div className="space-y-2 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-2">
                            <Icon name="graduation" className="h-4 w-4 text-blue-600" />
                            <span>{displaySubjects.join(', ')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Icon name="users" className="h-4 w-4 text-blue-600" />
                            <span>{activeStudents} aktywnych uczniów • {totalLessons} lekcji</span>
                        </div>
                    </div>

                    {/* Poziomy nauczania */}
                    <div className="flex flex-wrap gap-2 mb-3">
                        {levels.map((level, idx) => (
                            <span key={idx} className="px-2.5 py-1 bg-amber-50 text-amber-600 rounded-full text-xs font-medium">
                                {level}
                            </span>
                        ))}
                    </div>

                    <button
                        onClick={toggleExpand}
                        className="flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                        {expanded ? (
                            <>Mniej <Icon name="back" className="ml-1 h-3.5 w-3.5 rotate-90" /></>
                        ) : (
                            <>Więcej <Icon name="back" className="ml-1 h-3.5 w-3.5 -rotate-90" /></>
                        )}
                    </button>

                    {/* Expanded content */}
                    {expanded && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <p className="text-gray-700 text-sm mb-4">
                                {tutor.description || "Doświadczony nauczyciel z pasją do przekazywania wiedzy. Specjalizuję się w indywidualnym podejściu do każdego ucznia. Pomogę Ci osiągnąć cele edukacyjne poprzez dostosowanie metod nauczania do Twoich potrzeb."}
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <h4 className="font-medium text-gray-900 text-sm mb-2">Edukacja</h4>
                                    <p className="text-sm text-gray-600">
                                        {tutor.education || "Uniwersytet Warszawski, Wydział Matematyki, Informatyki i Mechaniki (2015-2020)"}
                                    </p>
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-900 text-sm mb-2">Doświadczenie</h4>
                                    <ul className="text-sm text-gray-600 space-y-1">
                                        {tutor.experience ? tutor.experience.map((exp, idx) => (
                                            <li key={idx} className="flex items-baseline gap-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-1.5 flex-shrink-0"></span>
                                                <span>{exp}</span>
                                            </li>
                                        )) : (
                                            <>
                                                <li className="flex items-baseline gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-1.5 flex-shrink-0"></span>
                                                    <span>Korepetycje z matematyki (3 lata)</span>
                                                </li>
                                                <li className="flex items-baseline gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-1.5 flex-shrink-0"></span>
                                                    <span>Nauczyciel w szkole podstawowej (2 lata)</span>
                                                </li>
                                            </>
                                        )}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right section - Price and buttons */}
                <div className="md:w-48 p-4 md:border-l border-gray-200 flex flex-col items-center md:items-end justify-between">
                    <div className="text-center md:text-right mb-4">
                        <p className="text-gray-600 text-xs mb-0.5">Cena za godzinę</p>
                        <p className="text-xl font-bold text-gray-900">{price} PLN</p>
                    </div>

                    <div className="w-full space-y-2">
                        <button
                            onClick={() => onInfoClick?.(tutor)}
                            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors flex justify-center items-center gap-2"
                        >
                            <Icon name="calendar" className="h-4 w-4" />
                            <span>Zaplanuj lekcję</span>
                        </button>
                        <button
                            className="w-full px-4 py-2 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-lg shadow-sm transition-colors"
                        >
                            Wyślij wiadomość
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InfoTutorCard;