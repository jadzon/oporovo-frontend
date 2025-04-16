import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { pl } from 'date-fns/locale';
import { modalDataService } from '../api/modalDataService';
import { useModal } from '../core/useModal';
import ModalHeader from '../components/ModalHeader';
import ModalSection from '../components/ModalSection';
import ModalActions from '../components/ModalActions';
import ProfileCard from '../components/ProfileCard';
import LoadingState from '../components/LoadingState';
import { Icon } from '../../../utils/Icon.jsx';
import { formatUtils, timeUtils } from '../../../utils';

const ScheduleFormView = ({ tutorId }) => {
    const { changeView, showLessonCreatedConfirmation, closeModal, openLessonModal } = useModal();
    const currentUser = useSelector((state) => state.auth.user);

    // Tutor data state
    const [tutor, setTutor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Form state
    const [currentStep, setCurrentStep] = useState('form'); // 'form', 'confirmation'
    const [selectedDay, setSelectedDay] = useState(null);
    const [selectedBlock, setSelectedBlock] = useState(null);
    const [selectedAdjacentBlock, setSelectedAdjacentBlock] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [subject, setSubject] = useState('');
    const [level, setLevel] = useState('');
    const [submitting, setSubmitting] = useState(false);

    // Availability state
    const [availableSlots, setAvailableSlots] = useState([]);
    const [availableDates, setAvailableDates] = useState([]);
    const [loadingAvailability, setLoadingAvailability] = useState(false);
    const [availabilityError, setAvailabilityError] = useState(null);
    const [allMonthlySlots, setAllMonthlySlots] = useState([]);
    const [dailyAvailableMinutes, setDailyAvailableMinutes] = useState(0);

    // Lesson details from form data
    const [lessonDetails, setLessonDetails] = useState(null);

    // Fetch tutor data
    useEffect(() => {
        const fetchTutorData = async () => {
            try {
                setLoading(true);
                const tutorData = await modalDataService.getTutor(tutorId);
                setTutor(tutorData);

                // Set default subject and level
                if (tutorData?.subjects?.length > 0) {
                    setSubject(tutorData.subjects[0]);
                }
                if (tutorData?.levels?.length > 0) {
                    setLevel(tutorData.levels[0]);
                }

                setError(null);
            } catch (err) {
                console.error('Error fetching tutor:', err);
                setError('Nie udało się załadować danych nauczyciela.');
            } finally {
                setLoading(false);
            }
        };

        if (tutorId) {
            fetchTutorData();
        }
    }, [tutorId]);

    // Fetch availability for the current month
    useEffect(() => {
        if (tutor?.id) {
            fetchMonthAvailability();
        }
    }, [tutor?.id]);

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

            const availability = await modalDataService.getTutorAvailability(tutor.id, startDate, endDate);

            // Filter out dates in the past
            const todayStr = today.toISOString().split('T')[0];
            const todayDate = new Date(todayStr);

            if (availability && Array.isArray(availability.available_slots)) {
                // Store all monthly slots for filtering later
                setAllMonthlySlots(availability.available_slots);

                // First, group slots by date
                const slotsByDate = {};
                availability.available_slots.forEach((slot) => {
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
                setAvailableDates(datesWithSufficientAvailability.map((dateStr) => new Date(dateStr)));
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

            const filteredSlots = allMonthlySlots.filter((slot) => {
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

    // Handler for day selection that also resets time fields
    const handleDaySelect = (day) => {
        // Reset time selections when day changes
        setSelectedBlock(null);
        setSelectedAdjacentBlock(null);

        // Update selected day
        setSelectedDay(day);
    };

    // Calculate duration and price based on selected blocks
    useEffect(() => {
        if (selectedBlock) {
            const startMins = selectedBlock.startMins;
            const endMins = selectedAdjacentBlock ? selectedAdjacentBlock.endMins : selectedBlock.endMins;

            // Create lessonDetails object for preview/submit
            if (selectedDay) {
                const startDate = new Date(selectedDay);
                startDate.setHours(Math.floor(startMins / 60), startMins % 60, 0, 0);

                const endDate = new Date(selectedDay);
                endDate.setHours(Math.floor(endMins / 60), endMins % 60, 0, 0);

                const duration = endMins - startMins;
                const calculatedPrice = tutor?.price ? tutor.price * (duration / 60) : 0;

                setLessonDetails({
                    tutor_id: tutor.id,
                    student_ids: [currentUser?.id],
                    title: title || `Lekcja z ${tutor.first_name}`,
                    description,
                    subject,
                    level,
                    start_time: startDate.toISOString(),
                    end_time: endDate.toISOString(),
                    tutor_name: `${tutor.first_name} ${tutor.last_name}`,
                    formatted_start: formatUtils.formatDateTime(startDate),
                    formatted_end: formatUtils.formatDateTime(endDate),
                    duration,
                    hourly_rate: tutor?.price || 0,
                    total_price: calculatedPrice
                });
            }
        } else {
            setLessonDetails(null);
        }
    }, [
        selectedBlock,
        selectedAdjacentBlock,
        selectedDay,
        tutor,
        title,
        description,
        subject,
        level,
        currentUser
    ]);

    const getInitialBlockOptions = () => {
        if (!selectedDay || availableSlots.length === 0) return [];
        const options = [];
        availableSlots.forEach((slot) => {
            if (!slot.start_time || !slot.end_time) return;
            const [slotStartHour, slotStartMin] = slot.start_time.split(':').map(Number);
            const [slotEndHour, slotEndMin] = slot.end_time.split(':').map(Number);
            const slotStart = slotStartHour * 60 + slotStartMin;
            const slotEnd = slotEndHour * 60 + slotEndMin;
            // Generate 30-minute blocks, but only if full 45-minute block fits in the slot
            for (let time = slotStart; time + 45 <= slotEnd; time += 30) {
                const hStart = String(Math.floor(time / 60)).padStart(2, '0');
                const mStart = String(time % 60).padStart(2, '0');
                const hEnd = String(Math.floor((time + 45) / 60)).padStart(2, '0');
                const mEnd = String((time + 45) % 60).padStart(2, '0');
                options.push({
                    start: `${hStart}:${mStart}`,
                    end: `${hEnd}:${mEnd}`,
                    startMins: time,
                    endMins: time + 45,
                });
            }
        });

        const uniqueOptions = options.filter(
            (opt, index, self) => index === self.findIndex((o) => o.start === opt.start && o.end === opt.end),
        );
        return uniqueOptions.sort((a, b) => a.startMins - b.startMins);
    };

    const getAdjacentBlockOption = () => {
        if (!selectedBlock) return null;
        const adjacentStartMins = selectedBlock.endMins;
        const adjacentEndMins = adjacentStartMins + 45;
        let isValid = false;
        availableSlots.forEach((slot) => {
            if (!slot.start_time || !slot.end_time) return;
            const [sHour, sMin] = slot.start_time.split(':').map(Number);
            const [eHour, eMin] = slot.end_time.split(':').map(Number);
            const slotStart = sHour * 60 + sMin;
            const slotEnd = eHour * 60 + eMin;
            // Check if additional block fits in available slots
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
            start: `${h}:${m}`,
            end: `${hEnd}:${mEnd}`,
            startMins: adjacentStartMins,
            endMins: adjacentEndMins,
        };
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        if (e) e.preventDefault();

        // Validate form
        if (!lessonDetails) {
            setError('Uzupełnij wszystkie wymagane pola');
            return;
        }

        // Go to confirmation step
        setCurrentStep('confirmation');
    };

    // Handle confirmation and creation of lesson
    const handleConfirmation = async () => {
        try {
            setSubmitting(true);
            // Create the lesson
            const createdLesson = await modalDataService.createLesson(lessonDetails);

            // Show success message and close modal
            showLessonCreatedConfirmation({
                ...createdLesson,
                lessonObject: createdLesson,
                showViewDetailsButton: true
            });

            // Optionally, navigate to the lesson details
            setTimeout(() => {
                if (createdLesson && createdLesson.id) {
                    openLessonModal(createdLesson.id);
                }
            }, 1500);
        } catch (err) {
            console.error('Error creating lesson:', err);
            setError(err.response?.data?.error || 'Wystąpił błąd podczas tworzenia lekcji');
            setCurrentStep('form'); // Go back to form on error
        } finally {
            setSubmitting(false);
        }
    };

    // Helper to render time blocks selection UI
    const renderBlockSelection = () => {
        // Information that blocks are 45 minutes long
        const blockInfo = <p className="text-xs text-gray-500 mb-3">Każdy blok trwa 45 minut</p>;

        // If no block is selected yet, render all available options
        if (!selectedBlock) {
            const options = getInitialBlockOptions();
            if (options.length === 0) {
                return <div className="text-sm text-amber-600 mt-4">Brak dostępnych bloków na ten dzień.</div>;
            }
            return (
                <div className="mt-4">
                    {blockInfo}
                    <div className="flex flex-wrap gap-3">
                        {options.map((block, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    setSelectedBlock(block);
                                    setSelectedAdjacentBlock(null); // reset on new selection
                                }}
                                className="px-4 py-1.5 border border-gray-200 rounded-md text-sm text-gray-700 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-colors"
                            >
                                {block.start}
                            </button>
                        ))}
                    </div>
                </div>
            );
        } else {
            // Show a summary card when a main block is selected
            return (
                <div className="mt-4">
                    {blockInfo}
                    <ModalSection className="border border-gray-200">
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="text-sm font-medium text-gray-800">Wybrany blok</h4>
                            <button
                                onClick={() => {
                                    setSelectedBlock(null);
                                    setSelectedAdjacentBlock(null);
                                }}
                                className="text-xs text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                            >
                                Zmień wybór
                            </button>
                        </div>
                        <div>
                            <p className="text-sm text-gray-700">
                                <span className="font-medium">Blok podstawowy:</span> {selectedBlock.start} - {selectedBlock.end}
                            </p>
                        </div>
                        {getAdjacentBlockOption() ? (
                            <div className="mt-3">
                                {selectedAdjacentBlock ? (
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm text-gray-700">
                                            <span className="font-medium">Dodatkowy blok:</span> {selectedAdjacentBlock.start} -{" "}
                                            {selectedAdjacentBlock.end}
                                        </p>
                                        <button
                                            onClick={() => setSelectedAdjacentBlock(null)}
                                            className="text-xs text-red-600 hover:text-red-700 transition-colors"
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
                                        className="w-full mt-3 py-1.5 px-3 bg-black hover:bg-gray-800 text-white text-sm font-medium rounded-full transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Icon name="clock" className="h-4 w-4" />
                                        <span>Dodaj blok ({getAdjacentBlockOption().start})</span>
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="mt-3 text-xs text-gray-600">Nie można przedłużyć lekcji – dostępny czas nie pozwala.</div>
                        )}
                    </ModalSection>
                </div>
            );
        }
    };

    // Helper to render availability status for selected day
    const renderAvailabilityInfo = () => {
        if (loadingAvailability) {
            return (
                <div className="mt-2 text-sm text-gray-600 flex items-center">
                    <svg
                        className="animate-spin h-4 w-4 mr-2 text-blue-600"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                    </svg>
                    Ładowanie dostępności...
                </div>
            );
        }

        if (availabilityError) {
            return (
                <div className="mt-2 text-sm text-red-600 flex items-center">
                    <Icon name="x-circle" className="h-4 w-4 mr-1.5" />
                    {availabilityError}
                </div>
            );
        }

        if (availableSlots.length === 0 && selectedDay) {
            return (
                <div className="mt-2 text-sm text-amber-600 flex items-center">
                    <Icon name="info" className="h-4 w-4 mr-1.5" />
                    Brak dostępnych terminów na ten dzień.
                </div>
            );
        }

        if (availableSlots.length > 0) {
            const hours = Math.floor(dailyAvailableMinutes / 60);
            const minutes = dailyAvailableMinutes % 60;

            return (
                <div className="mt-2 text-sm text-green-600 flex items-center">
                    <Icon name="check-circle" className="h-4 w-4 mr-1.5" />
                    Dostępność: {hours > 0 ? `${hours} godz. ` : ""}
                    {minutes > 0 ? `${minutes} min.` : ""}
                    {dailyAvailableMinutes < 45 && (
                        <span className="block text-amber-600 mt-1 ml-2">
              Uwaga: Dostępny czas jest krótszy niż wymagane 45 minut.
            </span>
                    )}
                </div>
            );
        }

        return null;
    };

    // Render form view
    const renderFormView = () => {
        // Subject options based on tutor's specializations
        const subjectOptions = tutor?.subjects?.length ? tutor.subjects : ["Matematyka", "Fizyka", "Informatyka"];

        // Level options based on tutor's teaching levels
        const levelOptions = tutor?.levels?.length ? tutor.levels : ["Podstawówka", "Liceum", "Studia"];

        return (
            <>
                {/*<ModalHeader title={`Zaplanuj lekcję z ${tutor.first_name}`} />*/}

                <div className="flex-1 overflow-y-auto bg-gray-50">
                    <div></div>
                    <div className="text-center my-6">
                        <p className="text-sm text-gray-600">{`Zaplanuj lekcję z ${tutor.first_name}`}</p>
                    </div>
                    <div className="p-4">
                        {error && (
                            <div
                                className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2 mb-4">
                                <Icon name="x-circle" className="h-5 w-5 flex-shrink-0"/>
                                <p className="text-sm">{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Left column - Calendar */}
                                <div className="space-y-4">
                                    <ModalSection title="Wybierz termin" icon="calendar" variant="card">
                                        {loadingAvailability && !selectedDay && (
                                            <div className="flex justify-center items-center py-3">
                                                <svg
                                                    className="animate-spin h-5 w-5 text-blue-600 mr-2"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <circle
                                                        className="opacity-25"
                                                        cx="12"
                                                        cy="12"
                                                        r="10"
                                                        stroke="currentColor"
                                                        strokeWidth="4"
                                                    ></circle>
                                                    <path
                                                        className="opacity-75"
                                                        fill="currentColor"
                                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                    ></path>
                                                </svg>
                                                <span className="text-sm text-gray-600">Ładowanie dostępności...</span>
                                            </div>
                                        )}

                                        {/* Custom CSS for properly styled calendar days */}
                                        <style jsx>{`
                                            /* Available day styling */
                                            .rdp-day.rdp-day_available:not(.rdp-day_selected)::before {
                                                content: "";
                                                position: absolute;
                                                top: 3px;
                                                left: 3px;
                                                right: 3px;
                                                bottom: 3px;
                                                background-color: #f5f5f5;
                                                border-radius: 6px;
                                                z-index: -1;
                                            }

                                            /* Selected day styling */
                                            .rdp-day.rdp-day_selected {
                                                background-color: #000000;
                                                color: white;
                                                border-radius: 6px;
                                            }

                                            /* Today styling */
                                            .rdp-day.rdp-day_today:not(.rdp-day_selected) {
                                                border: 2px solid #666666;
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
                                                    return !availableDates.some(
                                                        (availableDate) =>
                                                            availableDate.getDate() === date.getDate() &&
                                                            availableDate.getMonth() === date.getMonth() &&
                                                            availableDate.getFullYear() === date.getFullYear(),
                                                    );
                                                },
                                            ]}
                                            modifiers={{
                                                available: availableDates,
                                            }}
                                            modifiersClassNames={{
                                                selected: "rdp-day_selected",
                                                today: "rdp-day_today",
                                                disabled: "text-gray-400 cursor-not-allowed",
                                                available: "rdp-day_available font-medium text-gray-800",
                                            }}
                                            className="mx-auto [--rdp-cell-size:40px]"
                                        />

                                        {renderAvailabilityInfo()}
                                    </ModalSection>

                                    {selectedDay && (
                                        <ModalSection title="Wybierz godziny" icon="clock" variant="card">
                                            {renderBlockSelection()}

                                            {selectedBlock && lessonDetails && (
                                                <div className="mt-4 space-y-2">
                                                    <div className="flex justify-between items-center text-sm">
                                                        <span className="text-gray-600">Zaplanowana lekcja:</span>
                                                        <span
                                                            className="font-medium text-gray-800">{lessonDetails.duration} minut</span>
                                                    </div>
                                                    {tutor?.price && (
                                                        <div className="flex justify-between items-center text-sm">
                                                            <span className="text-gray-600">Cena lekcji:</span>
                                                            <span
                                                                className="font-medium text-black">{formatUtils.formatPrice(lessonDetails.total_price)}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </ModalSection>
                                    )}
                                </div>

                                {/* Right column - Form Details */}
                                <div className="space-y-4">
                                    <ModalSection title="Szczegóły lekcji" icon="edit" variant="card">
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
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                                                    placeholder={`Lekcja z ${tutor?.first_name || ''}`}
                                                    required
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label htmlFor="subject"
                                                           className="block text-sm font-medium text-gray-700 mb-1">
                                                        Przedmiot*
                                                    </label>
                                                    <select
                                                        id="subject"
                                                        value={subject}
                                                        onChange={(e) => setSubject(e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
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
                                                    <label htmlFor="level"
                                                           className="block text-sm font-medium text-gray-700 mb-1">
                                                        Poziom*
                                                    </label>
                                                    <select
                                                        id="level"
                                                        value={level}
                                                        onChange={(e) => setLevel(e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
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
                                                <label htmlFor="description"
                                                       className="block text-sm font-medium text-gray-700 mb-1">
                                                    Opis lekcji
                                                </label>
                                                <textarea
                                                    id="description"
                                                    value={description}
                                                    onChange={(e) => setDescription(e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                                                    placeholder="Opisz czego dotyczy lekcja, cele, pytania..."
                                                    rows={4}
                                                />
                                            </div>
                                        </div>
                                    </ModalSection>

                                    <ModalSection title="Prowadzący" icon="user" variant="card">
                                        <ProfileCard
                                            profile={tutor}
                                            role="tutor"
                                            showHoverCard={false}
                                        />
                                    </ModalSection>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                <ModalActions
                    primaryAction={{
                        label: "Dalej",
                        icon: "check",
                        onClick: handleSubmit,
                        disabled: !lessonDetails || !title || !subject || !level
                    }}
                    secondaryAction={{
                        label: "Anuluj",
                        onClick: closeModal
                    }}
                />
            </>
        );
    };

    // Render confirmation view
    const renderConfirmationView = () => {
        if (!lessonDetails) return null;

        return (
            <>
                {/*<ModalHeader*/}
                {/*    title="Potwierdź szczegóły lekcji"*/}
                {/*    showBackButton={true}*/}
                {/*/>*/}

                <div className="flex-1 overflow-y-auto bg-gray-50">
                    <div className="p-4">
                        <div className="text-center mb-6">
                            <p className="text-sm text-gray-600">Sprawdź, czy wszystko się zgadza przed utworzeniem lekcji</p>
                        </div>

                        {error && (
                            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2 mb-4">
                                <Icon name="x-circle" className="h-5 w-5 flex-shrink-0" />
                                <p className="text-sm">{error}</p>
                            </div>
                        )}

                        <ModalSection title="Szczegóły lekcji" icon="info" variant="card">
                            <div className="divide-y divide-gray-100">
                                <div className="py-2.5 grid grid-cols-3">
                                    <span className="text-sm text-gray-500">Tytuł</span>
                                    <span className="col-span-2 text-sm font-medium text-gray-800">{lessonDetails.title}</span>
                                </div>
                                {lessonDetails.description && (
                                    <div className="py-2.5 grid grid-cols-3">
                                        <span className="text-sm text-gray-500">Opis</span>
                                        <span className="col-span-2 text-sm text-gray-700">{lessonDetails.description}</span>
                                    </div>
                                )}

                                <div className="py-2.5 grid grid-cols-3">
                                    <span className="text-sm text-gray-500">Nauczyciel</span>
                                    <span className="col-span-2 text-sm font-medium text-gray-800">{lessonDetails.tutor_name}</span>
                                </div>

                                <div className="py-2.5 grid grid-cols-3">
                                    <span className="text-sm text-gray-500">Przedmiot</span>
                                    <span className="col-span-2 text-sm font-medium text-gray-800">{lessonDetails.subject}</span>
                                </div>

                                <div className="py-2.5 grid grid-cols-3">
                                    <span className="text-sm text-gray-500">Poziom</span>
                                    <span className="col-span-2 text-sm font-medium text-gray-800">{lessonDetails.level}</span>
                                </div>

                                <div className="py-2.5 grid grid-cols-3">
                                    <span className="text-sm text-gray-500">Data</span>
                                    <span className="col-span-2 text-sm font-medium text-gray-800">
                    {formatUtils.formatDate(lessonDetails.start_time)}
                  </span>
                                </div>

                                <div className="py-2.5 grid grid-cols-3">
                                    <span className="text-sm text-gray-500">Czas rozpoczęcia</span>
                                    <span className="col-span-2 text-sm font-medium text-gray-800">
                    {formatUtils.formatTime(lessonDetails.start_time)}
                  </span>
                                </div>

                                <div className="py-2.5 grid grid-cols-3">
                                    <span className="text-sm text-gray-500">Czas zakończenia</span>
                                    <span className="col-span-2 text-sm font-medium text-gray-800">
                    {formatUtils.formatTime(lessonDetails.end_time)}
                  </span>
                                </div>

                                <div className="py-2.5 grid grid-cols-3">
                                    <span className="text-sm text-gray-500">Czas trwania</span>
                                    <span className="col-span-2 text-sm font-medium text-gray-800">{lessonDetails.duration} minut</span>
                                </div>

                                {lessonDetails.hourly_rate > 0 && (
                                    <>


                                        <div className="py-2.5 grid grid-cols-3">
                                            <span className="text-sm text-gray-500">Cena lekcji</span>
                                            <span className="col-span-2 text-sm font-medium text-black">
                        {formatUtils.formatPrice(lessonDetails.total_price)}
                      </span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </ModalSection>
                    </div>
                </div>

                <ModalActions
                    primaryAction={{
                        label: submitting ? "Tworzenie lekcji..." : "Utwórz lekcję",
                        icon: "check",
                        onClick: handleConfirmation,
                        disabled: submitting
                    }}
                    secondaryAction={{
                        label: "Wróć do edycji",
                        onClick: () => setCurrentStep('form')
                    }}
                />
            </>
        );
    };

    // Main render
    if (loading) {
        return (
            <div className="flex flex-col h-full">
                <ModalHeader title="Zaplanuj lekcję" />
                <LoadingState message="Ładowanie danych nauczyciela..." />
            </div>
        );
    }

    if (error && !tutor) {
        return (
            <div className="flex flex-col h-full">
                <ModalHeader title="Zaplanuj lekcję" />
                <div className="flex flex-col items-center justify-center flex-1 p-6">
                    <div className="text-red-500 mb-4">
                        <Icon name="x-circle" className="h-12 w-12 mx-auto" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Wystąpił błąd</h3>
                    <p className="text-gray-600 text-center">{error}</p>
                </div>
            </div>
        );
    }

    if (!tutor) {
        return (
            <div className="flex flex-col h-full">
                <ModalHeader title="Zaplanuj lekcję" />
                <div className="flex flex-col items-center justify-center flex-1 p-6">
                    <p className="text-gray-600">Nie znaleziono nauczyciela.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            {currentStep === 'form' ? renderFormView() : renderConfirmationView()}
        </div>
    );
};

export default ScheduleFormView;