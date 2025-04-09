// components/modal/tutor/LessonSchedulingForm.jsx
import React, { useState, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { pl } from 'date-fns/locale';
import { useSelector } from 'react-redux';
import { tutorAvailabilityService } from '../../../api/services/tutorAvailabilityService';
import { timeUtils, formatUtils } from '../utils';

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
    const [selectedBlock, setSelectedBlock] = useState(null); // Blok początkowy (45 min)
    const [selectedAdjacentBlock, setSelectedAdjacentBlock] = useState(null); // Dodatkowy blok, jeżeli możliwy

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
        if (selectedBlock) {
            // Jeżeli dodatkowy blok został wybrany, lekcja trwa od początku pierwszego do końca drugiego bloku
            const startMins = selectedBlock.startMins;
            const endMins = selectedAdjacentBlock ? selectedAdjacentBlock.endMins : selectedBlock.endMins;
            const durationInMinutes = endMins - startMins;
            setLessonDuration(durationInMinutes);
            const calculatedPrice = tutor.price * (durationInMinutes / 60);
            setTotalPrice(calculatedPrice);
        } else {
            setLessonDuration(0);
            setTotalPrice(0);
        }
    }, [selectedBlock, selectedAdjacentBlock, tutor.price]);
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
    const getInitialBlockOptions = () => {
        if (!selectedDay || availableSlots.length === 0) return [];
        const options = [];
        availableSlots.forEach(slot => {
            if (!slot.start_time || !slot.end_time) return;
            const [slotStartHour, slotStartMin] = slot.start_time.split(':').map(Number);
            const [slotEndHour, slotEndMin] = slot.end_time.split(':').map(Number);
            const slotStart = slotStartHour * 60 + slotStartMin;
            const slotEnd = slotEndHour * 60 + slotEndMin;
            // Generujemy bloki startowe co 30 minut, ale tylko jeśli cały 45-minutowy blok mieści się w slotcie
            for (let time = slotStart; time + 45 <= slotEnd; time += 30) {
                const hStart = String(Math.floor(time / 60)).padStart(2, '0');
                const mStart = String(time % 60).padStart(2, '0');
                const hEnd = String(Math.floor((time + 45) / 60)).padStart(2, '0');
                const mEnd = String((time + 45) % 60).padStart(2, '0');
                options.push({
                    start: `${hStart}:${mStart}`, // tylko start
                    // nadal przechowujemy end, startMins i endMins do obliczeń,
                    // ale w UI wykorzystamy wyłącznie start
                    end: `${hEnd}:${mEnd}`,
                    startMins: time,
                    endMins: time + 45
                });
            }
        });
        // Usuwamy ewentualne duplikaty i sortujemy
        const uniqueOptions = options.filter((opt, index, self) =>
            index === self.findIndex(o => o.start === opt.start && o.end === opt.end)
        );
        return uniqueOptions.sort((a, b) => a.startMins - b.startMins);
    };
    const getAdjacentBlockOption = () => {
        if (!selectedBlock) return null;
        const adjacentStartMins = selectedBlock.endMins;
        const adjacentEndMins = adjacentStartMins + 45;
        let isValid = false;
        availableSlots.forEach(slot => {
            if (!slot.start_time || !slot.end_time) return;
            const [sHour, sMin] = slot.start_time.split(':').map(Number);
            const [eHour, eMin] = slot.end_time.split(':').map(Number);
            const slotStart = sHour * 60 + sMin;
            const slotEnd = eHour * 60 + eMin;
            // Sprawdzamy, czy dodatkowy blok mieści się w jednym z dostępnych przedziałów
            if (selectedBlock.startMins >= slotStart && adjacentEndMins <= slotEnd) {
                isValid = true;
            }
        });
        if (!isValid) return null;
        const h = String(Math.floor(adjacentStartMins / 60)).padStart(2, '0');
        const m = String(adjacentStartMins % 60).padStart(2, '0');
        const hEnd = String(Math.floor(adjacentEndMins / 60)).padStart(2, '0');
        const mEnd = String(adjacentEndMins % 60).padStart(2, '0');
        return {
            start: `${h}:${m}`, // tylko start
            end: `${hEnd}:${mEnd}`,
            startMins: adjacentStartMins,
            endMins: adjacentEndMins
        };
    };

    const renderBlockSelection = () => {
        // Informacja, że bloki są 45-minutowe (możesz tę informację umieścić również w nagłówku sekcji)
        const blockInfo = (
            <p className="text-sm text-gray-500 mb-2">Każdy blok trwa 45 minut</p>
        );

        // Jeśli żaden blok nie został jeszcze wybrany, renderujemy wszystkie dostępne opcje
        if (!selectedBlock) {
            const options = getInitialBlockOptions();
            if (options.length === 0) {
                return (
                    <div className="text-sm text-amber-600 mt-4">
                        Brak dostępnych bloków na ten dzień.
                    </div>
                );
            }
            return (
                <div className="mt-4">
                    {blockInfo}
                    <div className="flex flex-wrap gap-4">
                        {options.map((block, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    setSelectedBlock(block);
                                    setSelectedAdjacentBlock(null); // reset przy nowym wyborze
                                }}
                                className="btn px-8 py-2 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-800 hover:bg-indigo-50 transition-colors"
                            >
                                {block.start}

                            </button>
                        ))}
                    </div>
                </div>
            );
        } else {
            // Gdy już wybrano główny blok, prezentujemy podsumowanie w eleganckiej karcie
            return (
                <div className="mt-6">
                    {blockInfo}
                    <div className="bg-white rounded-lg shadow-lg border border-gray-300 p-6">
                        <div className="flex items-center justify-between">
                            <h4 className="text-lg font-semibold text-gray-800">Wybrany blok</h4>
                            <button
                                onClick={() => {
                                    setSelectedBlock(null);
                                    setSelectedAdjacentBlock(null);
                                }}
                                className="text-sm text-indigo-600 hover:underline transition-colors"
                            >
                                Zmień wybór
                            </button>
                        </div>
                        <div className="mt-2">
                            <p className="text-gray-700">
                                <span className="font-medium">Blok podstawowy:</span> {selectedBlock.start} - {selectedBlock.end}
                            </p>
                        </div>
                        {getAdjacentBlockOption() ? (
                            <div className="mt-4">
                                {selectedAdjacentBlock ? (
                                    <div className="flex items-center justify-between">
                                        <p className="text-gray-700">
                                            <span className="font-medium">Dodatkowy blok:</span> {selectedAdjacentBlock.start} - {selectedAdjacentBlock.end}
                                        </p>
                                        <button
                                            onClick={() => setSelectedAdjacentBlock(null)}
                                            className="btn text-sm text-red-600 hover:text-red-700 transition-colors"
                                        >
                                            Usuń
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => {
                                            const adjacent = getAdjacentBlockOption();
                                            if (adjacent) setSelectedAdjacentBlock(adjacent);
                                        }}
                                        className="btn w-full mt-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded transition-colors"
                                    >
                                        Dodaj dodatkowy blok ({getAdjacentBlockOption().start})
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="mt-4 text-sm text-gray-600">
                                Nie można przedłużyć lekcji – dostępny czas nie pozwala.
                            </div>
                        )}
                    </div>
                </div>
            );
        }
    };

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

                // First, group slots by date
                const slotsByDate = {};
                response.data.available_slots.forEach(slot => {
                    const dateStr = slot.date.split('T')[0];
                    if (!slotsByDate[dateStr]) {
                        slotsByDate[dateStr] = [];
                    }
                    slotsByDate[dateStr].push(slot);
                });

                // Only include dates that have sufficient availability (at least 45 minutes)
                const datesWithSufficientAvailability = Object.entries(slotsByDate)
                    .filter(([dateStr, slots]) => {
                        // Skip past dates
                        const slotDate = new Date(dateStr);
                        if (slotDate < todayDate) return false;

                        // Calculate total available minutes for this day
                        const totalMinutes = slots.reduce((sum, slot) => {
                            const [startHour, startMin] = slot.start_time.split(':').map(Number);
                            const [endHour, endMin] = slot.end_time.split(':').map(Number);
                            return sum + (endHour * 60 + endMin - startHour * 60 - startMin);
                        }, 0);

                        // Require at least 45 minutes (minimum lesson duration)
                        return totalMinutes >= 45;
                    })
                    .map(([dateStr]) => dateStr);

                // Convert to Date objects for DayPicker
                setAvailableDates(datesWithSufficientAvailability.map(dateStr => new Date(dateStr)));
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

            // Show error if not enough time available
            if (totalAvailableMinutes < 45) {
                setAvailabilityError('Brak wystarczającej dostępności dla minimalnego czasu lekcji (45 minut)');
            } else {
                setAvailabilityError(null);
            }
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
                    <svg className="animate-spin h-4 w-4 mr-2 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
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
            const hours = Math.floor(dailyAvailableMinutes / 60);
            const minutes = dailyAvailableMinutes % 60;

            return (
                <div className="mt-2 text-sm text-green-600">
                    Dostępność: {hours > 0 ? `${hours} godz. ` : ''}{minutes > 0 ? `${minutes} min.` : ''}
                    {dailyAvailableMinutes < 45 && (
                        <span className="block text-amber-600 mt-1">
                            Uwaga: Dostępny czas jest krótszy niż wymagane 45 minut.
                        </span>
                    )}
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

            // Generate options at 15-minute intervals
            // The latest possible start time is 45 minutes before the slot end
            const latestStartMins = slotEndMins - 45;

            // Only generate times if we have at least 45 minutes in the slot
            if (effectiveStartMins <= latestStartMins) {
                // Generate 15-minute intervals
                for (let mins = effectiveStartMins; mins <= latestStartMins; mins += 15) {
                    // Round to nearest 15-minute interval
                    const roundedMins = Math.floor(mins / 15) * 15;

                    // Skip if rounded time would exceed the latest possible start time
                    if (roundedMins > latestStartMins) continue;

                    const h = String(Math.floor(roundedMins / 60)).padStart(2, '0');
                    const m = String(roundedMins % 60).padStart(2, '0');

                    options.push(
                        <option key={`${h}:${m}`} value={`${h}:${m}`}>
                            {h}:{m}
                        </option>
                    );
                }
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

        // Generate options from start time + 45 min to end of slot
        const options = [];
        const [endHour, endMin] = matchingSlot.end_time.split(':').map(Number);
        const slotEndMinutes = endHour * 60 + endMin;

        // Minimum lesson duration is 45 minutes
        const minEndMinutes = startMinutes + 45;

        // If the slot doesn't have at least 45 minutes, return no options
        if (minEndMinutes > slotEndMinutes) {
            return [<option key="none" value="">Zbyt krótki czas na lekcję</option>];
        }

        // Start at current start time + 45 minutes minimum
        for (let mins = minEndMinutes; mins <= slotEndMinutes; mins += 15) {
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

    // Handler for day selection that also resets time fields
    const handleDaySelect = (day) => {
        // Reset time selections when day changes
        setStartTime('');
        setEndTime('');

        // Update selected day
        setSelectedDay(day);
    };

    // Submit form handler
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedDay || !selectedBlock || !title || !subject || !level) {
            setError('Wypełnij wszystkie wymagane pola');
            return;
        }
        if (!currentUser || !currentUser.id) {
            setError('Musisz być zalogowany, aby utworzyć lekcję');
            return;
        }
        // Początek to start wybranego bloku, koniec to:
        // - jeśli użytkownik dodał dodatkowy blok – koniec tego bloku,
        // - inaczej koniec wybranego bloku
        const startTimeStr = selectedBlock.start;
        const endTimeStr = selectedAdjacentBlock ? selectedAdjacentBlock.end : selectedBlock.end;
        const [startHour, startMinute] = startTimeStr.split(':').map(Number);
        const [endHour, endMinute] = endTimeStr.split(':').map(Number);
        const start = startHour * 60 + startMinute;
        const end = endHour * 60 + endMinute;
        const duration = end - start;
        if (duration < 45) {
            setError('Czas trwania lekcji musi wynosić co najmniej 45 minut');
            return;
        }
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
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
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

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Left column - Calendar */}
                    <div className="space-y-6">
                        <div className="border border-gray-200 rounded-lg p-4">
                            <h3 className="flex items-center gap-2 text-base font-semibold text-gray-800 mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                Wybierz termin
                            </h3>

                            {loadingAvailability && !selectedDay && (
                                <div className="flex justify-center items-center py-3">
                                    <svg className="animate-spin h-5 w-5 text-indigo-600 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span className="text-sm text-gray-600">Ładowanie dostępności...</span>
                                </div>
                            )}

                            {/* Custom CSS for properly styled calendar days */}
                            <style jsx>{`
                                /* Base day styling */
                                .rdp-day {
                                    position: relative;
                                    border-radius: 6px;
                                }

                                /* Available day styling - grey background with spacing */
                                .rdp-day.rdp-day_available:not(.rdp-day_selected)::before {
                                    content: "";
                                    position: absolute;
                                    top: 3px;
                                    left: 3px;
                                    right: 3px;
                                    bottom: 3px;
                                    background-color: #f3f4f6;
                                    border-radius: 6px;
                                    z-index: -1;
                                }

                                /* Selected day styling - ONLY indigo background */
                                .rdp-day.rdp-day_selected {
                                    background-color: #4f46e5;
                                    color: white;
                                    border: none;
                                    border-radius: 6px;
                                }

                                /* Today styling - indigo rounded border */
                                .rdp-day.rdp-day_today:not(.rdp-day_selected) {
                                    border: 2px solid #c7d2fe;
                                    border-radius: 6px;
                                }
                            `}</style>

                            <DayPicker
                                mode="single"
                                weekStartsOn={1}
                                selected={selectedDay}
                                onSelect={handleDaySelect}
                                locale={pl}
                                disabled={[
                                    // Disable dates before today
                                    {before: new Date()},
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
                                    selected: 'rdp-day_selected',
                                    today: 'rdp-day_today',
                                    disabled: 'text-gray-400 cursor-not-allowed',
                                    available: 'rdp-day_available font-medium text-gray-800',
                                }}
                                className="mx-auto [--rdp-cell-size:40px]"
                            />
                        </div>

                        {selectedDay && (
                            <div className="border border-gray-200 rounded-lg p-4">
                                <h3 className="flex items-center gap-2 text-base font-semibold text-gray-800 mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Wybierz godziny
                                </h3>

                                {renderBlockSelection()}
                                {startTime && endTime && (
                                    <div className="mt-4 space-y-2">
                                        <div className="text-sm text-gray-600">
                                            Zaplanowana lekcja: {lessonDuration} minut
                                        </div>
                                        {tutor?.price && (
                                            <div className="flex items-center text-sm font-medium text-indigo-600">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                Cena lekcji: {formatUtils.formatPrice(totalPrice)} ({formatUtils.formatPrice(tutor.price)} / godzina)
                                            </div>
                                        )}
                                    </div>
                                )}
                                {selectedBlock && (
                                    <div className="mt-4 space-y-2">
                                        <div className="text-sm text-gray-600">
                                            Zaplanowana lekcja: {lessonDuration} minut
                                        </div>
                                        {tutor?.price && (
                                            <div className="flex items-center text-sm font-medium text-indigo-600">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
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
                        <div className="border border-gray-200 rounded-lg p-4">
                            <h3 className="flex items-center gap-2 text-base font-semibold text-gray-800 mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
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
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
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
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
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
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        placeholder="Opisz czego dotyczy lekcja, cele, pytania..."
                                        rows={4}
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={!selectedDay || !selectedBlock || !title || !subject || !level}
                            className="btn inline-flex items-center justify-center w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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