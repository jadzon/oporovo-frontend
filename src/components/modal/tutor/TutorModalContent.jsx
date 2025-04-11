"use client"

import { useState } from "react"
import { ProfileHeader } from "../shared/ProfileHeader"
import { TutorProfile } from "./TutorProfile"
import { LessonSchedulingForm } from "./LessonSchedulingForm"
import { LessonConfirmation } from "./LessonConfirmation"
import { useModal } from "../../../hooks/useModal"
import { lessonService } from "../../../api/services/lessonService"
import { ModalHeader } from "../shared/ModalHeader"

export const TutorModalContent = ({ tutor, onClose, hasHistory, goBack }) => {
    const { openLessonModal, openLessonCreatedConfirmation } = useModal()

    // Steps:
    // 1 = Detailed Profile
    // 2 = Schedule Lesson Form
    // 3 = Confirmation Screen
    // 4 = Processing (temporary during API call)
    const [step, setStep] = useState(1)
    const [lessonData, setLessonData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    // Handle creating a lesson (after confirmation)
    const handleCreateLesson = async () => {
        if (!lessonData) {
            setError("Brak danych lekcji")
            return
        }

        // Show processing state
        setLoading(true)
        setError(null)
        setStep(4)

        try {
            // Call the API to create the lesson
            const response = await lessonService.createLesson(lessonData)

            // Show success confirmation
            openLessonCreatedConfirmation({
                ...response.data,
                lessonObject: response.data, // Store the full lesson object for navigation
            })

            // Reset form and close modal
            resetForm()

            // Open the lesson modal to view the created lesson
            setTimeout(() => {
                openLessonModal(response.data)
            }, 500)
        } catch (err) {
            console.error("Error creating lesson:", err)
            setError(err.response?.data?.error || "Wystąpił błąd podczas tworzenia lekcji")
            // Go back to confirmation step
            setStep(3)
        } finally {
            setLoading(false)
        }
    }

    // Reset form fields
    const resetForm = () => {
        setLessonData(null)
        setError(null)
    }

    // Handle navigation between steps
    const handleBackNavigation = () => {
        if (step > 1) {
            // If we're in confirmation, go back to form
            if (step === 3) {
                setStep(2)
            } else {
                // Otherwise reset form and go to profile
                resetForm()
                setStep(1)
            }
        } else if (goBack) {
            goBack()
        }
    }

    // Get header title based on current step
    const getHeaderTitle = () => {
        switch (step) {
            case 1:
                return `${tutor?.first_name || ""} ${tutor?.last_name || ""}`
            case 2:
                return "Zaplanuj lekcję"
            case 3:
                return "Potwierdź szczegóły lekcji"
            case 4:
                return "Tworzenie lekcji..."
            default:
                return "Nauczyciel"
        }
    }

    return (
        <div className="flex flex-col h-full bg-white">
            {/* Header */}
            <ModalHeader
                title={getHeaderTitle()}
                onClose={onClose}
                hasHistory={hasHistory || step > 1}
                goBack={handleBackNavigation}
            />

            {/* Profile header - shown in all steps for context */}
            <ProfileHeader profile={tutor} rating={tutor?.rating} showPrice={true} />

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto bg-gray-50">
                {/* STEP 1: Tutor Profile */}
                {step === 1 && (
                    <TutorProfile tutor={tutor} onScheduleLesson={() => setStep(2)} onViewLesson={openLessonModal} />
                )}

                {/* STEP 2: Lesson Form */}
                {step === 2 && (
                    <LessonSchedulingForm
                        tutor={tutor}
                        error={error}
                        setError={setError}
                        onFormSubmit={(data) => {
                            setLessonData(data)
                            setStep(3)
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
                    <div className="flex flex-col items-center justify-center p-8">
                        <div className="text-center">
                            <div className="flex justify-center mb-4">
                                <svg
                                    className="animate-spin h-12 w-12 text-blue-600"
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
                            </div>
                            <h3 className="text-xl font-medium text-gray-800">Trwa tworzenie lekcji</h3>
                            <p className="text-gray-600 mt-2">Proszę czekać, przetwarzamy Twoje zgłoszenie...</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
