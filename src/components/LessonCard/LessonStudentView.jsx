import ProfileHoverCard from "../profileHoverCard/ProfileHoverCard.jsx";
import MiniUserCard from "../profile/MiniUserCard.jsx";

const LessonStudentView = ({tutor, onInfoClick})=>{

    const handleScheduleLesson = ()=>{
        console.log("Schedule Lesson");
    }
    const handleSendMessage = ()=>{
        console.log("Send message");
    }
    return(
        <div className="px-4 py-3 border-t border-gray-200 bg-white bg-opacity-80 flex items-center justify-between absolute bottom-0 left-0 w-full">
            <div className="flex-1">
                <div className="text-xs text-gray-600 mb-1.5">Prowadzący:</div>
                <ProfileHoverCard
                    userId={tutor?.id}
                    userData={tutor}
                    placement="right"
                    onScheduleLesson={handleScheduleLesson}
                    onSendMessage={handleSendMessage}
                >
                    <div className="flex items-center hover:bg-gray-200 rounded-lg p-1.5 cursor-pointer">
                        <div
                            className="w-8 h-8 mr-2 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
                            <img
                                src={tutor.avatar}
                                alt={tutor.username}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div>
                            <div className="text-xs font-medium text-gray-800">
                                {`${tutor.first_name} ${tutor.last_name}`}
                            </div>
                            <div className="text-xs text-gray-600">@{tutor.username || "nauczyciel"}</div>
                        </div>
                    </div>
                </ProfileHoverCard>
            </div>
            <button
                className="btn ml-2 px-3 py-1.5 text-xs font-medium text-gray-800 bg-white hover:bg-gray-100 rounded-full transition-colors border border-gray-200"
                onClick={() => onInfoClick()}
            >
                Szczegóły
            </button>
        </div>
    )
}
export default LessonStudentView;