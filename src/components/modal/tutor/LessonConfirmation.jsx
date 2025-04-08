// components/modal/tutor/LessonConfirmation.jsx
import React from 'react';
import { motion } from 'framer-motion';
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
                            {formatUtils.formatDate(lessonData.start_time)}
                        </span>
                    </div>

                    <div className="py-3 grid grid-cols-3">
                        <span className="text-gray-500">Czas rozpoczęcia</span>
                        <span className="col-span-2 font-medium">
                            {formatUtils.formatTime(lessonData.start_time)}
                        </span>
                    </div>

                    <div className="py-3 grid grid-cols-3">
                        <span className="text-gray-500">Czas zakończenia</span>
                        <span className="col-span-2 font-medium">
                            {formatUtils.formatTime(lessonData.end_time)}
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
                                <span className="col-span-2 font-medium">{formatUtils.formatPrice(lessonData.hourly_rate)}</span>
                            </div>

                            <div className="py-3 grid grid-cols-3">
                                <span className="text-gray-500">Cena lekcji</span>
                                <span className="col-span-2 font-medium text-green-600">{formatUtils.formatPrice(lessonData.total_price)}</span>
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
                    onClick={onCancel}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                >
                    Wróć do edycji
                </button>

                <button
                    onClick={onConfirm}
                    className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
                >
                    Utwórz lekcję
                </button>
            </div>
        </motion.div>
    );
};

export default LessonConfirmation;