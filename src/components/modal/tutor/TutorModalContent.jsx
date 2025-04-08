// components/modal/tutor/TutorModalContent.jsx
import React, { useState } from 'react';
import { FaArrowLeft, FaTimes } from 'react-icons/fa';
import { BiLoaderAlt } from 'react-icons/bi';
import { ProfileHeader } from '../shared';
import TutorProfile from './TutorProfile';
import LessonSchedulingForm from './LessonSchedulingForm';
import LessonConfirmation from './LessonConfirmation';
import { useModal } from '../../../hooks/useModal';
import { lessonService } from '../../../api/services/lessonService';

/**
 * Tutor modal container component that manages different steps
 */
const TutorModalContent = ({ tutor, onClose, hasHistory, goBack }) => {
    const { openLessonModal, openLessonCreatedConfirmation } = useModal();

    // Steps:
    // 1 = Detailed Profile
    // 2 = Schedule Lesson Form
    // 3 = Confirmation Screen
    // 4 = Processing (temporary during API call)
    const [step, setStep] = useState(1);
    const [lessonData, setLessonData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

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

    // Reset form fields
    const resetForm = () => {
        setLessonData(null);
        setError(null);
    };

    // Handle navigation between steps
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
            {/* Header */}
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

            {/* Profile header - shown in all steps for context */}
            <ProfileHeader
                profile={tutor}
                rating={tutor?.rating}
                showPrice={true}
            />

            {/* Content Area */}
            <div className="flex-1 overflow-auto p-6 space-y-8">
                {/* STEP 1: Tutor Profile */}
                {step === 1 && (
                    <TutorProfile
                        tutor={tutor}
                        onScheduleLesson={() => setStep(2)}
                        onViewLesson={openLessonModal}
                    />
                )}

                {/* STEP 2: Lesson Form */}
                {step === 2 && (
                    <LessonSchedulingForm
                        tutor={tutor}
                        error={error}
                        setError={setError}
                        onFormSubmit={(data) => {
                            setLessonData(data);
                            setStep(3);
                        }}
                    />
                )}

                {/* STEP 3: Confirmation */}
                {step === 3 && lessonData && (
                    <LessonConfirmation
                        lessonData={lessonData}
                        error={error}
                        onCancel={() => setStep(2)}
                        onConfirm={handleCreateLesson}
                    />
                )}

                {/* STEP 4: Processing */}
                {step === 4 && (
                    <div className="flex flex-col items-center justify-center h-full py-12">
                        <div className="text-center">
                            <div className="flex justify-center">
                                <BiLoaderAlt className="animate-spin text-6xl text-purple-600 mb-4" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900">Trwa tworzenie lekcji</h3>
                            <p className="text-gray-600 mt-2">Proszę czekać, przetwarzamy Twoje zgłoszenie...</p>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default TutorModalContent;