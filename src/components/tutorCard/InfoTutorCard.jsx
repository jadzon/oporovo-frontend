import { useState } from 'react';
import { FaStar, FaGraduationCap, FaUsers, FaChevronDown, FaChevronUp } from 'react-icons/fa';

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

    return (
        <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden hover:bg-gray-50 transition-colors duration-200">
            <div className="flex flex-col md:flex-row">
                {/* Left column - Avatar */}
                <div className="md:w-40 p-4 flex-shrink-0">
                    <div className="w-28 h-28 mx-auto md:mx-0 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
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
                    <div className="flex flex-wrap justify-between items-start mb-2">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">
                                {tutor.first_name} {tutor.last_name}
                            </h2>
                            <p className="text-sm text-gray-600">{experienceTitle}</p>
                        </div>
                        <div className="flex items-center">
                            <div className="flex items-center mr-2">
                                <FaStar className="text-blue-900 mr-1" />
                                <span className="font-bold text-gray-900">{rating.toFixed(1)}</span>
                            </div>
                            <span className="text-gray-600 text-sm">{reviewCount} opinii</span>
                        </div>
                    </div>

                    <div className="text-gray-600 text-sm mb-3">
                        <div className="flex items-center">
                            <FaGraduationCap className="text-blue-900 mr-2" />
                            <span>{displaySubjects.join(', ')}</span>
                        </div>
                        <div className="flex items-center mt-1">
                            <FaUsers className="text-blue-900 mr-2" />
                            <span>{activeStudents} aktywnych uczniów • {totalLessons} lekcji</span>
                        </div>
                    </div>

                    {/* Poziomy nauczania */}
                    <div className="flex flex-wrap gap-2 mb-3">
                        {levels.map((level, idx) => (
                            <span key={idx} className="px-2 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-medium">
                                {level}
                            </span>
                        ))}
                    </div>

                    <button
                        onClick={toggleExpand}
                        className="btn flex items-center text-blue-900 hover:text-blue-700 text-sm font-medium"
                    >
                        {expanded ? (
                            <>Mniej <FaChevronUp className="ml-1" /></>
                        ) : (
                            <>Więcej <FaChevronDown className="ml-1" /></>
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
                                    <h4 className="font-medium text-gray-900 mb-2">Edukacja</h4>
                                    <p className="text-sm text-gray-600">
                                        {tutor.education || "Brak informacji"}
                                    </p>
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-900 mb-2">Doświadczenie</h4>
                                    <ul className="text-sm text-gray-600 space-y-1">
                                        {tutor.experience ? tutor.experience.map((exp, idx) => (
                                            <li key={idx}>{exp}</li>
                                        )) : (
                                            <>
                                                <li>Brak informacji</li>
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
                        <p className="text-gray-600 text-sm">Cena za godzinę</p>
                        <p className="text-2xl font-bold text-gray-900">{price} PLN</p>
                    </div>

                    <div className="w-full space-y-3">
                        <button
                            onClick={() => onInfoClick?.(tutor)}
                            className="btn w-full px-4 py-2.5 bg-blue-900 hover:bg-blue-800 text-white text-sm font-medium rounded-md shadow-sm transition-colors"
                        >
                            Zaplanuj lekcję
                        </button>
                        <button
                            className="btn w-full px-4 py-2.5 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-md shadow-sm transition-colors"
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