import { useState, useEffect, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Calendar, Search, PlusCircle, Star, CheckCircle, Users, BookOpen, BarChart2 } from "lucide-react"

// Redux thunks
import { fetchUserLessons } from "../store/thunks/lessonThunks"
import { fetchUserTutors } from "../store/thunks/tutorsThunks"
import { fetchUserCourses } from "../store/thunks/courseThunks"

// Cards
import LessonCard from "../components/lessonCard/LessonCard"
import TutorCard from "../components/tutorCard/TutorCard"
import CourseCard from "../components/courseCard/CourseCard"

// Skeletons
import { LessonCardSkeleton, TutorCardSkeleton } from "../components/ui/Skeleton"

// Import the useModal hook from the new modal system
import { useModal } from '../components/modal';

const StudentCockpitPage = () => {
    const dispatch = useDispatch()
    const { user } = useSelector((state) => state.auth)
    const { lessons, loading: lessonsLoading } = useSelector((state) => state.lessons)
    const { tutors, loading: tutorsLoading } = useSelector((state) => state.tutors)
    const { courses, loading: coursesLoading } = useSelector((state) => state.courses)

    const [activeTab, setActiveTab] = useState("lessons")
    const [lessonTab, setLessonTab] = useState("upcoming")

    // Use the new modal functions
    const { openLessonModal, openTutorModal, openCourseModal } = useModal()

    useEffect(() => {
        if (user?.id) {
            dispatch(fetchUserLessons(user.id))
            dispatch(fetchUserTutors(user.id))
            dispatch(fetchUserCourses(user.id))
        }
    }, [dispatch, user])

    const now = new Date()

    // Use a fallback for lessons to avoid null errors
    const lessonsArray = lessons || []

    // Filter upcoming "confirmed" lessons for the hero card
    const upcomingConfirmed = useMemo(() => {
        return lessonsArray
            .filter((lesson) => new Date(lesson.start_time) > now && lesson.status === "confirmed")
            .sort((a, b) => new Date(a.start_time) - new Date(b.start_time))
    }, [lessonsArray, now])

    const nextLesson = upcomingConfirmed[0] || null
    const upcomingLessons = useMemo(
        () => lessonsArray.filter((lesson) => new Date(lesson.start_time) > now),
        [lessonsArray, now],
    )
    const pastLessons = useMemo(
        () => lessonsArray.filter((lesson) => new Date(lesson.start_time) <= now),
        [lessonsArray, now],
    )

    // Modal handlers using the new modal system
    const handleLessonInfo = (lesson) => openLessonModal(lesson.id)
    const handleTutorInfo = (tutor) => openTutorModal(tutor.id)
    const handleCourseInfo = (course) => openCourseModal(course.id)

    const handleBookMore = () => alert("Zarezerwuj kolejną lekcję...")
    const handleSearchTutors = () => alert("Przekierowanie do wyszukiwania...")

    return (
        <div className="bg-[#FFFDF7] min-h-screen">
            {/* Hero section with big text */}
            <div className="bg-white border-b border-gray-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="py-8">
                        <div className="text-center lg:text-left">
                            <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight">
                                Kokpit <span className="text-black">nauczania</span>
                            </h1>
                            <p className="mt-4 text-lg text-gray-600">
                                Zarządzaj swoimi lekcjami, kursami i korepetytorami w jednym miejscu.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Quick actions section */}
                <section className="mb-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                            <div className="rounded-full bg-gray-50 p-4 mb-4">
                                <PlusCircle className="h-6 w-6 text-black" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Zarezerwuj lekcję</h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Znajdź odpowiedniego korepetytora i zaplanuj lekcję w dogodnym terminie
                            </p>
                            <button
                                onClick={handleBookMore}
                                className="mt-auto inline-flex items-center px-4 py-2 shadow-sm text-sm font-medium rounded-full text-white bg-black hover:bg-gray-800 transition-colors"
                            >
                                Zarezerwuj
                            </button>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                            <div className="rounded-full bg-gray-50 p-4 mb-4">
                                <Search className="h-6 w-6 text-black" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Znajdź korepetytora</h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Przeglądaj profile korepetytorów i wybierz najlepszego dla siebie
                            </p>
                            <button
                                onClick={handleSearchTutors}
                                className="mt-auto inline-flex items-center px-4 py-2 shadow-sm text-sm font-medium rounded-full text-white bg-black hover:bg-gray-800 transition-colors"
                            >
                                Szukaj
                            </button>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                            <div className="rounded-full bg-gray-50 p-4 mb-4">
                                <CheckCircle className="h-6 w-6 text-black" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Sprawdź postępy</h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Monitoruj swoje osiągnięcia i śledź rozwój swoich umiejętności
                            </p>
                            <button
                                onClick={() => setActiveTab("progress")}
                                className="mt-auto inline-flex items-center px-4 py-2 shadow-sm text-sm font-medium rounded-full text-white bg-black hover:bg-gray-800 transition-colors"
                            >
                                Sprawdź
                            </button>
                        </div>
                    </div>
                </section>

                {/* Upcoming Lesson Section - Always visible */}
                <section className="mb-10">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center">
                            <Calendar className="h-5 w-5 text-black mr-2" />
                            <h2 className="text-lg font-medium text-gray-900">Nadchodząca lekcja</h2>
                        </div>

                        <div className="p-6">
                            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                                {/* Left side - Text content */}
                                <div className="md:w-1/2 flex flex-col justify-center">
                                    {lessonsLoading ? (
                                        <div className="animate-pulse">
                                            <div className="h-6 bg-gray-200 rounded-full mb-4 w-3/4"></div>
                                            <div className="h-4 bg-gray-200 rounded-full mb-2 w-full"></div>
                                            <div className="h-4 bg-gray-200 rounded-full mb-2 w-5/6"></div>
                                            <div className="h-4 bg-gray-200 rounded-full w-4/6"></div>
                                        </div>
                                    ) : nextLesson ? (
                                        <>
                                            <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                                {nextLesson.title || "Zaplanowana lekcja"}
                                            </h3>
                                            <p className="text-gray-600 mb-4">
                                                Twoja następna lekcja odbędzie się{" "}
                                                <span className="font-medium text-gray-800">
                          {new Date(nextLesson.start_time).toLocaleDateString("pl-PL", {
                              day: "numeric",
                              month: "long",
                          })}{" "}
                                                    o{" "}
                                                    {new Date(nextLesson.start_time).toLocaleTimeString("pl-PL", {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                        </span>
                                                .
                                            </p>
                                            <div className="flex items-center mb-6">
                                                <div className="w-10 h-10 mr-3 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200 shadow-sm">
                                                    <img
                                                        src={nextLesson.tutor?.avatar || "/images/default-avatar.png"}
                                                        alt={nextLesson.tutor?.username || "Korepetytor"}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            e.target.src = "/images/default-avatar.png"
                                                        }}
                                                    />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">
                                                        {nextLesson.tutor?.first_name} {nextLesson.tutor?.last_name}
                                                    </p>
                                                    <p className="text-sm text-gray-600">@{nextLesson.tutor?.username || "korepetytor"}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleLessonInfo(nextLesson)}
                                                className="self-start inline-flex items-center px-4 py-2 shadow-sm text-sm font-medium rounded-full text-white bg-black hover:bg-gray-800 transition-colors"
                                            >
                                                Szczegóły lekcji
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <h3 className="text-2xl font-bold text-gray-900 mb-3">Zaplanuj pierwszą lekcję</h3>
                                            <p className="text-gray-600 mb-6">
                                                Nie masz jeszcze zaplanowanych lekcji. Zarezerwuj swoją pierwszą lekcję już teraz i rozpocznij
                                                swoją edukacyjną podróż z jednym z naszych doświadczonych korepetytorów.
                                            </p>
                                            <div className="flex flex-wrap gap-3">
                                                <button
                                                    onClick={handleBookMore}
                                                    className="inline-flex items-center px-4 py-2 shadow-sm text-sm font-medium rounded-full text-white bg-black hover:bg-gray-800 transition-colors"
                                                >
                                                    <PlusCircle className="mr-2 h-4 w-4" />
                                                    Zarezerwuj lekcję
                                                </button>
                                                <button
                                                    onClick={handleSearchTutors}
                                                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                                                >
                                                    <Search className="mr-2 h-4 w-4" />
                                                    Przeglądaj korepetytorów
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* Right side - Stats cards */}
                                <div className="md:w-1/2">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-[#FFFDF7] rounded-xl p-4 border border-gray-100 hover:shadow-sm transition-shadow">
                                            <h4 className="text-sm font-medium text-gray-700 mb-2">Liczba lekcji</h4>
                                            <div className="text-2xl font-bold text-black">{lessonsArray.length}</div>
                                            <p className="text-xs text-gray-500 mt-1">łącznie</p>
                                        </div>

                                        <div className="bg-[#FFFDF7] rounded-xl p-4 border border-gray-100 hover:shadow-sm transition-shadow">
                                            <h4 className="text-sm font-medium text-gray-700 mb-2">Nadchodzące</h4>
                                            <div className="text-2xl font-bold text-black">{upcomingLessons.length}</div>
                                            <p className="text-xs text-gray-500 mt-1">zaplanowane</p>
                                        </div>

                                        <div className="bg-[#FFFDF7] rounded-xl p-4 border border-gray-100 hover:shadow-sm transition-shadow">
                                            <h4 className="text-sm font-medium text-gray-700 mb-2">Korepetytorzy</h4>
                                            <div className="text-2xl font-bold text-black">{tutors?.length || 0}</div>
                                            <p className="text-xs text-gray-500 mt-1">współpracujący</p>
                                        </div>

                                        <div className="bg-[#FFFDF7] rounded-xl p-4 border border-gray-100 hover:shadow-sm transition-shadow">
                                            <h4 className="text-sm font-medium text-gray-700 mb-2">Ocena ucznia</h4>
                                            <div className="flex items-center">
                                                <div className="text-2xl font-bold text-black">4.5</div>
                                                <div className="ml-2 text-yellow-400 flex">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <Star key={star} className={`h-3 w-3 ${star <= 4.5 ? "text-black" : "text-gray-300"}`} />
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">średnia ocen</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Main Content Tabs */}
                <section>
                    {/* Tab Navigation */}
                    <div className="border-b border-gray-200 mb-6">
                        <nav className="-mb-px flex space-x-8">
                            {[
                                { id: "lessons", name: "Lekcje", icon: <Calendar className="h-4 w-4 mr-2" /> },
                                { id: "courses", name: "Kursy", icon: <BookOpen className="h-4 w-4 mr-2" /> },
                                { id: "calendar", name: "Kalendarz", icon: <Calendar className="h-4 w-4 mr-2" /> },
                                { id: "progress", name: "Postępy", icon: <BarChart2 className="h-4 w-4 mr-2" /> },
                                { id: "tutors", name: "Korepetytorzy", icon: <Users className="h-4 w-4 mr-2" /> },
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

                    {/* Tab Content */}
                    <div className="min-h-[500px]">
                        {activeTab === "lessons" && (
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
                                                        {Array.from({ length: 3 }).map((_, i) => (
                                                            <LessonCardSkeleton key={i} />
                                                        ))}
                                                    </div>
                                                ) : upcomingLessons.length > 0 ? (
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                                        {upcomingLessons.map((les) => (
                                                            <LessonCard key={les.id} lesson={les} onInfoClick={handleLessonInfo} />
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                                                        <p className="text-sm text-gray-500">Brak nadchodzących lekcji</p>
                                                        <button
                                                            onClick={handleBookMore}
                                                            className="mt-4 inline-flex items-center px-3 py-2 text-sm text-black font-medium hover:text-gray-800 hover:underline"
                                                        >
                                                            <PlusCircle className="mr-2 h-4 w-4" />
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
                                                        {Array.from({ length: 3 }).map((_, i) => (
                                                            <LessonCardSkeleton key={i} />
                                                        ))}
                                                    </div>
                                                ) : pastLessons.length > 0 ? (
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                                        {pastLessons.map((les) => (
                                                            <LessonCard key={les.id} lesson={les} onInfoClick={handleLessonInfo} />
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
                        )}

                        {activeTab === "courses" && (
                            <div>
                                <div className="bg-[#FFFDF7] rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                    <div className="px-6 py-4 border-b border-gray-100 flex items-center">
                                        <BookOpen className="h-5 w-5 text-black mr-2" />
                                        <h2 className="text-lg font-medium text-gray-900">Kursy</h2>
                                    </div>

                                    <div className="p-6 bg-[#FFFDF7]">
                                        {coursesLoading ? (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                                {Array.from({ length: 3 }).map((_, i) => (
                                                    <div key={i} className="bg-gray-100 h-48 rounded-xl animate-pulse" />
                                                ))}
                                            </div>
                                        ) : courses && courses.length > 0 ? (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                                {courses.map((course) => (
                                                    <CourseCard key={course.id} course={course} onInfoClick={handleCourseInfo} />
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                                                <p className="text-sm text-gray-500">Brak kursów dla Ciebie</p>
                                                <button className="mt-4 inline-flex items-center px-3 py-2 text-sm text-black font-medium hover:text-gray-800 hover:underline">
                                                    <Search className="mr-2 h-4 w-4" />
                                                    Przeglądaj kursy
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "calendar" && (
                            <div>
                                <div className="bg-[#FFFDF7] rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                    <div className="px-6 py-4 border-b border-gray-100 flex items-center">
                                        <Calendar className="h-5 w-5 text-black mr-2" />
                                        <h2 className="text-lg font-medium text-gray-900">Kalendarz</h2>
                                    </div>

                                    <div className="p-6 bg-[#FFFDF7]">
                                        <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                                            <div className="rounded-full bg-gray-100 p-3 mb-4">
                                                <Calendar className="h-6 w-6 text-gray-400" />
                                            </div>
                                            <h3 className="text-sm font-medium text-gray-900">Wkrótce dostępne</h3>
                                            <p className="mt-1 text-sm text-gray-500">Funkcja kalendarza jest w trakcie przygotowania.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "progress" && (
                            <div>
                                <div className="bg-[#FFFDF7] rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                    <div className="px-6 py-4 border-b border-gray-100 flex items-center">
                                        <BarChart2 className="h-5 w-5 text-black mr-2" />
                                        <h2 className="text-lg font-medium text-gray-900">Twoje postępy</h2>
                                    </div>

                                    <div className="p-6 bg-[#FFFDF7]">
                                        <div className="space-y-6">
                                            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                                                <h3 className="text-sm font-medium text-gray-900 mb-2">Ocena jako uczeń</h3>
                                                <div className="flex items-center">
                                                    {Array.from({ length: 5 }).map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className={`w-4 h-4 ${i < Math.round(3) ? "text-black" : "text-gray-300"}`}
                                                            fill={i < Math.round(3) ? "currentColor" : "none"}
                                                        />
                                                    ))}
                                                    <span className="ml-2 text-sm text-gray-600">(3.0/5)</span>
                                                </div>
                                            </div>

                                            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                                                <h3 className="text-sm font-medium text-gray-900 mb-2">Ukończone lekcje</h3>
                                                <div className="text-2xl font-medium text-gray-900">{pastLessons.length}</div>
                                            </div>

                                            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                                                <h3 className="text-sm font-medium text-gray-900 mb-2">Aktywność</h3>
                                                <div className="h-24 flex items-end justify-between gap-1 mt-4">
                                                    {[3, 5, 2, 7, 4, 6, 3].map((value, index) => (
                                                        <div
                                                            key={index}
                                                            className="bg-black bg-opacity-80 rounded-t w-full"
                                                            style={{ height: `${(value / 7) * 100}%` }}
                                                        ></div>
                                                    ))}
                                                </div>
                                                <div className="flex justify-between mt-2 text-xs text-gray-500">
                                                    <span>Pon</span>
                                                    <span>Wt</span>
                                                    <span>Śr</span>
                                                    <span>Czw</span>
                                                    <span>Pt</span>
                                                    <span>Sob</span>
                                                    <span>Nd</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "tutors" && (
                            <div>
                                <div className="bg-[#FFFDF7] rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                    <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                                        <div className="flex items-center">
                                            <Users className="h-5 w-5 text-black mr-2" />
                                            <h2 className="text-lg font-medium text-gray-900">Twoi korepetytorzy</h2>
                                        </div>
                                        <button
                                            onClick={handleSearchTutors}
                                            className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-full bg-gray-50 text-black hover:bg-gray-100 transition-colors"
                                        >
                                            <Search className="mr-1.5 h-3 w-3" />
                                            Szukaj więcej
                                        </button>
                                    </div>

                                    <div className="p-6 bg-[#FFFDF7]">
                                        {tutorsLoading ? (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                                {Array.from({ length: 3 }).map((_, i) => (
                                                    <TutorCardSkeleton key={i} />
                                                ))}
                                            </div>
                                        ) : tutors && tutors.length > 0 ? (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                                {tutors.map((tutor) => (
                                                    <TutorCard key={tutor.id} tutor={tutor} onInfoClick={handleTutorInfo} />
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                                                <p className="text-sm text-gray-500">Brak korepetytorów do wyświetlenia</p>
                                                <button
                                                    onClick={handleSearchTutors}
                                                    className="mt-4 inline-flex items-center px-3 py-2 text-sm text-black font-medium hover:text-gray-800 hover:underline"
                                                >
                                                    <Search className="mr-2 h-4 w-4" />
                                                    Szukaj korepetytorów
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
)
}

export default StudentCockpitPage
