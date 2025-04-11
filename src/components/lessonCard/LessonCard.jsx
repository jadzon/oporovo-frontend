import { useSelector } from "react-redux"
import { Icon } from "../modal/index.js"
import { StatusBadge } from "../modal/index.js"
import ProfileHoverCard from "../profileHoverCard/ProfileHoverCard.jsx";

const LessonCard = ({ lesson, onInfoClick }) => {
    // Get user role from Redux store
    const { user } = useSelector((state) => state.auth)
    const isTutor = user?.role === "tutor"

    // Format start and end times
    const startTime = new Date(lesson.start_time)
    const endTime = new Date(lesson.end_time)
    const formattedDate = startTime.toLocaleDateString("pl-PL", {
        day: "numeric",
        month: "short",
    })
    const formattedStartTime = startTime.toLocaleTimeString("pl-PL", {
        hour: "2-digit",
        minute: "2-digit",
    })
    const formattedEndTime = endTime.toLocaleTimeString("pl-PL", {
        hour: "2-digit",
        minute: "2-digit",
    })

    // Calculate duration in minutes
    const durationMs = endTime - startTime
    const durationMinutes = Math.floor(durationMs / 60000)

    // Count students (only show for tutors)
    const studentCount = lesson.students?.length || 0
    const hasSingleStudent = studentCount === 1

    // Handlers for profile card actions
    const handleScheduleLesson = (person) => {
        console.log("Schedule lesson with:", person)
        // Tu możesz dodać logikę planowania lekcji
    }

    const handleSendMessage = (person) => {
        console.log("Send message to:", person)
        // Tu możesz dodać logikę wysyłania wiadomości
    }

    // Check if lesson is today
    const isToday = () => {
        const today = new Date()
        return (
            startTime.getDate() === today.getDate() &&
            startTime.getMonth() === today.getMonth() &&
            startTime.getFullYear() === today.getFullYear()
        )
    }

    return (
        <div className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden hover:bg-gray-50 transition-colors duration-200">
            {/* Status and date */}
            <div className="px-4 pt-3 pb-2 flex justify-between items-center">
                <StatusBadge status={lesson.status || "scheduled"} size="sm" />
                <span className="text-xs text-gray-500 font-medium">{isToday() ? "Dzisiaj" : formattedDate}</span>
            </div>

            {/* Lesson content section */}
            <div className="px-4 pb-3">
                <h2 className="text-base font-medium text-gray-900 mb-2">{lesson.title}</h2>

                {/* Subject and level tags */}
                <div className="flex flex-wrap items-center gap-2 mb-3">
                    {lesson.subject && (
                        <span className="text-xs px-2.5 py-1 bg-blue-50 text-blue-600 rounded-full">{lesson.subject}</span>
                    )}
                    {lesson.level && (
                        <span className="text-xs px-2.5 py-1 bg-amber-50 text-amber-600 rounded-full">{lesson.level}</span>
                    )}
                </div>

                {/* Time info */}
                <div className="flex items-center gap-3 text-xs text-gray-600">
                    <div className="flex items-center gap-1.5">
                        <Icon name="clock" className="h-3.5 w-3.5 text-gray-400" />
                        <span>
                            {formattedStartTime} - {formattedEndTime}
                        </span>
                    </div>

                    <span className="text-gray-300">|</span>

                    <div className="flex items-center gap-1.5">
                        <span>{durationMinutes} min</span>
                    </div>

                    {/* Show student count if there are students */}
                    {isTutor && (
                        <>
                            <span className="text-gray-300">|</span>
                            <div className="flex items-center gap-1.5">
                                <Icon name="users" className="h-3.5 w-3.5 text-gray-400" />
                                <span>
                                    {studentCount} {studentCount === 1 ? "uczeń" : studentCount < 5 ? "uczniów" : "uczniów"}
                                </span>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Person info - conditional display for tutor/student */}
            <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
                {isTutor ? (
                    // TUTOR VIEW - Show students
                    <div className="flex-1">
                        {studentCount === 0 ? (
                            // No students case
                            <div className="flex items-center">
                                <div className="w-8 h-8 mr-2 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200 flex items-center justify-center">
                                    <Icon name="user" className="h-4 w-4 text-gray-400" />
                                </div>
                                <div>
                                    <div className="text-xs text-gray-500 mb-0.5">Uczniowie:</div>
                                    <div className="text-xs text-gray-700">Brak zapisanych uczniów</div>
                                </div>
                            </div>
                        ) : hasSingleStudent ? (
                            // Single student case - use hover card
                            <div>
                                <div className="text-xs text-gray-500 mb-1.5">Uczeń:</div>
                                <ProfileHoverCard
                                    userId={lesson.students[0].id}
                                    userData={lesson.students[0]}
                                    placement="right"
                                    onSendMessage={handleSendMessage}
                                >
                                    <div className="flex items-center hover:bg-gray-100 rounded-lg p-1.5 cursor-pointer">
                                        <div className="w-8 h-8 mr-2 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
                                            <img
                                                src={lesson.students[0].avatar || "/images/default-avatar.png"}
                                                alt={lesson.students[0].username || "Uczeń"}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.src = "/images/default-avatar.png"
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <div className="text-xs font-medium text-gray-700">
                                                {lesson.students[0].first_name || lesson.students[0].username}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                @{lesson.students[0].username || "uczeń"}
                                            </div>
                                        </div>
                                    </div>
                                </ProfileHoverCard>
                            </div>
                        ) : (
                            // Multiple students display with better styling
                            <div>
                                <div className="text-xs text-gray-500 mb-1.5">Uczniowie:</div>
                                <div className="flex flex-wrap items-center">
                                    {/* Show first 2 students */}
                                    {lesson.students.slice(0, 2).map((student, index) => (
                                        <ProfileHoverCard
                                            key={student.id || index}
                                            userId={student.id}
                                            userData={student}
                                            placement="top"
                                            onSendMessage={handleSendMessage}
                                        >
                                            <div className="flex items-center mr-3 mb-1 hover:bg-gray-100 rounded-lg p-1 cursor-pointer">
                                                <div className="w-6 h-6 mr-1.5 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
                                                    <img
                                                        src={student.avatar || "/images/default-avatar.png"}
                                                        alt={student.username || "Uczeń"}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            e.target.src = "/images/default-avatar.png"
                                                        }}
                                                    />
                                                </div>
                                                <span className="text-xs font-medium text-gray-700">
                                                    {student.first_name || student.username}
                                                </span>
                                            </div>
                                        </ProfileHoverCard>
                                    ))}

                                    {/* Show +X for additional students */}
                                    {studentCount > 2 && (
                                        <div className="flex items-center">
                                            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-black font-medium text-xs mr-1.5 border border-gray-200">
                                                +{studentCount - 2}
                                            </div>
                                            <span className="text-xs text-gray-600">{studentCount > 3 ? "więcej" : ""}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    // STUDENT VIEW - Show tutor
                    <div className="flex-1">
                        <div className="text-xs text-gray-500 mb-1.5">Prowadzący:</div>
                        <ProfileHoverCard
                            userId={lesson.tutor?.id}
                            userData={lesson.tutor}
                            placement="right"
                            onScheduleLesson={handleScheduleLesson}
                            onSendMessage={handleSendMessage}
                        >
                            <div className="flex items-center hover:bg-gray-100 rounded-lg p-1.5 cursor-pointer">
                                <div className="w-8 h-8 mr-2 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
                                    <img
                                        src={lesson.tutor?.avatar || "/images/default-avatar.png"}
                                        alt={lesson.tutor?.username || "Nauczyciel"}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.src = "/images/default-avatar.png"
                                        }}
                                    />
                                </div>
                                <div>
                                    <div className="text-xs font-medium text-gray-700">
                                        {lesson.tutor?.first_name && lesson.tutor?.last_name
                                            ? `${lesson.tutor.first_name} ${lesson.tutor.last_name}`
                                            : lesson.tutor?.username || "Nieznany"}
                                    </div>
                                    <div className="text-xs text-gray-500">@{lesson.tutor?.username || "nauczyciel"}</div>
                                </div>
                            </div>
                        </ProfileHoverCard>
                    </div>
                )}

                {/* Action button */}
                <button
                    className="btn ml-2 px-3 py-1.5 text-xs font-medium text-black hover:bg-gray-50 rounded-full transition-colors hover:underline"
                    onClick={() => onInfoClick?.(lesson)}
                >
                    Szczegóły
                </button>
            </div>
        </div>
    )
}

export default LessonCard