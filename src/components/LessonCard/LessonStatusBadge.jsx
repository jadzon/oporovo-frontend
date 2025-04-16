import {getStatusInfo, getStatusSizeClasses} from "../../utils/dateTimeUtils.js";
import {Icon} from "../modal/index.js";

const LessonStatusBadge = ({status}) => {


    return (
        <div className="absolute top-0 left-0 rounded-tl overflow-hidden shadow-sm">
            {(() => {
                const statusInfo = getStatusInfo(status);
                const sizeClasses = getStatusSizeClasses("sm");

                return (
                    <div className={`flex items-center ${statusInfo.color} ${sizeClasses.container} font-medium`}>
                        <Icon name={statusInfo.icon} className={sizeClasses.icon}/>
                        <span>{statusInfo.text}</span>
                    </div>
                );
            })()}
        </div>

    )
}
export default LessonStatusBadge;