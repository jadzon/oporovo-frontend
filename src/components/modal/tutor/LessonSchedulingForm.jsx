// components/modal/tutor/LessonSchedulingForm.jsx
import React, { useState, useEffect } from 'react';
import { BiLoaderAlt } from 'react-icons/bi';
import {FaCalendarCheck, FaClock, FaMoneyBillWave} from 'react-icons/fa';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { pl } from 'date-fns/locale';
import { useSelector } from 'react-redux';
import { tutorAvailabilityService } from '../../../api/services/tutorAvailabilityService';
import { timeUtils, formatUtils } from '../utils';
import {FaMagnifyingGlass} from "react-icons/fa6";

/**
 * Component for scheduling a lesson with a tutor
 */
const LessonSchedulingForm = ({ tutor, error, setError, onFormSubmit }) => {
    const currentUser = useSelector(state => state.auth.user);

    // Form state
    const [selectedDay, setSelectedDay] = useState(null);
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [subject, setSubject] = useState('');
    const [level, setLevel] = useState('');

    // Calculation state
    const [lessonDuration, setLessonDuration] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);

    // Availability state
    const [availableSlots, setAvailableSlots] = useState([]);
    const [availableDates, setAvailableDates] = useState([]);
    const [loadingAvailability, setLoadingAvailability] = useState(false);
    const [availabilityError, setAvailabilityError] = useState(null);
    const [allMonthlySlots, setAllMonthlySlots] = useState([]);
    const [dailyAvailableMinutes, setDailyAvailableMinutes] = useState(0);

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

    // Fetch availability for the current month
    useEffect(() => {
        if (tutor?.id) {
            fetchMonthAvailability();
        }
    }, [tutor?.id]);

    // Calculate price when start time or end time changes
    useEffect(() => {
        if (startTime && endTime) {
            const durationInMinutes = timeUtils.calculateDurationInMinutes(startTime, endTime);
            setLessonDuration(durationInMinutes);

            const calculatedPrice = timeUtils.calculatePrice(
                startTime,
                endTime,
                tutor?.price || 0
            );
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

            const response = await tutorAvailabilityService.getAvailability(
                tutor.id,
                startDate,
                endDate
            );

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

                const uniqueDates = [...new Set(datesWithAvailability)];

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

    // Update available slots when a day is selected
    useEffect(() => {
        if (selectedDay && allMonthlySlots.length > 0) {
            filterSlotsForSelectedDay(selectedDay);
        }
    }, [selectedDay, allMonthlySlots]);

    // Filter available slots for a specific day
    const filterSlotsForSelectedDay = (date) => {
        setLoadingAvailability(true);

        try {
            // Format date without timezone conversion
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const formattedDate = `${year}-${month}-${day}`;

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
            setDailyAvailableMinutes(totalAvailableMinutes);
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
    };

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
    };

    // Submit form handler
    const handleSubmit = (e) => {
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
            formatted_start: formatUtils.formatDateTime(startDate),
            formatted_end: formatUtils.formatDateTime(endDate),
            duration,
            hourly_rate: tutor.price || 0,
            total_price: totalPrice
        };

        onFormSubmit(lessonDetails);
    };

    return (
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

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Left column - Calendar */}
                    <div className="space-y-6">
                        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                            <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
                                <FaCalendarCheck className="text-purple-600" />
                                Wybierz termin
                            </h3>

                            {loadingAvailability && !selectedDay && (
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
                                    // Disable dates without availability
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
                                                Cena lekcji: {formatUtils.formatPrice(totalPrice)} ({formatUtils.formatPrice(tutor.price)} / godzina)
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
    );
};

export default LessonSchedulingForm;