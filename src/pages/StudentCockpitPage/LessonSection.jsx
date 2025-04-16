import {LessonCardSkeleton} from "../../components/ui/Skeleton.jsx";
import LessonCardTemp from "../../components/LessonCard/LessonCardTemp.jsx";
import {PlusCircle} from "lucide-react";
import {useState} from "react";

const LessonSection = ()=>{

    const [lessonTab, setLessonTab] = useState("upcoming")

    return (
        <div>
            <div className="bg-[#FFFDF7] rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="border-b border-gray-100">
                    <nav className="flex space-x-6 px-6" aria-label="Tabs">
                        <button
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                lessonTab === "upcoming"
                                    ? "border-black text-black"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            } transition-colors`}
                            onClick={() => setLessonTab("upcoming")}
                        >
                            Nadchodzące
                        </button>
                        <button
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                lessonTab === "past"
                                    ? "border-black text-black"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            } transition-colors`}
                            onClick={() => setLessonTab("past")}
                        >
                            Historia
                        </button>
                    </nav>
                </div>

                <div className="p-6 bg-[#FFFDF7]">
                    {lessonTab === "upcoming" && (
                        <>
                            {lessonsLoading ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {Array.from({length: 3}).map((_, i) => (
                                        <LessonCardSkeleton key={i}/>
                                    ))}
                                </div>
                            ) : upcomingLessons.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {upcomingLessons.map((les) => (
                                        <LessonCardTemp key={les.id} lesson={les} onInfoClick={handleLessonInfo}/>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                                    <p className="text-sm text-gray-500">Brak nadchodzących lekcji</p>
                                    <button
                                        onClick={handleBookMore}
                                        className="mt-4 inline-flex items-center px-3 py-2 text-sm text-black font-medium hover:text-gray-800 hover:underline"
                                    >
                                        <PlusCircle className="mr-2 h-4 w-4"/>
                                        Zarezerwuj lekcję
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                    {lessonTab === "past" && (
                        <>
                            {lessonsLoading ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {Array.from({length: 3}).map((_, i) => (
                                        <LessonCardSkeleton key={i}/>
                                    ))}
                                </div>
                            ) : pastLessons.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {pastLessons.map((les) => (
                                        <LessonCardTemp key={les.id} lesson={les} onInfoClick={handleLessonInfo}/>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center text-gray-500 py-10">Brak historii lekcji</div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}