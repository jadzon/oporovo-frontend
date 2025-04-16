const LessonDate =({date})=>{
    const formattedDate = date.toLocaleDateString("pl-PL", {
        day: "numeric",
        month: "short",
    })
    const isToday = () => {
        const today = new Date()
        return (
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
        )
    }
    return(
        <div className="px-4 pt-3 pb-2 flex justify-end items-center">
                <span className="text-xs text-gray-700 bg-white bg-opacity-80 px-2 py-1 rounded-full font-medium">
                    {isToday() ? "Dzisiaj" : formattedDate}
                </span>
        </div>
    )
}
export default LessonDate;