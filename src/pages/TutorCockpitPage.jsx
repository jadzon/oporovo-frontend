import { useState, useEffect, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import { motion } from "framer-motion"
import { Calendar, Users, BookOpen, Clock, Star, ChevronRight, FileText, Grid } from "lucide-react"

// Redux thunks
import { fetchUserLessons } from "../store/thunks/lessonThunks"
import { fetchUserCourses } from "../store/thunks/courseThunks"
import { fetchStudentsForTutor } from "../store/thunks/studentsThunks"

// Components
import LessonCard from "../components/lessonCard/LessonCard"
import CourseCard from "../components/courseCard/CourseCard"
import { LessonCardSkeleton } from "../components/ui/Skeleton"
import { useModal } from "../hooks/useModal"
import StudentCard from "../components/studentCard/StudentCard.jsx"

const TutorCockpitPage = () => {
    const dispatch = useDispatch()
    const { user } = useSelector((state) => state.auth)
    const { lessons, loading: lessonsLoading } = useSelector((state) => state.lessons)
    const { courses, loading: coursesLoading } = useSelector((state) => state.courses)
    const { students, loading: studentsLoading } = useSelector((state) => state.students)

    const [activeTab, setActiveTab] = useState("lessons")
    const [lessonTab, setLessonTab] = useState("upcoming")

    // Use the modal functions
    const { openLessonModal, openCourseModal } = useModal()

    useEffect(() => {
        if (user?.id) {
            dispatch(fetchUserLessons(user.id))
            dispatch(fetchUserCourses(user.id))

            // If the user is a tutor, fetch their students
            if (user.role === "tutor") {
                dispatch(fetchStudentsForTutor(user.id))
            }
        }
    }, [dispatch, user])

    const now = new Date()

    // Use a fallback for lessons to avoid null errors
    const lessonsArray = lessons || []

    // Filter upcoming "scheduled" lessons for the hero card
    const upcomingScheduled = useMemo(() => {
        return lessonsArray
            .filter((lesson) => new Date(lesson.start_time) > now && lesson.status === "scheduled")
            .sort((a, b) => new Date(a.start_time) - new Date(b.start_time))
    }, [lessonsArray, now])

    // Filter lessons needing confirmation
    const needsConfirmationLessons = useMemo(() => {
        return lessonsArray.filter((lesson) => lesson.status === "scheduled" && new Date(lesson.start_time) > now)
    }, [lessonsArray, now])

    const nextPendingLesson = upcomingScheduled[0] || null
    const upcomingLessons = useMemo(
        () => lessonsArray.filter((lesson) => new Date(lesson.start_time) > now),
        [lessonsArray, now],
    )
    const pastLessons = useMemo(
        () => lessonsArray.filter((lesson) => new Date(lesson.start_time) <= now),
        [lessonsArray, now],
    )

    // Modal handlers
    const handleLessonInfo = (lesson) => openLessonModal(lesson)
    const handleCourseInfo = (course) => openCourseModal(course)

    // Action handlers
    const handleSetSchedule = () => alert("Ustaw harmonogram dyspozycyjności...")
    const handleViewStudents = () => setActiveTab("students")
    const handleManageMaterials = () => setActiveTab("materials")

    // Count students from all lessons (unique)
    const totalStudents = useMemo(() => {
        const studentIds = new Set()
        lessonsArray.forEach((lesson) => {
            if (lesson.students) {
                lesson.students.forEach((student) => {
                    if (student.id) studentIds.add(student.id)
                })
            }
        })
        return studentIds.size
    }, [lessonsArray])

    return (
        <div className="bg-[#FFFDF7] min-h-screen">
            {/* Hero section with big text */}
            <div className="bg-white border-b border-gray-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="py-8">
                        <div
                            className="text-center lg:text-left"
                        >
                            <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight">
                                Panel <span className="text-black">nauczyciela</span>
                            </h1>
                            <p className="mt-4 text-lg text-gray-600">
                                Zarządzaj swoimi lekcjami, uczniami i harmonogramem zajęć w jednym miejscu.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Quick actions section */}
                <section className="mb-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div
                            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow"
                        >
                            <div className="rounded-full bg-gray-50 p-4 mb-4">
                                <Calendar className="h-6 w-6 text-black" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Harmonogram</h3>
                            <p className="text-sm text-gray-600 mb-4">Ustaw swoje dostępne godziny i zarządzaj kalendarzem lekcji</p>
                            <button
                                onClick={handleSetSchedule}
                                className="mt-auto inline-flex items-center px-4 py-2 shadow-sm text-sm font-medium rounded-full text-white bg-black hover:bg-gray-800 transition-colors"
                            >
                                Ustaw dostępność
                            </button>
                        </div>

                        <div
                            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow"
                        >
                            <div className="rounded-full bg-gray-50 p-4 mb-4">
                                <Users className="h-6 w-6 text-black" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Uczniowie</h3>
                            <p className="text-sm text-gray-600 mb-4">Przeglądaj listę uczniów i śledź ich postępy w nauce</p>
                            <button
                                onClick={handleViewStudents}
                                className="mt-auto inline-flex items-center px-4 py-2 shadow-sm text-sm font-medium rounded-full text-white bg-black hover:bg-gray-800 transition-colors"
                            >
                                Moi uczniowie
                            </button>
                        </div>

                        <div
                            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow"
                        >
                            <div className="rounded-full bg-gray-50 p-4 mb-4">
                                <BookOpen className="h-6 w-6 text-black" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Materiały</h3>
                            <p className="text-sm text-gray-600 mb-4">Zarządzaj swoimi materiałami dydaktycznymi i zadaniami</p>
                            <button
                                onClick={handleManageMaterials}
                                className="mt-auto inline-flex items-center px-4 py-2 shadow-sm text-sm font-medium rounded-full text-white bg-black hover:bg-gray-800 transition-colors"
                            >
                                Materiały
                            </button>
                        </div>
                    </div>
                </section>

                {/* Lessons needing confirmation */}
                {needsConfirmationLessons.length > 0 && (
                    <section className="mb-10">
                        <div
                            className="bg-amber-50 rounded-xl shadow-sm border border-amber-100 overflow-hidden"
                        >
                            <div className="px-6 py-4 border-b border-amber-100 flex items-center">
                                <Clock className="h-5 w-5 text-amber-600 mr-2" />
                                <h2 className="text-lg font-medium text-amber-900">Lekcje wymagające potwierdzenia</h2>
                            </div>

                            <div className="p-6">
                                <div className="space-y-4">
                                    <p className="text-amber-800">
                                        Masz {needsConfirmationLessons.length}{" "}
                                        {needsConfirmationLessons.length === 1
                                            ? "zaplanowaną lekcję"
                                            : needsConfirmationLessons.length < 5
                                                ? "zaplanowane lekcje"
                                                : "zaplanowanych lekcji"}
                                        ,{needsConfirmationLessons.length === 1 ? " która wymaga" : " które wymagają"} potwierdzenia.
                                    </p>

                                    {/* Using LessonCard instead of custom cards */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {needsConfirmationLessons.slice(0, 3).map((lesson) => (
                                            <LessonCard key={lesson.id} lesson={lesson} onInfoClick={handleLessonInfo} />
                                        ))}
                                    </div>

                                    {needsConfirmationLessons.length > 3 && (
                                        <div className="text-center mt-4">
                                            <button
                                                onClick={() => setActiveTab("lessons")}
                                                className="text-sm font-medium text-black hover:text-gray-800 hover:underline transition-colors flex items-center justify-center mx-auto"
                                            >
                                                Zobacz wszystkie
                                                <ChevronRight className="h-4 w-4 ml-1" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* Upcoming Lesson Section */}
                <section className="mb-10">
                    <div
                        className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
                    >
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center">
                            <Calendar className="h-5 w-5 text-black mr-2" />
                            <h2 className="text-lg font-medium text-gray-900">Najbliższa lekcja</h2>
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
                                    ) : upcomingLessons.length > 0 ? (
                                        <>
                                            <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                                {upcomingLessons[0].title || "Zaplanowana lekcja"}
                                            </h3>
                                            <p className="text-gray-600 mb-4">
                                                Twoja najbliższa lekcja odbędzie się{" "}
                                                <span className="font-medium text-gray-800">
                          {new Date(upcomingLessons[0].start_time).toLocaleDateString("pl-PL", {
                              day: "numeric",
                              month: "long",
                          })}{" "}
                                                    o{" "}
                                                    {new Date(upcomingLessons[0].start_time).toLocaleTimeString("pl-PL", {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                        </span>
                                                .
                                            </p>

                                            <div className="mb-4">
                        <span
                            className={`text-sm inline-block px-3 py-1 rounded-full ${
                                upcomingLessons[0].status === "confirmed"
                                    ? "bg-emerald-100 text-emerald-800"
                                    : upcomingLessons[0].status === "scheduled"
                                        ? "bg-gray-100 text-black"
                                        : "bg-gray-100 text-gray-800"
                            }`}
                        >
                          {upcomingLessons[0].status === "confirmed"
                              ? "Potwierdzona"
                              : upcomingLessons[0].status === "scheduled"
                                  ? "Oczekuje na potwierdzenie"
                                  : "Status nieznany"}
                        </span>
                                            </div>

                                            {upcomingLessons[0].students && upcomingLessons[0].students.length > 0 && (
                                                <div className="mb-6">
                                                    <p className="text-sm text-gray-600 mb-2">Uczniowie:</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {upcomingLessons[0].students.map((student) => (
                                                            <div
                                                                key={student.id}
                                                                className="flex items-center bg-gray-50 rounded-full pl-1 pr-3 py-1"
                                                            >
                                                                <div className="w-6 h-6 mr-2 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
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
                                  {student.first_name} {student.last_name}
                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            <button
                                                onClick={() => handleLessonInfo(upcomingLessons[0])}
                                                className="self-start inline-flex items-center px-4 py-2 shadow-sm text-sm font-medium rounded-full text-white bg-black hover:bg-gray-800 transition-colors"
                                            >
                                                Szczegóły lekcji
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <h3 className="text-2xl font-bold text-gray-900 mb-3">Brak zaplanowanych lekcji</h3>
                                            <p className="text-gray-600 mb-6">
                                                Nie masz jeszcze zaplanowanych lekcji. Ustaw swoją dostępność, aby uczniowie mogli rezerwować
                                                terminy lekcji z Tobą.
                                            </p>
                                            <div className="flex flex-wrap gap-3">
                                                <button
                                                    onClick={handleSetSchedule}
                                                    className="inline-flex items-center px-4 py-2 shadow-sm text-sm font-medium rounded-full text-white bg-black hover:bg-gray-800 transition-colors"
                                                >
                                                    <Calendar className="mr-2 h-4 w-4" />
                                                    Ustaw dostępność
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
                                            <div className="text-2xl font-bold text-black">{upcomingLessons.length}</div>
                                            <p className="text-xs text-gray-500 mt-1">zaplanowanych</p>
                                        </div>

                                        <div className="bg-[#FFFDF7] rounded-xl p-4 border border-gray-100 hover:shadow-sm transition-shadow">
                                            <h4 className="text-sm font-medium text-gray-700 mb-2">Liczba uczniów</h4>
                                            <div className="text-2xl font-bold text-black">{totalStudents}</div>
                                            <p className="text-xs text-gray-500 mt-1">łącznie</p>
                                        </div>

                                        <div className="bg-[#FFFDF7] rounded-xl p-4 border border-gray-100 hover:shadow-sm transition-shadow">
                                            <h4 className="text-sm font-medium text-gray-700 mb-2">Godziny nauczania</h4>
                                            <div className="text-2xl font-bold text-black">
                                                {lessonsArray
                                                    .reduce((total, lesson) => {
                                                        const start = new Date(lesson.start_time)
                                                        const end = new Date(lesson.end_time)
                                                        const durationHours = (end - start) / (1000 * 60 * 60)
                                                        return total + durationHours
                                                    }, 0)
                                                    .toFixed(0)}
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">w tym miesiącu</p>
                                        </div>

                                        <div className="bg-[#FFFDF7] rounded-xl p-4 border border-gray-100 hover:shadow-sm transition-shadow">
                                            <h4 className="text-sm font-medium text-gray-700 mb-2">Ocena nauczyciela</h4>
                                            <div className="flex items-center">
                                                <div className="text-2xl font-bold text-black">4.8</div>
                                                <div className="ml-2 text-yellow-400 flex">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <Star key={star} className={`h-3 w-3 ${star <= 5 ? "text-black" : "text-gray-300"}`} />
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
                                { id: "students", name: "Uczniowie", icon: <Users className="h-4 w-4 mr-2" /> },
                                { id: "courses", name: "Kursy", icon: <BookOpen className="h-4 w-4 mr-2" /> },
                                { id: "schedule", name: "Harmonogram", icon: <Clock className="h-4 w-4 mr-2" /> },
                                { id: "materials", name: "Materiały", icon: <FileText className="h-4 w-4 mr-2" /> },
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
                                                            onClick={handleSetSchedule}
                                                            className="mt-4 inline-flex items-center px-3 py-2 text-sm text-black font-medium hover:text-gray-800 hover:underline"
                                                        >
                                                            <Calendar className="mr-2 h-4 w-4" />
                                                            Ustaw dostępność
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

                        {activeTab === "students" && (
                            <div
                                className="bg-[#FFFDF7] rounded-xl shadow-sm border border-gray-100 overflow-hidden"
                            >
                                <div className="px-6 py-4 border-b border-gray-100 flex items-center">
                                    <Users className="h-5 w-5 text-black mr-2" />
                                    <h2 className="text-lg font-medium text-gray-900">Moi uczniowie</h2>
                                </div>

                                <div className="p-6 bg-[#FFFDF7]">
                                    {studentsLoading ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {Array.from({ length: 3 }).map((_, i) => (
                                                <div key={i} className="bg-gray-100 h-48 rounded-xl animate-pulse" />
                                            ))}
                                        </div>
                                    ) : students && students.length > 0 ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {students.map((student) => (
                                                <StudentCard
                                                    key={student.id}
                                                    student={student}
                                                    onInfoClick={(student) => {
                                                        // Handle student info click - you might want to use your modal system here
                                                        alert(`Pokazać profil ucznia: ${student.first_name} ${student.last_name}`)
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                                            <p className="text-sm text-gray-500">Nie masz jeszcze żadnych uczniów</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === "courses" && (
                            <div
                                className="bg-[#FFFDF7] rounded-xl shadow-sm border border-gray-100 overflow-hidden"
                            >
                                <div className="px-6 py-4 border-b border-gray-100 flex items-center">
                                    <BookOpen className="h-5 w-5 text-black mr-2" />
                                    <h2 className="text-lg font-medium text-gray-900">Moje kursy</h2>
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
                                            <p className="text-sm text-gray-500">Nie masz jeszcze żadnych kursów</p>
                                            <button className="mt-4 inline-flex items-center px-3 py-2 text-sm text-black font-medium hover:text-gray-800 hover:underline">
                                                <BookOpen className="mr-2 h-4 w-4" />
                                                Stwórz nowy kurs
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === "schedule" && (
                            <div
                                className="bg-[#FFFDF7] rounded-xl shadow-sm border border-gray-100 overflow-hidden"
                            >
                                <div className="px-6 py-4 border-b border-gray-100 flex items-center">
                                    <Calendar className="h-5 w-5 text-black mr-2" />
                                    <h2 className="text-lg font-medium text-gray-900">Mój harmonogram</h2>
                                </div>

                                <div className="p-6 bg-[#FFFDF7]">
                                    <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                                        <div className="rounded-full bg-gray-100 p-3 mb-4">
                                            <Calendar className="h-6 w-6 text-gray-400" />
                                        </div>
                                        <h3 className="text-sm font-medium text-gray-900">Funkcja w przygotowaniu</h3>
                                        <p className="mt-1 text-sm text-gray-500">Widok harmonogramu zajęć będzie dostępny wkrótce.</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "materials" && (
                            <div
                                className="bg-[#FFFDF7] rounded-xl shadow-sm border border-gray-100 overflow-hidden"
                            >
                                <div className="px-6 py-4 border-b border-gray-100 flex items-center">
                                    <FileText className="h-5 w-5 text-black mr-2" />
                                    <h2 className="text-lg font-medium text-gray-900">Materiały dydaktyczne</h2>
                                </div>

                                <div className="p-6 bg-[#FFFDF7]">
                                    <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                                        <div className="rounded-full bg-gray-100 p-3 mb-4">
                                            <Grid className="h-6 w-6 text-gray-400" />
                                        </div>
                                        <h3 className="text-sm font-medium text-gray-900">Funkcja w przygotowaniu</h3>
                                        <p className="mt-1 text-sm text-gray-500">
                                            Zarządzanie materiałami dydaktycznymi będzie dostępne wkrótce.
                                        </p>
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

export default TutorCockpitPage
