import { useSelector } from "react-redux"
import LessonStatusBadge from "./LessonStatusBadge.jsx";
import LessonDate from "./LessonDate.jsx";
import LessonStudentView from "./LessonStudentView.jsx";
import LessonTutorView from "./LessonTutorView.jsx";
import LessonCardContent from "./LessonCardContent.jsx";
const LessonCardTemp = ({ lesson, onInfoClick }) => {
    const { user } = useSelector((state) => state.auth)
    const isTutor = user?.role === "tutor"


    const startTime = new Date(lesson.start_time)
    const handleInfoClick=()=>{
        console.log(lesson.id)
         onInfoClick(lesson)
    }
    // Check if lesson is today
    const getBackgroundImage = () => {
        // Use lesson.background_image if provided
        if (lesson.background_image) return lesson.background_image;

        // Otherwise use a default background
        return "public/temp_data/card_back_2.png";
    }
    return (
        <div
            className="rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200 relative border-4 border-white relative md:w-93 h-70 w-auto"
            style={{
                background: `linear-gradient(rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.5)), url('${getBackgroundImage()}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}>

            <LessonStatusBadge status={lesson.status}/>
            <LessonDate date={startTime}/>
            <LessonCardContent
                title={lesson.title}
                subject={lesson.subject}
                level={lesson.level}
                startTime={lesson.start_time}
                endTime={lesson.end_time}
                isTutor={isTutor}
                studentCount={lesson.students.length} />
            {isTutor ? <LessonTutorView lesson={lesson} onInfoClick={handleInfoClick} />:<LessonStudentView tutor={lesson.tutor} onInfoClick={handleInfoClick}/>}

        </div>
    )
}
export default LessonCardTemp;