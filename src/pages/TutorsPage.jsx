import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaStar, FaSearch, FaFilter, FaGraduationCap, FaCalendarAlt, FaMapMarkerAlt, FaTag } from 'react-icons/fa';

const TutorsPage = () => {
    const [tutors, setTutors] = useState([]);
    const [filteredTutors, setFilteredTutors] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [selectedSubjects, setSelectedSubjects] = useState([]);
    const [selectedLevels, setSelectedLevels] = useState([]);
    const [priceRange, setPriceRange] = useState([50, 200]);
    const [showFilters, setShowFilters] = useState(false);

    const subjects = ['Matematyka', 'Fizyka', 'Chemia', 'Biologia', 'Język Polski', 'Język Angielski', 'Historia', 'Geografia', 'Informatyka'];
    const levels = ['Szkoła Podstawowa', 'Liceum', 'Studia', 'Matura'];

    useEffect(() => {
        // In a real app, this would be an API call
        const fetchTutors = async () => {
            setIsLoading(true);
            try {
                // Mocking API response
                const mockTutors = [
                    {
                        id: 1,
                        name: 'Anna Kowalska',
                        avatar: '/path/to/avatar1.jpg',
                        subjects: ['Matematyka', 'Fizyka'],
                        levels: ['Szkoła Podstawowa', 'Liceum'],
                        rating: 4.9,
                        reviewCount: 124,
                        pricePerHour: 80,
                        bio: 'Doświadczony nauczyciel z 8-letnim doświadczeniem. Specjalizuję się w matematyce i fizyce dla uczniów szkół podstawowych i liceów.',
                        location: 'Warszawa, Śródmieście',
                        education: 'Magister Matematyki, Uniwersytet Warszawski',
                        availability: 'Pon-Pt: 16:00-20:00, Weekendy: 10:00-16:00'
                    },
                    {
                        id: 2,
                        name: 'Piotr Nowak',
                        avatar: '/path/to/avatar2.jpg',
                        subjects: ['Chemia', 'Biologia'],
                        levels: ['Liceum', 'Matura', 'Studia'],
                        rating: 4.7,
                        reviewCount: 89,
                        pricePerHour: 100,
                        bio: 'Doktor nauk chemicznych z pasją do nauczania. Pomagam uczniom zrozumieć trudne koncepcje chemiczne i biologiczne w prosty sposób.',
                        location: 'Kraków, Kazimierz',
                        education: 'Doktor Nauk Chemicznych, Uniwersytet Jagielloński',
                        availability: 'Wt, Czw: 15:00-19:00, Sob: 9:00-15:00'
                    },
                    {
                        id: 3,
                        name: 'Maja Wiśniewska',
                        avatar: '/path/to/avatar3.jpg',
                        subjects: ['Język Polski', 'Historia'],
                        levels: ['Szkoła Podstawowa', 'Liceum', 'Matura'],
                        rating: 4.8,
                        reviewCount: 156,
                        pricePerHour: 90,
                        bio: 'Polonistka z powołania. Uczę jak pisać, czytać ze zrozumieniem i analizować teksty literackie. Przygotowuję do egzaminów i pomagam pokochać literaturę.',
                        location: 'Poznań, Jeżyce',
                        education: 'Magister Filologii Polskiej, UAM',
                        availability: 'Pon-Pt: 14:00-18:00, Ndz: 10:00-14:00'
                    },
                    {
                        id: 4,
                        name: 'Tomasz Kowalczyk',
                        avatar: '/path/to/avatar4.jpg',
                        subjects: ['Informatyka', 'Matematyka'],
                        levels: ['Liceum', 'Studia'],
                        rating: 4.6,
                        reviewCount: 78,
                        pricePerHour: 120,
                        bio: 'Programista i pasjonat matematyki. Uczę programowania w różnych językach oraz matematyki dyskretnej i analizy matematycznej.',
                        location: 'Wrocław, Centrum',
                        education: 'Magister Informatyki, Politechnika Wrocławska',
                        availability: 'Pon, Śr, Pt: 17:00-21:00, Sob: 12:00-18:00'
                    },
                    {
                        id: 5,
                        name: 'Karolina Lewandowska',
                        avatar: '/path/to/avatar5.jpg',
                        subjects: ['Język Angielski', 'Język Polski'],
                        levels: ['Szkoła Podstawowa', 'Liceum', 'Studia'],
                        rating: 5.0,
                        reviewCount: 203,
                        pricePerHour: 110,
                        bio: 'Nauczycielka języków z certyfikatem TEFL. Mieszkałam 5 lat w Londynie, gdzie uczyłam w szkole językowej. Indywidualne podejście do każdego ucznia.',
                        location: 'Gdańsk, Wrzeszcz',
                        education: 'Magister Filologii Angielskiej, Uniwersytet Gdański',
                        availability: 'Pon-Czw: 15:00-20:00, Pt: 15:00-18:00'
                    },
                    {
                        id: 6,
                        name: 'Aleksander Dąbrowski',
                        avatar: '/path/to/avatar6.jpg',
                        subjects: ['Fizyka', 'Geografia'],
                        levels: ['Liceum', 'Matura'],
                        rating: 4.5,
                        reviewCount: 67,
                        pricePerHour: 85,
                        bio: 'Pasjonat nauk ścisłych i przyrodniczych. Tłumaczę skomplikowane zagadnienia w przystępny sposób, wykorzystując praktyczne przykłady.',
                        location: 'Łódź, Śródmieście',
                        education: 'Magister Fizyki, Uniwersytet Łódzki',
                        availability: 'Wt, Czw: 16:00-20:00, Sob: 10:00-15:00'
                    },
                    {
                        id: 7,
                        name: 'Natalia Zielińska',
                        avatar: '/path/to/avatar7.jpg',
                        subjects: ['Chemia', 'Matematyka'],
                        levels: ['Szkoła Podstawowa', 'Liceum'],
                        rating: 4.8,
                        reviewCount: 112,
                        pricePerHour: 90,
                        bio: 'Nauczycielka chemii i matematyki z 10-letnim doświadczeniem. Cierpliwa i wyrozumiała, świetnie tłumaczę najtrudniejsze zagadnienia.',
                        location: 'Szczecin, Centrum',
                        education: 'Magister Chemii, Uniwersytet Szczeciński',
                        availability: 'Pon-Pt: 15:00-19:00, Sob: 9:00-13:00'
                    },
                    {
                        id: 8,
                        name: 'Kamil Szymański',
                        avatar: '/path/to/avatar8.jpg',
                        subjects: ['Historia', 'Geografia'],
                        levels: ['Matura', 'Liceum'],
                        rating: 4.9,
                        reviewCount: 95,
                        pricePerHour: 95,
                        bio: 'Historyk z pasją do nauczania. Specjalizuję się w przygotowaniach do matury, potrafię zainteresować nawet najtrudniejszymi tematami.',
                        location: 'Katowice, Ligota',
                        education: 'Doktor Nauk Historycznych, Uniwersytet Śląski',
                        availability: 'Pon, Śr, Pt: 16:00-20:00, Ndz: 10:00-14:00'
                    }
                ];

                setTutors(mockTutors);
                setFilteredTutors(mockTutors);
            } catch (error) {
                console.error('Error fetching tutors:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTutors();
    }, []);

    // Apply filters when any filter or search term changes
    useEffect(() => {
        const filtered = tutors.filter(tutor => {
            // Search term filter
            const matchesSearchTerm =
                searchTerm === '' ||
                tutor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                tutor.bio.toLowerCase().includes(searchTerm.toLowerCase()) ||
                tutor.subjects.some(subject => subject.toLowerCase().includes(searchTerm.toLowerCase()));

            // Subject filter
            const matchesSubject =
                selectedSubjects.length === 0 ||
                selectedSubjects.some(subject => tutor.subjects.includes(subject));

            // Level filter
            const matchesLevel =
                selectedLevels.length === 0 ||
                selectedLevels.some(level => tutor.levels.includes(level));

            // Price range filter
            const matchesPrice =
                tutor.pricePerHour >= priceRange[0] &&
                tutor.pricePerHour <= priceRange[1];

            return matchesSearchTerm && matchesSubject && matchesLevel && matchesPrice;
        });

        setFilteredTutors(filtered);
    }, [searchTerm, selectedSubjects, selectedLevels, priceRange, tutors]);

    const handleSubjectChange = (subject) => {
        setSelectedSubjects(prev =>
            prev.includes(subject)
                ? prev.filter(s => s !== subject)
                : [...prev, subject]
        );
    };

    const handleLevelChange = (level) => {
        setSelectedLevels(prev =>
            prev.includes(level)
                ? prev.filter(l => l !== level)
                : [...prev, level]
        );
    };

    const handlePriceChange = (e, index) => {
        const newValue = parseInt(e.target.value);
        setPriceRange(prev => {
            const newRange = [...prev];
            newRange[index] = newValue;
            return newRange;
        });
    };

    const clearFilters = () => {
        setSelectedSubjects([]);
        setSelectedLevels([]);
        setPriceRange([50, 200]);
        setSearchTerm('');
    };

    return (
        <div className="container-custom py-12">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Znajdź korepetytora</h1>

            {/* Search and Filter Bar */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    {/* Search Field */}
                    <div className="relative flex-grow w-full md:w-auto">
                        <input
                            type="text"
                            placeholder="Szukaj po nazwie, przedmiocie..."
                            className="w-full md:w-96 pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-vibely-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <FaSearch className="absolute left-3 top-3 text-gray-400" />
                    </div>

                    {/* Filter Toggle Button */}
                    <button
                        className="inline-flex items-center px-4 py-2 bg-vibely-600 text-white rounded-md hover:bg-vibely-700 transition-colors"
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        <FaFilter className="mr-2" />
                        Filtry {showFilters ? '(Ukryj)' : '(Pokaż)'}
                    </button>
                </div>

                {/* Expanded Filters */}
                {showFilters && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Subject Filters */}
                            <div>
                                <h3 className="font-medium text-gray-700 mb-2">Przedmioty</h3>
                                <div className="flex flex-wrap gap-2">
                                    {subjects.map(subject => (
                                        <button
                                            key={subject}
                                            className={`px-3 py-1 rounded-full text-sm ${
                                                selectedSubjects.includes(subject)
                                                    ? 'bg-vibely-600 text-white'
                                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                            } transition-colors`}
                                            onClick={() => handleSubjectChange(subject)}
                                        >
                                            {subject}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Level Filters */}
                            <div>
                                <h3 className="font-medium text-gray-700 mb-2">Poziom nauczania</h3>
                                <div className="flex flex-wrap gap-2">
                                    {levels.map(level => (
                                        <button
                                            key={level}
                                            className={`px-3 py-1 rounded-full text-sm ${
                                                selectedLevels.includes(level)
                                                    ? 'bg-vibely-600 text-white'
                                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                            } transition-colors`}
                                            onClick={() => handleLevelChange(level)}
                                        >
                                            {level}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Price Range Filter */}
                            <div>
                                <h3 className="font-medium text-gray-700 mb-2">
                                    Cena za godzinę: {priceRange[0]} - {priceRange[1]} zł
                                </h3>
                                <div className="flex items-center gap-4">
                                    <input
                                        type="range"
                                        min="50"
                                        max="200"
                                        step="5"
                                        value={priceRange[0]}
                                        onChange={(e) => handlePriceChange(e, 0)}
                                        className="w-full accent-vibely-600"
                                    />
                                    <span className="w-12 text-center">{priceRange[0]}zł</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <input
                                        type="range"
                                        min="50"
                                        max="200"
                                        step="5"
                                        value={priceRange[1]}
                                        onChange={(e) => handlePriceChange(e, 1)}
                                        className="w-full accent-vibely-600"
                                    />
                                    <span className="w-12 text-center">{priceRange[1]}zł</span>
                                </div>
                            </div>
                        </div>

                        {/* Clear Filters Button */}
                        <div className="mt-4 flex justify-end">
                            <button
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                                onClick={clearFilters}
                            >
                                Wyczyść filtry
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Results Count */}
            <div className="mb-6">
                <p className="text-gray-600">
                    {filteredTutors.length === 0
                        ? 'Nie znaleziono korepetytorów spełniających kryteria.'
                        : `Znaleziono ${filteredTutors.length} ${
                            filteredTutors.length === 1 ? 'korepetytora' :
                                filteredTutors.length < 5 ? 'korepetytorów' : 'korepetytorów'
                        }`}
                </p>
            </div>

            {/* Tutors Grid */}
            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-vibely-600"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTutors.map(tutor => (
                        <motion.div
                            key={tutor.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                        >
                            {/* Tutor Card Header */}
                            <div className="bg-vibely-100 p-6">
                                <div className="flex items-center">
                                    <div className="w-16 h-16 rounded-full bg-vibely-600 flex items-center justify-center text-white mr-4 overflow-hidden">
                                        {tutor.avatar ? (
                                            <img
                                                src="https://randomuser.me/api/portraits/men/32.jpg" // Placeholder since real paths wouldn't work
                                                alt={tutor.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            tutor.name.split(' ').map(n => n[0]).join('')
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-800">{tutor.name}</h3>
                                        <div className="flex items-center text-yellow-500 mt-1">
                                            <FaStar />
                                            <span className="ml-1 text-gray-700">{tutor.rating.toFixed(1)}</span>
                                            <span className="ml-1 text-gray-500">({tutor.reviewCount} opinii)</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Tutor Card Body */}
                            <div className="p-6">
                                <p className="text-gray-600 mb-4 line-clamp-3">{tutor.bio}</p>

                                {/* Subjects */}
                                <div className="flex items-start mb-3">
                                    <FaGraduationCap className="text-vibely-600 mt-1 mr-2" />
                                    <div>
                                        <p className="font-medium text-gray-700">Przedmioty:</p>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {tutor.subjects.map(subject => (
                                                <span key={subject} className="px-2 py-1 bg-vibely-100 text-vibely-700 text-xs rounded-full">
                                                    {subject}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Levels */}
                                <div className="flex items-start mb-3">
                                    <FaTag className="text-vibely-600 mt-1 mr-2" />
                                    <div>
                                        <p className="font-medium text-gray-700">Poziom nauczania:</p>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {tutor.levels.map(level => (
                                                <span key={level} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                                                    {level}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Location */}
                                <div className="flex items-start mb-3">
                                    <FaMapMarkerAlt className="text-vibely-600 mt-1 mr-2" />
                                    <div>
                                        <p className="font-medium text-gray-700">Lokalizacja:</p>
                                        <p className="text-gray-600">{tutor.location}</p>
                                    </div>
                                </div>

                                {/* Availability */}
                                <div className="flex items-start mb-4">
                                    <FaCalendarAlt className="text-vibely-600 mt-1 mr-2" />
                                    <div>
                                        <p className="font-medium text-gray-700">Dostępność:</p>
                                        <p className="text-gray-600">{tutor.availability}</p>
                                    </div>
                                </div>

                                {/* Price and Action Button */}
                                <div className="flex items-center justify-between mt-6">
                                    <div className="text-xl font-bold text-vibely-700">
                                        {tutor.pricePerHour} zł<span className="text-sm font-normal text-gray-500">/godz.</span>
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="px-4 py-2 bg-vibely-600 text-white rounded-md hover:bg-vibely-700 transition-colors"
                                    >
                                        Umów lekcję
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* No Results Message */}
            {!isLoading && filteredTutors.length === 0 && (
                <div className="text-center py-12">
                    <div className="text-5xl mb-4">😕</div>
                    <h3 className="text-xl font-medium text-gray-700 mb-2">Nie znaleziono korepetytorów</h3>
                    <p className="text-gray-600">Spróbuj zmienić kryteria wyszukiwania.</p>
                </div>
            )}
        </div>
    );
};

export default TutorsPage;