import {BarChart2, BookOpen, Calendar, Users} from "lucide-react";

const PanelHeader = ({activeTab,setActiveTab}) => {

    return (
        <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
                {[
                    {id: "lessons", name: "Lekcje", icon: <Calendar className="h-4 w-4 mr-2"/>},
                    {id: "courses", name: "Kursy", icon: <BookOpen className="h-4 w-4 mr-2"/>},
                    {id: "calendar", name: "Kalendarz", icon: <Calendar className="h-4 w-4 mr-2"/>},
                    {id: "progress", name: "Postępy", icon: <BarChart2 className="h-4 w-4 mr-2"/>},
                    {id: "tutors", name: "Korepetytorzy", icon: <Users className="h-4 w-4 mr-2"/>},
                ].map((tab) => (
                    <button
                        key={tab.id}
                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                            activeTab === tab.id
                                ? "border-black text-black"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        } transition-colors`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.icon}
                        {tab.name}
                    </button>
                ))}
            </nav>
        </div>
    )
}