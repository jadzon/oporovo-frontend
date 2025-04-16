import { Icon } from "../modal/index.js"
const LessonCardContent = ({title,subject,level,startTime, endTime,isTutor,studentCount }) => {
    const startTimeDate = new Date(startTime)
    const endTimeDate = new Date(endTime)
    const duration = Math.floor((new Date(endTime) - new Date(startTime)) / 60000)
    const formattedStartTime = startTimeDate.toLocaleTimeString("pl-PL", {
        hour: "2-digit",
        minute: "2-digit",
    })
    const formattedEndTime = endTimeDate.toLocaleTimeString("pl-PL", {
        hour: "2-digit",
        minute: "2-digit",
    })
    return (
        <div className="px-4 pb-3">
            <h2 className="text-base font-medium text-gray-800 bg-white bg-opacity-80 inline-block px-2 py-1 rounded mb-2">
                {title}
            </h2>

            {/* Subject and level tags with blue and amber colors */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
                {subject && (
                    <span className="text-xs px-2.5 py-1 bg-blue-50 text-blue-600 rounded-md">
                            {subject}
                        </span>
                )}
                {level && (
                    <span className="text-xs px-2.5 py-1 bg-amber-50 text-amber-600 rounded-md">
                            {level}
                        </span>
                )}
            </div>

            {/* Time info */}
            <div className="inline-block bg-white bg-opacity-80 text-gray-800 px-3 py-1.5 rounded">
                <div className="flex items-center gap-3 text-xs">
                    <div className="flex items-center gap-1.5">
                        <Icon name="clock" className="h-3.5 w-3.5 text-gray-600"/>
                        <span>
                                {formattedStartTime} - {formattedEndTime}
                            </span>
                    </div>

                    <span className="text-gray-500">|</span>

                    <div className="flex items-center gap-1.5">
                        <span>{duration} min</span>
                    </div>

                    {/* Show student count if there are students */}
                    {isTutor && (
                        <>
                            <span className="text-gray-500">|</span>
                            <div className="flex items-center gap-1.5">
                                <Icon name="users" className="h-3.5 w-3.5 text-gray-600"/>
                                <span>
                                        {studentCount} {studentCount === 1 ? "uczeń" :  "uczniów"}
                                    </span>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
export default LessonCardContent;