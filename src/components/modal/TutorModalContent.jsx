// components/modal/TutorModalContent.jsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    FaStar,
    FaArrowLeft,
    FaGraduationCap,
    FaBookOpen,
    FaTimes,
    FaCalendarCheck,
    FaCheck,
    FaClock,
    FaMoneyBillWave
} from 'react-icons/fa';
import { BiLoaderAlt } from 'react-icons/bi';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { pl } from 'date-fns/locale';
import { useModal } from '../../hooks/useModal';
import { useSelector } from 'react-redux';
import { lessonService } from '../../api/services/lessonService';
import { tutorAvailabilityService } from '../../api/services/tutorAvailabilityService';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import {FaMagnifyingGlass} from "react-icons/fa6";

const TutorModalContent = ({ tutor, onClose, hasHistory, goBack }) => {
    const { openLessonModal, openLessonCreatedConfirmation } = useModal();
    const currentUser = useSelector(state => state.auth.user);

    // Steps:
    // 1 = Detailed Profile
    // 2 = Schedule Lesson Form
    // 3 = Confirmation Screen
    // 4 = Processing (temporary during API call)
    const [step, setStep] = useState(1);

    // Form state for creating a lesson
    const [selectedDay, setSelectedDay] = useState(null);
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [subject, setSubject] = useState('');
    const [level, setLevel] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [lessonData, setLessonData] = useState(null);

    // Availability state
    const [availableSlots, setAvailableSlots] = useState([]);
    const [availableDates, setAvailableDates] = useState([]);
    const [loadingAvailability, setLoadingAvailability] = useState(false);
    const [availabilityError, setAvailabilityError] = useState(null);
    const [allMonthlySlots, setAllMonthlySlots] = useState([]);
    const [dailyAvailableMinutes, setDailyAvailableMinutes] = useState(0);

    // Price calculation state
    const [lessonDuration, setLessonDuration] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);


    // Basic rating logic
    const ratingValue = tutor?.rating ?? 4.8;
    const fullStars = Math.floor(ratingValue);
    const halfStar = ratingValue - fullStars >= 0.5;

    // Subject options based on tutor's specializations
    const subjectOptions = tutor?.subjects?.length
        ? tutor.subjects
        : ['Matematyka', 'Fizyka', 'Informatyka'];

    // Level options based on tutor's teaching levels
    const levelOptions = tutor?.levels?.length
        ? tutor.levels
        : ['Podstawówka', 'Liceum', 'Studia'];

    // Set default subject and level if tutor has them
    useEffect(() => {
        if (subjectOptions.length > 0 && !subject) {
            setSubject(subjectOptions[0]);
        }

        if (levelOptions.length > 0 && !level) {
            setLevel(levelOptions[0]);
        }
    }, [subjectOptions, levelOptions, subject, level]);

    // Fetch availability for the current month when the user enters scheduling step
    useEffect(() => {
        if (tutor?.id && step === 2) {
            fetchMonthAvailability();
        }
    }, [tutor?.id, step]);

    // Calculate price when start time or end time changes
    useEffect(() => {
        if (startTime && endTime) {
            // Calculate duration in minutes
            const [startHour, startMinute] = startTime.split(':').map(Number);
            const [endHour, endMinute] = endTime.split(':').map(Number);
            const startInMinutes = startHour * 60 + startMinute;
            const endInMinutes = endHour * 60 + endMinute;
            const durationInMinutes = endInMinutes - startInMinutes;

            setLessonDuration(durationInMinutes);

            // Calculate price (hourly rate * duration in hours)
            const hourlyRate = tutor?.price || 0;
            const durationInHours = durationInMinutes / 60;
            const calculatedPrice = hourlyRate * durationInHours;

            setTotalPrice(calculatedPrice);
        } else {
            setLessonDuration(0);
            setTotalPrice(0);
        }
    }, [startTime, endTime, tutor?.price]);

    // Function to fetch availability for the entire month
    const fetchMonthAvailability = async () => {
        if (!tutor?.id) return;

        setLoadingAvailability(true);

        try {
            // Get first and last day of current month
            const today = new Date();
            const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
            const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

            // Format dates as YYYY-MM-DD
            const startDate = firstDay.toISOString().split('T')[0];
            const endDate = lastDay.toISOString().split('T')[0];

            console.log(`Fetching availability for date range: ${startDate} to ${endDate}`);

            const response = await tutorAvailabilityService.getAvailability(
                tutor.id,
                startDate,
                endDate
            );

            console.log("Month availability response:", response.data);

            // Filter out dates in the past
            const todayStr = today.toISOString().split('T')[0];
            const todayDate = new Date(todayStr);

            if (response.data && Array.isArray(response.data.available_slots)) {
                // Store all monthly slots for filtering later
                setAllMonthlySlots(response.data.available_slots);

                // Extract unique dates that have availability and are not in the past
                const datesWithAvailability = response.data.available_slots
                    .filter(slot => {
                        // Extract just the date part from the slot date
                        const slotDate = new Date(slot.date.split('T')[0]);
                        // Keep only dates that are today or in the future
                        return slotDate >= todayDate;
                    })
                    .map(slot => slot.date.split('T')[0]);

                console.log("Filtered dates with availability:", datesWithAvailability);

                const uniqueDates = [...new Set(datesWithAvailability)];
                console.log("Unique available dates:", uniqueDates);

                // Convert to Date objects for DayPicker
                setAvailableDates(uniqueDates.map(dateStr => new Date(dateStr)));
            } else {
                setAllMonthlySlots([]);
                setAvailableDates([]);
            }
        } catch (err) {
            console.error('Error fetching month availability:', err);
            setAllMonthlySlots([]);
            setAvailableDates([]);
        } finally {
            setLoadingAvailability(false);
        }
    };

    useEffect(() => {
        if (selectedDay && allMonthlySlots.length > 0) {
            filterSlotsForSelectedDay(selectedDay);
        }
    }, [selectedDay, allMonthlySlots]);

    const filterSlotsForSelectedDay = (date) => {
        setLoadingAvailability(true);

        try {
            // Format date without timezone conversion
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const formattedDate = `${year}-${month}-${day}`;

            console.log(`Filtering slots for date: ${formattedDate}`);

            const filteredSlots = allMonthlySlots.filter(slot => {
                // Extract date parts from slot date string or object
                const slotDate = new Date(slot.date);
                const slotYear = slotDate.getFullYear();
                const slotMonth = String(slotDate.getMonth() + 1).padStart(2, '0');
                const slotDay = String(slotDate.getDate()).padStart(2, '0');
                const slotFormatted = `${slotYear}-${slotMonth}-${slotDay}`;

                return slotFormatted === formattedDate;
            });
            const totalAvailableMinutes = filteredSlots.reduce((sum, slot) => {
                const [sh, sm] = slot.start_time.split(':').map(Number);
                const [eh, em] = slot.end_time.split(':').map(Number);
                return sum + (eh * 60 + em - sh * 60 - sm);
            }, 0);

            setAvailableSlots(filteredSlots);
            setDailyAvailableMinutes(totalAvailableMinutes); // nowy state

            console.log(`Found ${filteredSlots.length} slots for ${formattedDate}`);
            setAvailableSlots(filteredSlots);
        } catch (err) {
            console.error('Error filtering slots:', err);
            setAvailabilityError('Wystąpił błąd podczas przetwarzania dostępności');
            setAvailableSlots([]);
        } finally {
            setLoadingAvailability(false);
        }
    };

    // Helper to render availability status for selected day
    const renderAvailabilityInfo = () => {
        if (loadingAvailability) {
            return (
                <div className="mt-2 text-sm text-gray-600 flex items-center">
                    <BiLoaderAlt className="animate-spin mr-2" />
                    Ładowanie dostępności...
                </div>
            );
        }

        if (availabilityError) {
            return (
                <div className="mt-2 text-sm text-red-600">
                    {availabilityError}
                </div>
            );
        }

        if (availableSlots.length === 0 && selectedDay) {
            return (
                <div className="mt-2 text-sm text-amber-600">
                    Brak dostępnych terminów na ten dzień.
                </div>
            );
        }

        if (availableSlots.length > 0) {
            return (
                <div className="mt-2 text-sm text-green-600">
                    Dostępność: {dailyAvailableMinutes / 60} godziny
                </div>
            );
        }

        return null;
    };

    // Mock data for display
    const mockEducation = [
        { school: 'Uniwersytet ABC', degree: 'Magister Informatyki', year: '2019' },
        { school: 'Liceum XYZ', degree: 'Profil mat-fiz', year: '2015' },
    ];
    const mockExperience = [
        'Korepetycje online z algorytmiki (2 lata)',
        'Prowadzenie szkoleń z JS (3 lata)',
    ];
    const mockLanguages = ['Polski (Natywny)', 'Angielski (C1)'];

    // Generate start time options based on available slots
    const generateTimeOptions = () => {
        if (!selectedDay) return [];

        if (loadingAvailability) {
            return [<option key="loading" value="">Ładowanie...</option>];
        }

        if (availabilityError || !availableSlots || availableSlots.length === 0) {
            return [<option key="none" value="">Brak dostępnych terminów</option>];
        }

        // Check if selected day is today
        const now = new Date();
        const isToday = selectedDay.getDate() === now.getDate() &&
            selectedDay.getMonth() === now.getMonth() &&
            selectedDay.getFullYear() === now.getFullYear();

        // Calculate current time in minutes since midnight
        const currentMinutes = now.getHours() * 60 + now.getMinutes();

        // Round up to next 15-minute interval (add a small buffer)
        const nextAvailableMinute = isToday ?
            Math.ceil((currentMinutes + 15) / 15) * 15 : 0;

        console.log(`Is today: ${isToday}, Current time: ${currentMinutes} mins, Next slot: ${nextAvailableMinute} mins`);

        // Generate all valid time options
        const options = [];

        availableSlots.forEach(slot => {
            if (!slot.start_time || !slot.end_time) return;

            // Convert time strings to minutes
            const [startHour, startMin] = slot.start_time.split(':').map(Number);
            const [endHour, endMin] = slot.end_time.split(':').map(Number);

            const slotStartMins = startHour * 60 + startMin;
            const slotEndMins = endHour * 60 + endMin;

            // For today, use the later of slot start time or next available time
            const effectiveStartMins = isToday ?
                Math.max(slotStartMins, nextAvailableMinute) : slotStartMins;

            // Generate 15-minute intervals
            for (let mins = effectiveStartMins; mins <= slotEndMins - 15; mins += 15) {
                // Round to nearest 15-minute interval
                const roundedMins = Math.ceil(mins / 15) * 15;

                if (roundedMins >= slotEndMins) continue;

                const h = String(Math.floor(roundedMins / 60)).padStart(2, '0');
                const m = String(roundedMins % 60).padStart(2, '0');

                options.push(
                    <option key={`${h}:${m}`} value={`${h}:${m}`}>
                        {h}:{m}
                    </option>
                );
            }
        });

        // Remove duplicates (in case of overlapping slots)
        const uniqueOptions = [];
        const seen = new Set();

        options.forEach(option => {
            if (!seen.has(option.props.value)) {
                seen.add(option.props.value);
                uniqueOptions.push(option);
            }
        });

        return uniqueOptions.sort((a, b) => a.props.value.localeCompare(b.props.value));
    }

    // Generate end time options based on selected start time
    const generateEndTimeOptions = () => {
        if (!selectedDay || !startTime) return [];

        // Convert selected start time to minutes
        const [startHour, startMin] = startTime.split(':').map(Number);
        const startMinutes = startHour * 60 + startMin;

        // Find the available slot that contains this start time
        const matchingSlot = availableSlots.find(slot => {
            const [slotStartHour, slotStartMin] = slot.start_time.split(':').map(Number);
            const [slotEndHour, slotEndMin] = slot.end_time.split(':').map(Number);

            const slotStartMins = slotStartHour * 60 + slotStartMin;
            const slotEndMins = slotEndHour * 60 + slotEndMin;

            return startMinutes >= slotStartMins && startMinutes < slotEndMins;
        });

        if (!matchingSlot) return [];

        // Generate options from start time + 15 min to end of slot
        const options = [];
        const [endHour, endMin] = matchingSlot.end_time.split(':').map(Number);
        const slotEndMinutes = endHour * 60 + endMin;

        // Start at current start time + 15 minutes minimum
        for (let mins = startMinutes + 15; mins <= slotEndMinutes; mins += 15) {
            const h = String(Math.floor(mins / 60)).padStart(2, '0');
            const m = String(mins % 60).padStart(2, '0');

            options.push(
                <option key={`${h}:${m}`} value={`${h}:${m}`}>
                    {h}:{m}
                </option>
            );
        }

        return options;
    }

    // Format price to display with 2 decimal places and PLN
    const formatPrice = (price) => {
        return `${price.toFixed(2)} zł`;
    };

    // Proceed to confirmation step
    const handleProceedToConfirmation = (e) => {
        if (e) e.preventDefault();

        if (!selectedDay || !startTime || !endTime || !title || !subject || !level) {
            setError('Wypełnij wszystkie wymagane pola');
            return;
        }

        if (!currentUser || !currentUser.id) {
            setError('Musisz być zalogowany, aby utworzyć lekcję');
            return;
        }

        // Calculate start and end times
        const [startHour, startMinute] = startTime.split(':').map(Number);
        const [endHour, endMinute] = endTime.split(':').map(Number);
        const start = startHour * 60 + startMinute;
        const end = endHour * 60 + endMinute;
        const duration = end - start;
        if (duration < 45 || duration % 15 !== 0) {
            setError('Czas trwania lekcji musi wynosić co najmniej 45 minut i być wielokrotnością 15 minut');
            return;
        }

        // Prepare lesson data
        const startDate = new Date(selectedDay);
        startDate.setHours(startHour, startMinute, 0, 0);
        const endDate = new Date(selectedDay);
        endDate.setHours(endHour, endMinute, 0, 0);

        const lessonDetails = {
            tutor_id: tutor.id,
            student_ids: [currentUser.id],
            title,
            description,
            subject,
            level,
            start_time: startDate.toISOString(),
            end_time: endDate.toISOString(),
            tutor_name: `${tutor.first_name} ${tutor.last_name}`,
            formatted_start: startDate.toLocaleString('pl-PL'),
            formatted_end: endDate.toLocaleString('pl-PL'),
            duration,
            hourly_rate: tutor.price || 0,
            total_price: totalPrice
        };

        setLessonData(lessonDetails);
        setStep(3);
    };

    // Handle creating a lesson (after confirmation)
    const handleCreateLesson = async () => {
        if (!lessonData) {
            setError('Brak danych lekcji');
            return;
        }

        // Show processing state
        setLoading(true);
        setError(null);
        setStep(4);

        try {
            // Call the API to create the lesson
            const response = await lessonService.createLesson(lessonData);

            // Show success confirmation
            openLessonCreatedConfirmation({
                ...response.data,
                lessonObject: response.data // Store the full lesson object for navigation
            });

            // Reset form and close modal
            resetForm();

            // Open the lesson modal to view the created lesson
            setTimeout(() => {
                openLessonModal(response.data);
            }, 500);

        } catch (err) {
            console.error('Error creating lesson:', err);
            setError(err.response?.data?.error || 'Wystąpił błąd podczas tworzenia lekcji');
            // Go back to confirmation step
            setStep(3);
        } finally {
            setLoading(false);
        }
    };

    // Cancel lesson creation
    const handleCancelConfirmation = () => {
        // Go back to form step
        setStep(2);
    };

    // Reset form fields
    const resetForm = () => {
        setSelectedDay(null);
        setStartTime("");
        setEndTime("");
        setTitle('');
        setDescription('');
        setLessonData(null);
        setError(null);
        setLessonDuration(0);
        setTotalPrice(0);
        // Keep the default subject and level
    };

    // Handle navigation to lesson
    const handleViewLesson = (lesson) => {
        openLessonModal(lesson);
    };

    // Handle back button for different steps
    const handleBackNavigation = () => {
        if (step > 1) {
            // If we're in confirmation, go back to form
            if (step === 3) {
                setStep(2);
            } else {
                // Otherwise reset form and go to profile
                resetForm();
                setStep(1);
            }
        } else if (goBack) {
            goBack();
        }
    };

    // Get header title based on current step
    const getHeaderTitle = () => {
        switch (step) {
            case 1:
                return `${tutor?.first_name || ''} ${tutor?.last_name || ''}`;
            case 2:
                return 'Zaplanuj lekcję';
            case 3:
                return 'Potwierdź szczegóły lekcji';
            case 4:
                return 'Tworzenie lekcji...';
            default:
                return 'Nauczyciel';
        }
    };

    return (
        <>
            {/* HEADER */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                {hasHistory || step > 1 ? (
                    <button
                        onClick={handleBackNavigation}
                        className="p-2 hover:bg-gray-50 rounded-lg text-gray-600 hover:text-purple-600 transition-colors"
                        disabled={loading}
                    >
                        <FaArrowLeft className="text-lg" />
                    </button>
                ) : (
                    <div></div>
                )}
                <h2 className="text-lg font-semibold text-gray-700">
                    {getHeaderTitle()}
                </h2>
                <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-gray-600 text-2xl transition-colors"
                    disabled={loading}
                >
                    <FaTimes className="text-xl" />
                </button>
            </div>

            {/* PROFILE HEADER - Show in all steps for context */}
            <div className="px-6 py-4 flex items-center gap-5 bg-gradient-to-r from-purple-50 to-indigo-50">
                <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden">
                    {tutor?.avatar ? (
                        <LazyLoadImage
                            src={tutor.avatar}
                            alt={`${tutor.first_name} ${tutor.last_name}`}
                            effect="blur"
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
                        {tutor?.first_name} {tutor?.last_name}
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
                    {tutor?.price && (
                        <p className="text-sm font-medium text-green-600 flex items-center">
                            <FaMoneyBillWave className="mr-1" />
                            {formatPrice(tutor.price)} / godzina
                        </p>
                    )}
                </div>
            </div>

            {/* CONTENT */}
            <div className="flex-1 overflow-auto p-6 space-y-8">
                {/* STEP 1: Tutor Profile */}
                {step === 1 && (
                    <div className="space-y-8">
                        <div className="prose prose-sm max-w-none">
                            <p className="text-gray-600 leading-relaxed">
                                {tutor?.description || 'Doświadczony nauczyciel z pasją do przekazywania wiedzy. Specjalizuję się w przedmiotach ścisłych, szczególnie matematyce i fizyce. Pomagam uczniom rozwiązywać problemy i rozwijać umiejętności analitycznego myślenia.'}
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
                                        {subjectOptions.map((sub) => (
                                            <span
                                                key={sub}
                                                className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm font-medium"
                                            >
                                                {sub}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Price card for tutor profile */}
                                {tutor?.price && (
                                    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                                        <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-3">
                                            <FaMoneyBillWave className="text-green-600" />
                                            Cennik
                                        </h3>
                                        <div className="space-y-2">
                                            <p className="text-gray-700">Stawka godzinowa: <span className="font-bold text-green-600">{formatPrice(tutor.price)}</span></p>
                                            <p className="text-sm text-gray-500">Minimalna długość lekcji: 45 minut</p>
                                            <p className="text-sm text-gray-500">Cena za 45 minut: {formatPrice(tutor.price * 0.75)}</p>
                                            <p className="text-sm text-gray-500">Cena za 90 minut: {formatPrice(tutor.price * 1.5)}</p>
                                        </div>
                                    </div>
                                )}
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
                                        {levelOptions.map((lvl) => (
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

                        {/* Upcoming lessons with this tutor - could be added here */}
                        {tutor?.upcoming_lessons && tutor.upcoming_lessons.length > 0 && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900">Nadchodzące lekcje</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {tutor.upcoming_lessons.map(lesson => (
                                        <div
                                            key={lesson.id}
                                            className="p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-purple-50 transition-colors"
                                            onClick={() => handleViewLesson(lesson)}
                                        >
                                            <h4 className="font-medium">{lesson.title}</h4>
                                            <p className="text-sm text-gray-600">
                                                {new Date(lesson.start_time).toLocaleString('pl-PL')}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="text-center border-t pt-6">
                            <button
                                onClick={() => setStep(2)}
                                className="btn px-8 py-3 rounded-md bg-purple-600 text-white font-semibold hover:shadow-lg transition-all hover:bg-purple-700"
                            >
                                Zaplanuj lekcję
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 2: Lesson Form */}
                {step === 2 && (
                    <div className="space-y-8">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                Zaplanuj lekcję z {tutor?.first_name}
                            </h2>
                            <p className="text-gray-600">
                                Wybierz termin i podaj szczegóły lekcji
                            </p>

                        </div>

                        {error && (
                            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleProceedToConfirmation} className="space-y-8">
                            <div className="grid md:grid-cols-2 gap-8">
                                {/* Left column - Calendar */}
                                <div className="space-y-6">
                                    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                                        <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
                                            <FaCalendarCheck className="text-purple-600" />
                                            Wybierz termin
                                        </h3>

                                        {loadingAvailability && step === 2 && !selectedDay && (
                                            <div className="flex justify-center items-center py-2">
                                                <BiLoaderAlt className="animate-spin text-purple-600 mr-2" />
                                                <span className="text-sm text-gray-600">Ładowanie dostępności...</span>
                                            </div>
                                        )}

                                        <DayPicker
                                            mode="single"
                                            weekStartsOn={1}
                                            selected={selectedDay}
                                            onSelect={setSelectedDay}
                                            locale={pl}
                                            disabled={[
                                                // Disable dates before today
                                                { before: new Date() },
                                                // Optional: You can also disable dates that don't have availability
                                                // This creates a 2-level filter: first disable past days, then from remaining days
                                                // disable those without availability
                                                (date) => {
                                                    // Skip this check for dates already disabled (before today)
                                                    if (date < new Date().setHours(0, 0, 0, 0)) return false;

                                                    // Check if the date is in the availableDates array
                                                    return !availableDates.some(availableDate =>
                                                        availableDate.getDate() === date.getDate() &&
                                                        availableDate.getMonth() === date.getMonth() &&
                                                        availableDate.getFullYear() === date.getFullYear()
                                                    );
                                                }
                                            ]}
                                            modifiers={{
                                                available: availableDates,
                                            }}
                                            modifiersClassNames={{
                                                selected: '!bg-purple-600 !text-white',
                                                today: 'border border-purple-300',
                                                disabled: 'text-gray-300 cursor-not-allowed bg-gray-50',
                                                available: 'bg-green-50 font-bold text-green-800',
                                            }}
                                            className="mx-auto [--rdp-cell-size:40px]"
                                        />
                                    </div>

                                    {selectedDay && (
                                        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                                            <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
                                                <FaClock className="text-purple-600"/>
                                                Wybierz godziny
                                            </h3>

                                            {renderAvailabilityInfo()}

                                            <div className="grid grid-cols-2 gap-4 mt-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Godzina rozpoczecia*
                                                    </label>
                                                    <select
                                                        value={startTime}
                                                        onChange={(e) => {
                                                            setStartTime(e.target.value);
                                                            setEndTime(""); // Reset end time when start time changes
                                                        }}
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                                        required
                                                        disabled={availableSlots.length === 0 || loadingAvailability}
                                                    >
                                                        <option value="">--</option>
                                                        {generateTimeOptions()}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Godzina zakończenia*
                                                    </label>
                                                    <select
                                                        value={endTime}
                                                        onChange={(e) => setEndTime(e.target.value)}
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                                        required
                                                        disabled={!startTime || availableSlots.length === 0 || loadingAvailability}
                                                    >
                                                        <option value="">--</option>
                                                        {generateEndTimeOptions()}
                                                    </select>
                                                </div>
                                            </div>
                                            {startTime && endTime && (
                                                <div className="mt-4 space-y-2">
                                                    <div className="text-sm text-gray-600">
                                                        Zaplanowana lekcja: {lessonDuration} minut
                                                    </div>
                                                    {tutor?.price && (
                                                        <div className="flex items-center text-sm font-medium text-green-600">
                                                            <FaMoneyBillWave className="mr-1" />
                                                            Cena lekcji: {formatPrice(totalPrice)} ({formatPrice(tutor.price)} / godzina)
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Right column - Form Details */}
                                <div className="space-y-6">
                                    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                                        <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
                                            <FaMagnifyingGlass className="text-purple-600"/>
                                            Szczegóły lekcji
                                        </h3>

                                        <div className="space-y-4">
                                            <div>
                                                <label htmlFor="title"
                                                       className="block text-sm font-medium text-gray-700 mb-1">
                                                    Tytuł lekcji*
                                                </label>
                                                <input
                                                    id="title"
                                                    type="text"
                                                    value={title}
                                                    onChange={(e) => setTitle(e.target.value)}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                    placeholder="Wprowadź tytuł lekcji"
                                                    required
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                                                        Przedmiot*
                                                    </label>
                                                    <select
                                                        id="subject"
                                                        value={subject}
                                                        onChange={(e) => setSubject(e.target.value)}
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                                        required
                                                    >
                                                        <option value="">Wybierz przedmiot</option>
                                                        {subjectOptions.map((sub) => (
                                                            <option key={sub} value={sub}>
                                                                {sub}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div>
                                                    <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-1">
                                                        Poziom*
                                                    </label>
                                                    <select
                                                        id="level"
                                                        value={level}
                                                        onChange={(e) => setLevel(e.target.value)}
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                                        required
                                                    >
                                                        <option value="">Wybierz poziom</option>
                                                        {levelOptions.map((lvl) => (
                                                            <option key={lvl} value={lvl}>
                                                                {lvl}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>

                                            <div>
                                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Opis lekcji
                                                </label>
                                                <textarea
                                                    id="description"
                                                    value={description}
                                                    onChange={(e) => setDescription(e.target.value)}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                    placeholder="Opisz czego dotyczy lekcja, cele, pytania..."
                                                    rows={4}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={!selectedDay || !startTime || !endTime || !title || !subject || !level}
                                        className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Dalej
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                )}

                {/* STEP 3: Confirmation */}
                {step === 3 && lessonData && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="max-w-2xl mx-auto space-y-6"
                    >
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                Potwierdź szczegóły lekcji
                            </h2>
                            <p className="text-gray-600">
                                Sprawdź, czy wszystko się zgadza przed utworzeniem lekcji
                            </p>
                        </div>

                        {error && (
                            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                                {error}
                            </div>
                        )}

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-900 mb-6">Szczegóły lekcji</h3>

                            <div className="divide-y divide-gray-100">
                                <div className="py-3 grid grid-cols-3">
                                    <span className="text-gray-500">Tytuł</span>
                                    <span className="col-span-2 font-medium">{lessonData.title}</span>
                                </div>

                                <div className="py-3 grid grid-cols-3">
                                    <span className="text-gray-500">Nauczyciel</span>
                                    <span className="col-span-2 font-medium">{lessonData.tutor_name}</span>
                                </div>

                                <div className="py-3 grid grid-cols-3">
                                    <span className="text-gray-500">Przedmiot</span>
                                    <span className="col-span-2 font-medium">{lessonData.subject}</span>
                                </div>

                                <div className="py-3 grid grid-cols-3">
                                    <span className="text-gray-500">Poziom</span>
                                    <span className="col-span-2 font-medium">{lessonData.level}</span>
                                </div>

                                <div className="py-3 grid grid-cols-3">
                                    <span className="text-gray-500">Data</span>
                                    <span className="col-span-2 font-medium">
                                        {new Date(lessonData.start_time).toLocaleDateString('pl-PL')}
                                    </span>
                                </div>

                                <div className="py-3 grid grid-cols-3">
                                    <span className="text-gray-500">Czas rozpoczęcia</span>
                                    <span className="col-span-2 font-medium">
                                        {new Date(lessonData.start_time).toLocaleTimeString('pl-PL', {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </span>
                                </div>

                                <div className="py-3 grid grid-cols-3">
                                    <span className="text-gray-500">Czas zakończenia</span>
                                    <span className="col-span-2 font-medium">
                                        {new Date(lessonData.end_time).toLocaleTimeString('pl-PL', {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </span>
                                </div>

                                <div className="py-3 grid grid-cols-3">
                                    <span className="text-gray-500">Czas trwania</span>
                                    <span className="col-span-2 font-medium">{lessonData.duration} minut</span>
                                </div>

                                {lessonData.hourly_rate > 0 && (
                                    <>
                                        <div className="py-3 grid grid-cols-3">
                                            <span className="text-gray-500">Stawka za godzinę</span>
                                            <span className="col-span-2 font-medium">{formatPrice(lessonData.hourly_rate)}</span>
                                        </div>

                                        <div className="py-3 grid grid-cols-3">
                                            <span className="text-gray-500">Cena lekcji</span>
                                            <span className="col-span-2 font-medium text-green-600">{formatPrice(lessonData.total_price)}</span>
                                        </div>
                                    </>
                                )}

                                {lessonData.description && (
                                    <div className="py-3 grid grid-cols-3">
                                        <span className="text-gray-500">Opis</span>
                                        <span className="col-span-2">{lessonData.description}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                            <button
                                onClick={handleCancelConfirmation}
                                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                            >
                                Wróć do edycji
                            </button>

                            <button
                                onClick={handleCreateLesson}
                                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
                            >
                                Utwórz lekcję
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* STEP 4: Processing */}
                {step === 4 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center h-full py-12"
                    >
                        <div className="text-center">
                            <div className="flex justify-center">
                                <BiLoaderAlt className="animate-spin text-6xl text-purple-600 mb-4" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900">Trwa tworzenie lekcji</h3>
                            <p className="text-gray-600 mt-2">Proszę czekać, przetwarzamy Twoje zgłoszenie...</p>
                        </div>
                    </motion.div>
                )}
            </div>
        </>
    );
};

export default TutorModalContent;