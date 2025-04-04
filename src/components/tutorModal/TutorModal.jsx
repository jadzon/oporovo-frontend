import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaStar, FaArrowLeft } from 'react-icons/fa';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

// Polish locale for DayPicker
import { pl } from 'date-fns/locale';

const TutorModal = ({ tutor, onClose }) => {
    // Steps: 1 = Detailed Profile, 2 = Calendar, 3 = Booking Form
    const [step, setStep] = useState(1);

    // Booking states
    const [selectedDay, setSelectedDay] = useState(null);
    const [selectedTimeBlocks, setSelectedTimeBlocks] = useState([]);
    const [lessonTopic, setLessonTopic] = useState('');
    const [lessonLevel, setLessonLevel] = useState('');
    const [lessonSubject, setLessonSubject] = useState('');
    const [lessonDescription, setLessonDescription] = useState('');

    // If no tutor, do nothing
    if (!tutor) return null;

    // Basic rating logic
    const ratingValue = tutor.rating ?? 4.8;
    const fullStars = Math.floor(ratingValue);
    const halfStar = ratingValue - fullStars >= 0.5;
    const totalStars = 5;

    // Some mock data – replace as needed
    const mockEducation = [
        { school: 'Uniwersytet ABC', degree: 'Magister Informatyki', year: '2019' },
        { school: 'Liceum XYZ', degree: 'Profil mat-fiz', year: '2015' },
    ];
    const mockExperience = [
        'Korepetycje online z algorytmiki (2 lata)',
        'Prowadzenie szkoleń z JS (3 lata)',
    ];
    const mockApproach =
        'Stawiam na praktyczne przykłady i systematyczne ćwiczenia – wierzę, że kluczem do nauki jest zrozumienie fundamentów.';
    const mockLanguages = ['Polski (Natywny)', 'Angielski (C1)'];
    const mockLevels = tutor.levels?.length
        ? tutor.levels
        : ['Podstawówka', 'Liceum', 'Studia'];
    const mockSubjects = ['Matematyka', 'Fizyka', 'Informatyka'];
    // Example 45-min blocks
    const timeBlocks = [
        '08:00',
        '08:45',
        '09:30',
        '10:15',
        '11:00',
        '11:45',
        '13:00',
        '13:45',
        '14:30',
        '15:15',
        '16:00',
        '16:45',
        '17:30',
        '18:15',
        '19:00',
    ];

    // Toggle time block
    const toggleBlock = (block) => {
        setSelectedTimeBlocks((prev) =>
            prev.includes(block)
                ? prev.filter((b) => b !== block)
                : [...prev, block]
        );
    };

    // Step transitions
    const handleGoCalendar = () => setStep(2);
    const handleBack = () => setStep((prev) => prev - 1);
    const handleGoForm = () => {
        if (selectedDay && selectedTimeBlocks.length > 0) {
            setStep(3);
        }
    };

    const handleConfirmBooking = () => {
        alert(`
Zarezerwowano lekcję z: ${tutor.first_name || 'Jan'} ${tutor.last_name || 'Kowalski'}
Data: ${selectedDay?.toLocaleDateString('pl-PL')}
Bloki: ${selectedTimeBlocks.join(', ')}
Temat: ${lessonTopic}
Poziom: ${lessonLevel}
Przedmiot: ${lessonSubject}
Dodatkowe informacje: ${lessonDescription}
    `);
        closeAll();
    };

    // Close & reset
    const closeAll = () => {
        setStep(1);
        setSelectedDay(null);
        setSelectedTimeBlocks([]);
        setLessonTopic('');
        setLessonLevel('');
        setLessonSubject('');
        setLessonDescription('');
        onClose();
    };

    return (
        <AnimatePresence>
            {tutor && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
                    initial={{ opacity: 0,backgroundColor: "rgba(0, 0, 0, 0)" }}
                    animate={{ opacity: 1 ,backgroundColor: "rgba(0, 0, 0, 0.8)"}}
                    exit={{ opacity: 0,backgroundColor: "rgba(0, 0, 0, 0)" } }
                    onClick={closeAll}
                >
                    <motion.div
                        layoutId={`tutor-${tutor.id}`}
                        className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[90vh] overflow-hidden flex flex-col"
                        initial={{ scale: 0.9, y: 50 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 50 }}
                        transition={{ duration: 0.3 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* HEADER BAR */}
                        <div className="flex items-center justify-between px-4 py-3 border-b">
                            {step > 1 ? (
                                <button
                                    onClick={handleBack}
                                    className="text-gray-600 hover:text-gray-800 text-lg flex items-center space-x-2"
                                >
                                    <FaArrowLeft />
                                    <span className="text-sm">Wróć</span>
                                </button>
                            ) : (
                                <div />
                            )}
                            <button
                                onClick={closeAll}
                                className="text-gray-400 hover:text-gray-600 text-2xl font-semibold"
                            >
                                &times;
                            </button>
                        </div>

                        {/* PINNED SECTION: Photo on the LEFT, name on the RIGHT */}
                        <div className="border-b px-4 py-3 flex items-center space-x-4 bg-gray-50">
                            {/* Perfect circle avatar on left */}
                            <div className="w-20 h-20 rounded-full bg-gray-100 overflow-hidden flex-shrink-0">
                                {tutor.avatar ? (
                                    <img
                                        src={tutor.avatar}
                                        alt={`${tutor.first_name} ${tutor.last_name}`}
                                        className="object-cover w-full h-full"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center text-gray-300 h-full">
                                        Brak zdjęcia
                                    </div>
                                )}
                            </div>
                            {/* Name, username, rating on the right */}
                            <div className="flex flex-col">
                                <h2 className="text-xl font-bold text-gray-800">
                                    {tutor.first_name} {tutor.last_name}
                                </h2>
                                <p className="text-sm text-gray-500">{tutor.username || '@nickname'}</p>
                                <div className="mt-1 flex items-center">
                                    {Array.from({ length: fullStars }).map((_, i) => (
                                        <FaStar key={`full-${i}`} className="text-yellow-400 w-4 h-4" />
                                    ))}
                                    {halfStar && (
                                        <FaStar key="half" className="text-yellow-400 w-4 h-4 opacity-50" />
                                    )}
                                    {Array.from({
                                        length: totalStars - fullStars - (halfStar ? 1 : 0),
                                    }).map((_, i) => (
                                        <FaStar key={`empty-${i}`} className="text-gray-300 w-4 h-4" />
                                    ))}
                                    <span className="ml-2 text-sm text-gray-600">
                    ({ratingValue.toFixed(1)})
                  </span>
                                </div>
                            </div>
                        </div>

                        {/* SCROLLABLE CONTENT BELOW */}
                        <div className="flex-1 overflow-auto p-6 space-y-6">
                            {/* STEP 1: Detailed Profile */}
                            {step === 1 && (
                                <div className="space-y-6">
                                    {/* INTRO TEXT */}
                                    <div className="text-sm text-gray-700 leading-relaxed">
                                        {tutor.description ||
                                            'Cześć! Jestem pasjonatem nauki i pomogę Ci w osiągnięciu najlepszych wyników.'}
                                    </div>

                                    <hr />

                                    {/* EDUCATION / EXPERIENCE / APPROACH / LANGUAGES */}
                                    <div className="space-y-6">
                                        {/* Education */}
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Edukacja</h3>
                                            {mockEducation.map((edu, idx) => (
                                                <div key={idx} className="mb-2">
                                                    <p className="text-sm font-medium text-gray-700">
                                                        {edu.degree}, {edu.year}
                                                    </p>
                                                    <p className="text-sm text-gray-500">{edu.school}</p>
                                                </div>
                                            ))}
                                        </div>
                                        {/* Experience */}
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                                Doświadczenie
                                            </h3>
                                            {mockExperience.map((exp, idx) => (
                                                <p key={idx} className="text-sm text-gray-700 mb-1">
                                                    • {exp}
                                                </p>
                                            ))}
                                        </div>
                                        {/* Approach */}
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                                Mój styl nauczania
                                            </h3>
                                            <p className="text-sm text-gray-700">{mockApproach}</p>
                                        </div>
                                        {/* Languages */}
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Języki</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {mockLanguages.map((lang) => (
                                                    <span
                                                        key={lang}
                                                        className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs"
                                                    >
                            {lang}
                          </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <hr />

                                    {/* LEVELS & SUBJECTS */}
                                    <div className="space-y-6">
                                        <div>
                                            <h4 className="text-md font-semibold text-gray-800 mb-2">
                                                Poziomy
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {mockLevels.map((lvl) => (
                                                    <span
                                                        key={lvl}
                                                        className="px-2 py-1 bg-purple-100 text-purple-600 rounded-full text-xs"
                                                    >
                            {lvl}
                          </span>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="text-md font-semibold text-gray-800 mb-2">
                                                Specjalizacje
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {mockSubjects.map((sub) => (
                                                    <span
                                                        key={sub}
                                                        className="px-2 py-1 bg-green-100 text-green-600 rounded-full text-xs"
                                                    >
                            {sub}
                          </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-right pt-4">
                                        <button
                                            onClick={handleGoCalendar}
                                            className="px-6 py-2 rounded-md text-white bg-purple-600 hover:bg-purple-700"
                                        >
                                            Zarezerwuj lekcję
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* STEP 2: Calendar/Time Selection */}
                            {step === 2 && (
                                <div className="space-y-6">
                                    <h2 className="text-lg font-semibold text-gray-800">
                                        Wybierz datę i godziny
                                    </h2>
                                    <p className="text-sm text-gray-600">
                                        Zaznacz dzień w kalendarzu, a następnie wybierz 45-minutowe bloki.
                                    </p>
                                    <div className="w-full overflow-x-auto">
                                        <DayPicker
                                            mode="single"
                                            weekStartsOn={1}
                                            selected={selectedDay}
                                            onSelect={setSelectedDay}
                                            fromDate={new Date()}
                                            locale={pl}
                                            modifiersClassNames={{
                                                selected: 'bg-purple-500 text-white',
                                                today: 'border border-purple-500',
                                            }}
                                            styles={{
                                                caption: { color: '#4c1d95', fontWeight: 'bold' },
                                                head_cell: { color: '#4c1d95' },
                                            }}
                                        />
                                    </div>
                                    {selectedDay && (
                                        <div>
                                            <h4 className="text-md font-semibold text-gray-800 mb-2">
                                                Godziny: {selectedDay.toLocaleDateString('pl-PL')}
                                            </h4>
                                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                                                {timeBlocks.map((block) => {
                                                    const isSelected = selectedTimeBlocks.includes(block);
                                                    return (
                                                        <button
                                                            key={block}
                                                            onClick={() => toggleBlock(block)}
                                                            className={`px-2 py-1 rounded-md border text-sm transition ${
                                                                isSelected
                                                                    ? 'bg-purple-50 border-purple-400 text-purple-700'
                                                                    : 'hover:bg-gray-50 border-gray-200 text-gray-700'
                                                            }`}
                                                        >
                                                            {block}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                    <p className="text-xs text-gray-500">
                                        Możesz zaznaczyć kilka sąsiadujących bloków, żeby wydłużyć lekcję.
                                    </p>
                                    <div className="text-right">
                                        <button
                                            onClick={handleGoForm}
                                            disabled={!selectedDay || selectedTimeBlocks.length === 0}
                                            className={`px-6 py-2 rounded-md text-white ${
                                                !selectedDay || selectedTimeBlocks.length === 0
                                                    ? 'bg-gray-300 cursor-not-allowed'
                                                    : 'bg-purple-600 hover:bg-purple-700'
                                            }`}
                                        >
                                            Kontynuuj
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* STEP 3: Booking Form */}
                            {step === 3 && (
                                <div className="space-y-6">
                                    <h2 className="text-lg font-semibold text-gray-800">
                                        Szczegóły Lekcji
                                    </h2>
                                    <p className="text-sm text-gray-600">
                                        Data: <strong>{selectedDay?.toLocaleDateString('pl-PL')}</strong><br />
                                        Godziny: <strong>{selectedTimeBlocks.join(', ')}</strong>
                                    </p>
                                    {/* Lesson Topic */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Temat lekcji
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full border rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-400"
                                            placeholder="Np. Przygotowanie do matury, zadania z fizyki..."
                                            value={lessonTopic}
                                            onChange={(e) => setLessonTopic(e.target.value)}
                                        />
                                    </div>
                                    {/* Lesson Level */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Poziom
                                        </label>
                                        <select
                                            className="w-full border rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-400"
                                            value={lessonLevel}
                                            onChange={(e) => setLessonLevel(e.target.value)}
                                        >
                                            <option value="">-- Wybierz --</option>
                                            {mockLevels.map((lvl) => (
                                                <option key={lvl} value={lvl}>
                                                    {lvl}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    {/* Lesson Subject */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Przedmiot
                                        </label>
                                        <select
                                            className="w-full border rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-400"
                                            value={lessonSubject}
                                            onChange={(e) => setLessonSubject(e.target.value)}
                                        >
                                            <option value="">-- Wybierz --</option>
                                            {mockSubjects.map((sub) => (
                                                <option key={sub} value={sub}>
                                                    {sub}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    {/* Additional Info */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Dodatkowe informacje
                                        </label>
                                        <textarea
                                            rows={3}
                                            className="w-full border rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-400"
                                            placeholder="Opisz dokładniej co chcesz omówić..."
                                            value={lessonDescription}
                                            onChange={(e) => setLessonDescription(e.target.value)}
                                        />
                                    </div>
                                    <div className="text-right">
                                        <button
                                            onClick={handleConfirmBooking}
                                            className="px-6 py-2 rounded-md text-white bg-purple-600 hover:bg-purple-700"
                                        >
                                            Zatwierdź
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default TutorModal;
