import { useState } from 'react';
import { Star, GraduationCap, Users, ChevronDown, ChevronUp, Calendar, MessageSquare } from 'lucide-react';

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
                    <Star key={`full-${i}`} className="h-4 w-4 text-black fill-current" />
                ))}

                {/* Half star - using Lucide Star with custom styling */}
                {hasHalfStar && (
                    <div className="relative">
                        <Star className="h-4 w-4 text-gray-300 fill-current" />
                        <div className="absolute top-0 left-0 w-1/2 overflow-hidden">
                            <Star className="h-4 w-4 text-black fill-current" />
                        </div>
                    </div>
                )}

                {/* Empty stars */}
                {[...Array(emptyStars)].map((_, i) => (
                    <Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />
                ))}

                <span className="ml-1.5 text-sm font-medium text-gray-700">{rating.toFixed(1)}</span>
                <span className="ml-1 text-xs text-gray-500">({reviewCount})</span>
            </div>
        );
    };

    return (
        <div className="bg-white shadow-sm border border-gray-100 rounded-xl overflow-hidden hover:bg-gray-50 transition-colors duration-200">
            <div className="flex flex-col md:flex-row">
                {/* Left column - Avatar - full height with small padding */}
                <div className="md:w-32 p-0 flex-shrink-0 relative overflow-hidden">
                    <div className="h-full w-full md:h-auto md:pb-[100%] md:relative">
                        <div className="h-32 w-32 md:h-full md:w-full md:absolute p-2 rounded-2xl overflow-hidden">
                            <img
                                src={tutor.avatar || '/images/default-avatar.png'}
                                alt={`${tutor.first_name} ${tutor.last_name}`}
                                className="h-32 w-32 md:h-full md:w-full md:absolute object-cover p-2 rounded-2xl"
                                onError={(e) => {
                                    e.target.src = '/images/default-avatar.png';
                                }}
                            />
                        </div>
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
                            <GraduationCap className="h-4 w-4 text-black" />
                            <span>{displaySubjects.join(', ')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-black" />
                            <span>{activeStudents} aktywnych uczniów • {totalLessons} lekcji</span>
                        </div>
                    </div>

                    {/* Poziomy nauczania */}
                    <div className="flex flex-wrap gap-2 mb-3">
                        {levels.map((level, idx) => (
                            <span key={idx} className="px-2.5 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-medium">
                                {level}
                            </span>
                        ))}
                    </div>

                    <button
                        onClick={toggleExpand}
                        className="flex items-center text-black hover:text-gray-700 text-sm font-medium"
                    >
                        {expanded ? (
                            <>Mniej <ChevronUp className="ml-1 h-3.5 w-3.5" /></>
                        ) : (
                            <>Więcej <ChevronDown className="ml-1 h-3.5 w-3.5" /></>
                        )}
                    </button>

                    {/* Expanded content */}
                    {expanded && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
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
                <div className="md:w-48 p-4 md:border-l border-gray-100 flex flex-col items-center md:items-end justify-between">
                    <div className="text-center md:text-right mb-4">
                        <p className="text-gray-600 text-xs mb-0.5">Cena za godzinę</p>
                        <p className="text-xl font-bold text-gray-900">{price} PLN</p>
                    </div>

                    <div className="w-full space-y-2">
                        <button
                            onClick={() => onInfoClick?.(tutor)}
                            className="w-full px-4 py-2 bg-black hover:bg-gray-800 text-white text-sm font-medium rounded-full shadow-sm transition-colors flex justify-center items-center gap-2"
                        >
                            <Calendar className="h-4 w-4" />
                            <span>Zaplanuj lekcję</span>
                        </button>
                        <button
                            className="w-full px-4 py-2 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-full shadow-sm transition-colors flex justify-center items-center gap-2"
                        >
                            <MessageSquare className="h-4 w-4" />
                            <span>Wyślij wiadomość</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InfoTutorCard;