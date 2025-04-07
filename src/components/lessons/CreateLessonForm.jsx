// components/lessons/CreateLessonForm.jsx
import { useState } from 'react';
import { useModal } from '../../hooks/useModal';
import { lessonService } from '../../api/services/lessonService';

const CreateLessonForm = ({ tutorId, students, onSuccess }) => {
    const { openLessonCreatedConfirmation } = useModal();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Form state
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [selectedStudentIds, setSelectedStudentIds] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const lessonData = {
                tutor_id: tutorId,
                student_ids: selectedStudentIds.length > 0 ? selectedStudentIds : students.map(s => s.id),
                title,
                description,
                start_time: startTime,
                end_time: endTime
            };

            // Call the API to create the lesson
            const response = await lessonService.createLesson(lessonData);

            // Show confirmation modal
            openLessonCreatedConfirmation(response.data);

            // Reset form
            setTitle('');
            setDescription('');
            setStartTime('');
            setEndTime('');
            setSelectedStudentIds([]);

            // Call success callback if provided
            if (onSuccess) {
                onSuccess(response.data);
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to create lesson');
            console.error('Error creating lesson:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleStudentToggle = (studentId) => {
        setSelectedStudentIds(prev =>
            prev.includes(studentId)
                ? prev.filter(id => id !== studentId)
                : [...prev, studentId]
        );
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                    {error}
                </div>
            )}

            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
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

            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Opis lekcji
                </label>
                <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Opisz czego dotyczy lekcja"
                    rows={4}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
                        Czas rozpoczęcia*
                    </label>
                    <input
                        id="startTime"
                        type="datetime-local"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">
                        Czas zakończenia*
                    </label>
                    <input
                        id="endTime"
                        type="datetime-local"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                    />
                </div>
            </div>

            {students && students.length > 0 && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Wybierz uczestników
                    </label>
                    <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-2">
                        {students.map(student => (
                            <div key={student.id} className="flex items-center p-2 hover:bg-gray-50 rounded">
                                <input
                                    type="checkbox"
                                    id={`student-${student.id}`}
                                    checked={selectedStudentIds.includes(student.id)}
                                    onChange={() => handleStudentToggle(student.id)}
                                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                                />
                                <label htmlFor={`student-${student.id}`} className="ml-2 block text-sm text-gray-900">
                                    {student.first_name} {student.last_name}
                                </label>
                            </div>
                        ))}
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                        {selectedStudentIds.length === 0
                            ? "Jeśli nie wybierzesz uczestników, lekcja będzie dostępna dla wszystkich."
                            : `Wybrano ${selectedStudentIds.length} uczestników`}
                    </p>
                </div>
            )}

            <div className="pt-2">
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Tworzenie lekcji...' : 'Utwórz lekcję'}
                </button>
            </div>
        </form>
    );
};

export default CreateLessonForm;