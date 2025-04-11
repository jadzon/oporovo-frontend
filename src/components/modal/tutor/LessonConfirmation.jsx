"use client"
import { formatUtils } from "../utils"
import { Card } from "../shared/Card"
import { Icon } from "../shared/Icon"

export const LessonConfirmation = ({ lessonData, error, onCancel, onConfirm }) => {
    if (!lessonData) return null

    return (
        <div className="max-w-2xl mx-auto space-y-6 p-4">
            <div className="text-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Potwierdź szczegóły lekcji</h2>
                <p className="text-sm text-gray-600">Sprawdź, czy wszystko się zgadza przed utworzeniem lekcji</p>
            </div>

            {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2">
                    <Icon name="x-circle" className="h-5 w-5 flex-shrink-0" />
                    <p className="text-sm">{error}</p>
                </div>
            )}

            <Card title="Szczegóły lekcji" icon="info">
                <div className="divide-y divide-gray-100">
                    <div className="py-2.5 grid grid-cols-3">
                        <span className="text-sm text-gray-500">Tytuł</span>
                        <span className="col-span-2 text-sm font-medium text-gray-800">{lessonData.title}</span>
                    </div>

                    <div className="py-2.5 grid grid-cols-3">
                        <span className="text-sm text-gray-500">Nauczyciel</span>
                        <span className="col-span-2 text-sm font-medium text-gray-800">{lessonData.tutor_name}</span>
                    </div>

                    <div className="py-2.5 grid grid-cols-3">
                        <span className="text-sm text-gray-500">Przedmiot</span>
                        <span className="col-span-2 text-sm font-medium text-gray-800">{lessonData.subject}</span>
                    </div>

                    <div className="py-2.5 grid grid-cols-3">
                        <span className="text-sm text-gray-500">Poziom</span>
                        <span className="col-span-2 text-sm font-medium text-gray-800">{lessonData.level}</span>
                    </div>

                    <div className="py-2.5 grid grid-cols-3">
                        <span className="text-sm text-gray-500">Data</span>
                        <span className="col-span-2 text-sm font-medium text-gray-800">
              {formatUtils.formatDate(lessonData.start_time)}
            </span>
                    </div>

                    <div className="py-2.5 grid grid-cols-3">
                        <span className="text-sm text-gray-500">Czas rozpoczęcia</span>
                        <span className="col-span-2 text-sm font-medium text-gray-800">
              {formatUtils.formatTime(lessonData.start_time)}
            </span>
                    </div>

                    <div className="py-2.5 grid grid-cols-3">
                        <span className="text-sm text-gray-500">Czas zakończenia</span>
                        <span className="col-span-2 text-sm font-medium text-gray-800">
              {formatUtils.formatTime(lessonData.end_time)}
            </span>
                    </div>

                    <div className="py-2.5 grid grid-cols-3">
                        <span className="text-sm text-gray-500">Czas trwania</span>
                        <span className="col-span-2 text-sm font-medium text-gray-800">{lessonData.duration} minut</span>
                    </div>

                    {lessonData.hourly_rate > 0 && (
                        <>
                            <div className="py-2.5 grid grid-cols-3">
                                <span className="text-sm text-gray-500">Stawka za godzinę</span>
                                <span className="col-span-2 text-sm font-medium text-gray-800">
                  {formatUtils.formatPrice(lessonData.hourly_rate)}
                </span>
                            </div>

                            <div className="py-2.5 grid grid-cols-3">
                                <span className="text-sm text-gray-500">Cena lekcji</span>
                                <span className="col-span-2 text-sm font-medium text-black">
                  {formatUtils.formatPrice(lessonData.total_price)}
                </span>
                            </div>
                        </>
                    )}

                    {lessonData.description && (
                        <div className="py-2.5 grid grid-cols-3">
                            <span className="text-sm text-gray-500">Opis</span>
                            <span className="col-span-2 text-sm text-gray-700">{lessonData.description}</span>
                        </div>
                    )}
                </div>
            </Card>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                <button
                    onClick={onCancel}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 font-medium transition-colors text-sm"
                >
                    Wróć do edycji
                </button>

                <button
                    onClick={onConfirm}
                    className="px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-full font-medium transition-colors text-sm flex items-center justify-center gap-2"
                >
                    <Icon name="check" className="h-4 w-4" />
                    Utwórz lekcję
                </button>
            </div>
        </div>
    )
}
