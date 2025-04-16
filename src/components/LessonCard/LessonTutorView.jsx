import ProfileHoverCard from "../profileHoverCard/ProfileHoverCard.jsx";
import MiniUserCard from "../profile/MiniUserCard.jsx";
import { Icon } from "../modal/index.js";
import LessonStudentView from "./LessonStudentView.jsx";

const LessonTutorView = (students, onInfoClick) => {
    const studentCount = students?.length
    const handleSendMessage = ()=>{
        console.log("Send message");
    }
    return (
        <div className="px-4 py-3 border-t border-gray-200 bg-white bg-opacity-80 flex items-center justify-between">
            <div className="flex-1">
                {studentCount === 0 ? (
                    <div className="flex items-center">
                        <div
                            className="w-8 h-8 mr-2 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200 flex items-center justify-center">
                            <Icon name="user" className="h-4 w-4 text-gray-500"/>
                        </div>
                        <div>
                            <div className="text-xs text-gray-600 mb-0.5">Uczniowie:</div>
                            <div className="text-xs text-gray-800">Brak zapisanych uczniów</div>
                        </div>
                    </div>
                ) : studentCount === 1 ? (
                    <div>
                        <div className="text-xs text-gray-600 mb-1.5">Uczeń:</div>
                        <ProfileHoverCard
                            userId={students[0].id}
                            userData={students[0]}
                            placement="right"
                            onSendMessage={handleSendMessage}
                        >
                            <MiniUserCard user={students[0]} darkMode={false}/>
                        </ProfileHoverCard>
                    </div>
                ) : (
                    <div>
                        <div className="text-xs text-gray-600 mb-1.5">Uczniowie:</div>
                        <div className="flex flex-wrap items-center">
                            {/* Show first 2 students */}
                            {students.slice(0, 2).map((student, index) => (
                                <ProfileHoverCard
                                    key={student.id || index}
                                    userId={student.id}
                                    userData={student}
                                    placement="top"
                                    onSendMessage={handleSendMessage}
                                >
                                    <div
                                        className="flex items-center mr-3 mb-1 hover:bg-gray-200 rounded-lg p-1 cursor-pointer">
                                        <div
                                            className="w-6 h-6 mr-1.5 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
                                            <img
                                                src={student.avatar || "/images/default-avatar.png"}
                                                alt={student.username || "Uczeń"}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.src = "/images/default-avatar.png"
                                                }}
                                            />
                                        </div>
                                        <span className="text-xs font-medium text-gray-800">
                                                    {student.first_name || student.username}
                                                </span>
                                    </div>
                                </ProfileHoverCard>
                            ))}

                            {/* Show +X for additional students */}
                            {studentCount > 2 && (
                                <div className="flex items-center">
                                    <div
                                        className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-gray-800 font-medium text-xs mr-1.5 border border-gray-200">
                                        +{studentCount - 2}
                                    </div>
                                    <span
                                        className="text-xs text-gray-600">{studentCount > 3 ? "więcej" : ""}</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
            <button
                className="btn ml-2 px-3 py-1.5 text-xs font-medium text-gray-800 bg-white hover:bg-gray-100 rounded-full transition-colors border border-gray-200"
                onClick={() => onInfoClick}
            >
                Szczegóły
            </button>
        </div>
    )
}
export default LessonTutorView;