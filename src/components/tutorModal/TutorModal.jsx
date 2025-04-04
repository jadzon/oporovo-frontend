import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaStar, FaArrowLeft, FaGraduationCap, FaBookOpen } from 'react-icons/fa';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { pl } from 'date-fns/locale';

const TutorModal = ({ tutor, onClose }) => {
    // ... (keep existing state and logic)
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
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={closeAll}
                >
                    <motion.div
                        layoutId={`tutor-${tutor.id}`}
                        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl mx-4 h-[85vh] flex flex-col"
                        initial={{ scale: 0.95, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.95, y: 20 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* HEADER */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                            {step > 1 ? (
                                <button
                                    onClick={handleBack}
                                    className="p-2 hover:bg-gray-50 rounded-lg text-gray-600 hover:text-purple-600 transition-colors"
                                >
                                    <FaArrowLeft className="text-lg" />
                                </button>
                            ) : (
                                <div />
                            )}
                            <button
                                onClick={closeAll}
                                className="p-2 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-gray-600 text-2xl transition-colors"
                            >
                                &times;
                            </button>
                        </div>

                        {/* PROFILE HEADER */}
                        <div className="px-6 py-4 flex items-center gap-5 bg-gradient-to-r from-purple-50 to-indigo-50">
                            <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden">
                                {tutor.avatar ? (
                                    <img
                                        src={tutor.avatar}
                                        alt={`${tutor.first_name} ${tutor.last_name}`}
                                        className="object-cover w-full h-full"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full bg-gray-100 text-gray-400">
                                        <FaGraduationCap className="text-3xl" />
                                    </div>
                                )}
                            </div>
                            <div className="space-y-1.5">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    {tutor.first_name} {tutor.last_name}
                                </h2>
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <FaStar
                                                key={i}
                                                className={`w-4 h-4 ${
                                                    i < ratingValue
                                                        ? 'text-amber-400'
                                                        : 'text-gray-300'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-sm font-medium text-gray-600">
                                        ({ratingValue.toFixed(1)})
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500">
                                    {mockLanguages.join(' • ')}
                                </p>
                            </div>
                        </div>

                        {/* CONTENT */}
                        <div className="flex-1 overflow-auto p-6 space-y-8">
                            {step === 1 && (
                                <div className="space-y-8">
                                    <div className="prose prose-sm max-w-none">
                                        <p className="text-gray-600 leading-relaxed">
                                            {tutor.description || '...'}
                                        </p>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                                                <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-3">
                                                    <FaGraduationCap className="text-purple-600" />
                                                    Edukacja
                                                </h3>
                                                {mockEducation.map((edu, idx) => (
                                                    <div key={idx} className="mb-4 last:mb-0">
                                                        <p className="font-medium text-gray-900">
                                                            {edu.degree}
                                                        </p>
                                                        <p className="text-sm text-gray-500">
                                                            {edu.school} ({edu.year})
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                                                <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-3">
                                                    <FaBookOpen className="text-purple-600" />
                                                    Specjalizacje
                                                </h3>
                                                <div className="flex flex-wrap gap-2">
                                                    {mockSubjects.map((sub) => (
                                                        <span
                                                            key={sub}
                                                            className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm font-medium"
                                                        >
                                                            {sub}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                                                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                                    Doświadczenie
                                                </h3>
                                                <ul className="space-y-3">
                                                    {mockExperience.map((exp, idx) => (
                                                        <li
                                                            key={idx}
                                                            className="flex items-start before:content-['•'] before:mr-2 before:text-purple-600 before:font-bold"
                                                        >
                                                            <span className="text-gray-600">
                                                                {exp}
                                                            </span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                                                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                                    Poziomy nauczania
                                                </h3>
                                                <div className="flex flex-wrap gap-2">
                                                    {mockLevels.map((lvl) => (
                                                        <span
                                                            key={lvl}
                                                            className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium"
                                                        >
                                                            {lvl}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-center border-t pt-6">
                                        <button
                                            onClick={handleGoCalendar}
                                            className="px-8 py-3 rounded-xl bg-purple-600 text-white font-semibold hover:shadow-lg transition-all hover:scale-[1.02]"
                                        >
                                            Zarezerwuj lekcję →
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* CALENDAR STEP */}
                            {step === 2 && (
                                <div className="space-y-8">
                                    <div className="text-center">
                                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                            Wybierz termin
                                        </h2>
                                        <p className="text-gray-600">
                                            Dostępne terminy w ciągu najbliższych 30 dni
                                        </p>
                                    </div>

                                    <div className="flex flex-col lg:flex-row gap-8">
                                        <div className="lg:w-1/2">
                                            <DayPicker
                                                mode="single"
                                                weekStartsOn={1}
                                                selected={selectedDay}
                                                onSelect={setSelectedDay}
                                                fromDate={new Date()}
                                                locale={pl}
                                                modifiersClassNames={{
                                                    selected: '!bg-purple-600 !text-white',
                                                    today: 'border border-purple-300',
                                                }}
                                                className="[--rdp-cell-size:48px] border rounded-xl p-4"
                                            />
                                        </div>

                                        <div className="lg:w-1/2">
                                            {selectedDay && (
                                                <div className="space-y-6">
                                                    <h3 className="text-lg font-semibold text-gray-900">
                                                        Dostępne godziny
                                                    </h3>
                                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                                        {timeBlocks.map((block) => (
                                                            <button
                                                                key={block}
                                                                onClick={() => toggleBlock(block)}
                                                                className={`p-3 rounded-lg text-sm font-medium transition-all ${
                                                                    selectedTimeBlocks.includes(block)
                                                                        ? 'bg-purple-600 text-white shadow-md'
                                                                        : 'bg-gray-50 text-gray-600 hover:bg-purple-50 hover:text-purple-600'
                                                                }`}
                                                            >
                                                                {block}
                                                            </button>
                                                        ))}
                                                    </div>
                                                    <button
                                                        onClick={handleGoForm}
                                                        disabled={!selectedTimeBlocks.length}
                                                        className="w-full py-3 bg-purple-600 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-700 transition-colors"
                                                    >
                                                        Kontynuuj ({selectedTimeBlocks.length} wybrane)
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* FORM STEP */}
                            {step === 3 && (
                                <div className="max-w-2xl mx-auto space-y-6">
                                    <div className="text-center">
                                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                            Szczegóły lekcji
                                        </h2>
                                        <p className="text-gray-600">
                                            Wypełnij informacje potrzebne do przygotowania się do lekcji
                                        </p>
                                    </div>

                                    <div className="space-y-5">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Temat lekcji
                                            </label>
                                            <input
                                                type="text"
                                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                placeholder="Np. Przygotowanie do egzaminu..."
                                                value={lessonTopic}
                                                onChange={(e) => setLessonTopic(e.target.value)}
                                            />
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-5">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Poziom
                                                </label>
                                                <select
                                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500"
                                                    value={lessonLevel}
                                                    onChange={(e) => setLessonLevel(e.target.value)}
                                                >
                                                    <option value="">Wybierz poziom</option>
                                                    {mockLevels.map((lvl) => (
                                                        <option key={lvl} value={lvl}>
                                                            {lvl}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Przedmiot
                                                </label>
                                                <select
                                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500"
                                                    value={lessonSubject}
                                                    onChange={(e) => setLessonSubject(e.target.value)}
                                                >
                                                    <option value="">Wybierz przedmiot</option>
                                                    {mockSubjects.map((sub) => (
                                                        <option key={sub} value={sub}>
                                                            {sub}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Dodatkowe informacje
                                            </label>
                                            <textarea
                                                rows={4}
                                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500"
                                                placeholder="Opisz szczegóły lekcji, swoje oczekiwania..."
                                                value={lessonDescription}
                                                onChange={(e) => setLessonDescription(e.target.value)}
                                            />
                                        </div>

                                        <button
                                            onClick={handleConfirmBooking}
                                            className="w-full py-3.5 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors shadow-md"
                                        >
                                            Potwierdź rezerwację
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