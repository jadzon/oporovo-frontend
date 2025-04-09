// components/modal/tutor/LessonConfirmation.jsx
import React from 'react';
import { formatUtils } from '../utils';

/**
 * Component for confirming lesson details before creation
 */
const LessonConfirmation = ({
                                lessonData,
                                error,
                                onCancel,
                                onConfirm
                            }) => {
    if (!lessonData) return null;

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
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

            <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-base font-semibold text-gray-800 mb-4">Szczegóły lekcji</h3>

                <div className="divide-y divide-gray-100">
                    <div className="py-3 grid grid-cols-3">
                        <span className="text-gray-500">Tytuł</span>
                        <span className="col-span-2 font-medium text-gray-800">{lessonData.title}</span>
                    </div>

                    <div className="py-3 grid grid-cols-3">
                        <span className="text-gray-500">Nauczyciel</span>
                        <span className="col-span-2 font-medium text-gray-800">{lessonData.tutor_name}</span>
                    </div>

                    <div className="py-3 grid grid-cols-3">
                        <span className="text-gray-500">Przedmiot</span>
                        <span className="col-span-2 font-medium text-gray-800">{lessonData.subject}</span>
                    </div>

                    <div className="py-3 grid grid-cols-3">
                        <span className="text-gray-500">Poziom</span>
                        <span className="col-span-2 font-medium text-gray-800">{lessonData.level}</span>
                    </div>

                    <div className="py-3 grid grid-cols-3">
                        <span className="text-gray-500">Data</span>
                        <span className="col-span-2 font-medium text-gray-800">
                            {formatUtils.formatDate(lessonData.start_time)}
                        </span>
                    </div>

                    <div className="py-3 grid grid-cols-3">
                        <span className="text-gray-500">Czas rozpoczęcia</span>
                        <span className="col-span-2 font-medium text-gray-800">
                            {formatUtils.formatTime(lessonData.start_time)}
                        </span>
                    </div>

                    <div className="py-3 grid grid-cols-3">
                        <span className="text-gray-500">Czas zakończenia</span>
                        <span className="col-span-2 font-medium text-gray-800">
                            {formatUtils.formatTime(lessonData.end_time)}
                        </span>
                    </div>

                    <div className="py-3 grid grid-cols-3">
                        <span className="text-gray-500">Czas trwania</span>
                        <span className="col-span-2 font-medium text-gray-800">{lessonData.duration} minut</span>
                    </div>

                    {lessonData.hourly_rate > 0 && (
                        <>
                            <div className="py-3 grid grid-cols-3">
                                <span className="text-gray-500">Stawka za godzinę</span>
                                <span className="col-span-2 font-medium text-gray-800">{formatUtils.formatPrice(lessonData.hourly_rate)}</span>
                            </div>

                            <div className="py-3 grid grid-cols-3">
                                <span className="text-gray-500">Cena lekcji</span>
                                <span className="col-span-2 font-medium text-indigo-600">{formatUtils.formatPrice(lessonData.total_price)}</span>
                            </div>
                        </>
                    )}

                    {lessonData.description && (
                        <div className="py-3 grid grid-cols-3">
                            <span className="text-gray-500">Opis</span>
                            <span className="col-span-2 text-gray-700">{lessonData.description}</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <button
                    onClick={onCancel}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-medium transition-colors"
                >
                    Wróć do edycji
                </button>

                <button
                    onClick={onConfirm}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-medium transition-colors"
                >
                    Utwórz lekcję
                </button>
            </div>
        </div>
    );
};

export default LessonConfirmation;