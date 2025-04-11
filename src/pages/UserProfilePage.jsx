import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useParams, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { userService } from "../api/services/userService"
import {
    User,
    Calendar,
    MapPin,
    Briefcase,
    School,
    BookOpen,
    GraduationCap,
    Heart,
    Medal,
    Clock,
    MessageSquare,
    Star,
    Users,
    Edit,
    Settings,
    FileText,
    ChevronRight
} from "lucide-react"

// Components
import { Card } from "../components/temp"

const UserProfilePage = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { userId } = useParams() // Get the userId from URL params

    // Get the current authenticated user from Redux store
    const authUser = useSelector((state) => state.auth.user)

    // State for profile data
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [profileData, setProfileData] = useState(null)
    const [activeTab, setActiveTab] = useState("info")

    // Check if user is viewing own profile
    const isOwnProfile = authUser?.id === userId

    // Function to fetch user profile data from the API
    const fetchUserProfile = async (id) => {
        setLoading(true)
        setError(null)

        try {
            // Make API request to fetch user data using userService
            const response = await userService.getUserById(id)
            setProfileData(response.data)
            setLoading(false)
        } catch (err) {
            console.error("Error fetching user profile:", err)
            setError("Nie udało się załadować profilu. Spróbuj ponownie później.")
            setLoading(false)
        }
    }

// Fetch profile data when component mounts or userId changes
    useEffect(() => {
        if (userId) {
            // If userId param exists, fetch that specific profile
            fetchUserProfile(userId);
        } else if (authUser?.id) {
            // If no userId in URL but user is logged in, redirect to their profile
            navigate(`/user/${authUser.id}`);
        } else {
            // Not authenticated and no userId - redirect to home
            navigate('/');
        }
    }, [userId, authUser, navigate]);

    if (loading) {
        return (
            <div className="bg-[#FFFDF7] min-h-screen pt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">{/* Changed from max-w-5xl to max-w-7xl */}
                    {/* Skeleton for cover photo */}
                    <div className="relative mb-20">
                        <div className="h-72 md:h-80 w-full bg-gray-200 animate-pulse"></div>

                        {/* Skeleton for profile picture */}
                        <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-16">
                            <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-200 animate-pulse"></div>
                        </div>
                    </div>

                    {/* Skeleton for profile info */}
                    <div className="text-center mb-6">
                        <div className="h-8 w-48 bg-gray-200 animate-pulse rounded-md mx-auto mb-2"></div>
                        <div className="h-4 w-32 bg-gray-200 animate-pulse rounded-md mx-auto"></div>
                        <div className="flex items-center gap-4 mt-3 justify-center">
                            <div className="h-5 w-24 bg-gray-200 animate-pulse rounded-md"></div>
                        </div>
                    </div>

                    {/* Skeleton for stats cards */}
                    <div className="mb-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="bg-white rounded-xl p-4 border border-gray-100">
                                    <div className="h-4 w-24 bg-gray-200 animate-pulse rounded-md mb-2"></div>
                                    <div className="h-8 w-16 bg-gray-200 animate-pulse rounded-md"></div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Skeleton for tabs */}
                    <div className="border-b border-gray-200 mb-6">
                        <div className="flex space-x-8">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="pb-4 w-24">
                                    <div className="h-5 w-full bg-gray-200 animate-pulse rounded-md"></div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Skeleton for content */}
                    <div className="space-y-6 pb-12">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white rounded-xl p-6 border border-gray-100">
                                <div className="h-6 w-40 bg-gray-200 animate-pulse rounded-md mb-4"></div>
                                <div className="space-y-2">
                                    <div className="h-4 w-full bg-gray-200 animate-pulse rounded-md"></div>
                                    <div className="h-4 w-full bg-gray-200 animate-pulse rounded-md"></div>
                                    <div className="h-4 w-2/3 bg-gray-200 animate-pulse rounded-md"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    // Error state
    if (error && !profileData) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-[#FFFDF7]">
                <div className="text-center p-8 max-w-md">
                    <div className="bg-red-50 border border-red-100 rounded-full p-4 mx-auto mb-6 w-16 h-16 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-red-500">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Wystąpił błąd</h1>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={() => fetchUserProfile(userId)}
                        className="px-6 py-2.5 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-colors inline-flex items-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                        </svg>
                        Spróbuj ponownie
                    </button>
                </div>
            </div>
        )
    }

    // If profile data failed to load
    if (!profileData) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-[#FFFDF7]">
                <div className="text-center p-8 max-w-md">
                    <div className="bg-yellow-50 border border-yellow-100 rounded-full p-4 mx-auto mb-6 w-16 h-16 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-yellow-500">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Nie znaleziono użytkownika</h1>
                    <p className="text-gray-600 mb-6">Użytkownik o podanym identyfikatorze nie istnieje lub został usunięty.</p>
                    <button
                        onClick={() => navigate('/')}
                        className="px-6 py-2.5 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-colors"
                    >
                        Wróć do strony głównej
                    </button>
                </div>
            </div>
        )
    }

    // Determine if showing tutor or student profile
    const isTutor = profileData.role === "tutor"

    // Function to format date string
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("pl-PL", {
            day: "numeric",
            month: "long",
            year: "numeric",
        })
    }

    // Function to render star ratings
    const renderStars = (rating) => {
        return (
            <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`h-4 w-4 ${star <= Math.round(rating) ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
                    />
                ))}
            </div>
        )
    }

    // Function to render content based on the active tab
    const renderTabContent = () => {
        switch (activeTab) {
            case "info":
                return (
                    <div className="space-y-6">
                        {/* Basic Info */}
                        <Card title="Informacje podstawowe" icon="user">
                            <div className="space-y-4">
                                <div className="flex items-center">
                                    <MapPin className="h-5 w-5 text-gray-500 mr-3" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Miejsce zamieszkania</p>
                                        <p className="text-sm text-gray-600">{profileData.location}</p>
                                    </div>
                                </div>

                                {isTutor ? (
                                    <div className="flex items-center">
                                        <Briefcase className="h-5 w-5 text-gray-500 mr-3" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Zawód</p>
                                            <p className="text-sm text-gray-600">{profileData.title}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center">
                                        <School className="h-5 w-5 text-gray-500 mr-3" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Szkoła</p>
                                            <p className="text-sm text-gray-600">{profileData.school}</p>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center">
                                    <Calendar className="h-5 w-5 text-gray-500 mr-3" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Data dołączenia</p>
                                        <p className="text-sm text-gray-600">{formatDate(profileData.joined_date)}</p>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Education */}
                        <Card title="Wykształcenie" icon="graduation-cap">
                            {profileData.education && profileData.education.length > 0 ? (
                                <div className="space-y-4">
                                    {profileData.education.map((edu, index) => (
                                        <div key={index} className="flex items-start">
                                            <GraduationCap className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">{edu.degree}</p>
                                                <p className="text-sm text-gray-600">{edu.school}, {edu.year}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-600">Brak informacji</p>
                            )}
                        </Card>

                        {/* Tutor-specific or Student-specific info */}
                        {isTutor ? (
                            <>
                                {/* Teaching Subjects */}
                                <Card title="Przedmioty nauczania" icon="book-open">
                                    {profileData.subjects && profileData.subjects.length > 0 ? (
                                        <div className="flex flex-wrap gap-2">
                                            {profileData.subjects.map((subject, index) => (
                                                <span key={index} className="px-3 py-1 bg-gray-50 text-blue-800 rounded-full text-sm font-medium">
                                                    {subject}
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-600">Brak informacji</p>
                                    )}
                                </Card>

                                {/* Teaching Levels */}
                                <Card title="Poziomy nauczania" icon="users">
                                    {(profileData.teaching_levels && profileData.teaching_levels.length > 0) ||
                                    (profileData.levels && profileData.levels.length > 0) ? (
                                        <div className="flex flex-wrap gap-2">
                                            {profileData.teaching_levels && profileData.teaching_levels.map((level, index) => (
                                                <span key={index} className="px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-sm font-medium">
                                                    {level}
                                                </span>
                                            ))}
                                            {profileData.levels && profileData.levels.map((level, index) => (
                                                <span key={index} className="px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-sm font-medium">
                                                    {level}
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-600">Brak informacji</p>
                                    )}
                                </Card>

                                {/* Pricing */}
                                <Card title="Cennik" icon="dollar-sign">
                                    {(profileData.hourly_rate || profileData.price) ? (
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-gray-700">Stawka godzinowa:</span>
                                                <span className="font-medium text-gray-900">{profileData.hourly_rate || profileData.price} zł/h</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-gray-700">Cena za 45 minut:</span>
                                                <span className="font-medium text-gray-900">{Math.round((profileData.hourly_rate || profileData.price) * 0.75)} zł</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-gray-700">Cena za 90 minut:</span>
                                                <span className="font-medium text-gray-900">{Math.round((profileData.hourly_rate || profileData.price) * 1.5)} zł</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-600">Brak informacji o cenniku</p>
                                    )}
                                </Card>
                            </>
                        ) : (
                            <>
                                {/* Student Interests */}
                                <Card title="Zainteresowania" icon="heart">
                                    {(profileData.interests && profileData.interests.length > 0) ||
                                    (profileData.subjects && profileData.subjects.length > 0) ? (
                                        <div className="flex flex-wrap gap-2">
                                            {profileData.interests && profileData.interests.map((interest, index) => (
                                                <span key={index} className="px-3 py-1 bg-gray-50 text-blue-800 rounded-full text-sm font-medium">
                                                    {interest}
                                                </span>
                                            ))}
                                            {!profileData.interests && profileData.subjects && profileData.subjects.map((subject, index) => (
                                                <span key={index} className="px-3 py-1 bg-gray-50 text-blue-800 rounded-full text-sm font-medium">
                                                    {subject}
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-600">Brak informacji</p>
                                    )}
                                </Card>

                                {/* Learning Goals */}
                                <Card title="Cele edukacyjne" icon="target">
                                    {profileData.learning_goals && profileData.learning_goals.length > 0 ? (
                                        <ul className="space-y-2">
                                            {profileData.learning_goals.map((goal, index) => (
                                                <li key={index} className="flex items-start gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-1.5 flex-shrink-0"></span>
                                                    <span className="text-sm text-gray-700">{goal}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-sm text-gray-600">Brak informacji</p>
                                    )}
                                </Card>
                            </>
                        )}

                        {/* Biography */}
                        <Card title="Biografia" icon="file-text">
                            {profileData.bio ? (
                                <p className="text-sm text-gray-700">{profileData.bio}</p>
                            ) : (
                                <p className="text-sm text-gray-600">Brak informacji</p>
                            )}
                        </Card>
                    </div>
                )
            case "reviews":
                return (
                    <div className="space-y-6">
                        {isTutor ? (
                            // Reviews for tutor
                            <Card title="Opinie uczniów" icon="message-square">
                                {profileData.reviews && profileData.reviews.length > 0 ? (
                                    <div className="space-y-4">
                                        {profileData.reviews.map((review) => (
                                            <div key={review.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                                                <div className="flex justify-between mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100">
                                                            <img
                                                                src={review.student_avatar}
                                                                alt={review.student_name}
                                                                className="w-full h-full object-cover"
                                                                onError={(e) => {
                                                                    e.target.src = "/images/default-avatar.png";
                                                                }}
                                                            />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-900">{review.student_name}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center">
                                                        {renderStars(review.rating)}
                                                    </div>
                                                </div>
                                                <p className="text-sm text-gray-600 mb-1">{review.content}</p>
                                                <p className="text-xs text-gray-400">{formatDate(review.date)}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-600">Brak opinii</p>
                                )}
                            </Card>
                        ) : (
                            // Activity for student
                            <Card title="Aktywność" icon="activity">
                                {profileData.recent_activity && profileData.recent_activity.length > 0 ? (
                                    <div className="space-y-4">
                                        {profileData.recent_activity.map((activity) => (
                                            <div key={activity.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    {activity.type === "lesson" ? (
                                                        <BookOpen className="h-4 w-4 text-blue-600" />
                                                    ) : (
                                                        <FileText className="h-4 w-4 text-green-600" />
                                                    )}
                                                    <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                                                </div>
                                                <div className="flex justify-between">
                                                    <p className="text-xs text-gray-500">
                                                        {activity.type === "lesson" ? (
                                                            <>Nauczyciel: {activity.tutor}</>
                                                        ) : (
                                                            <>Postęp: {activity.progress}%</>
                                                        )}
                                                    </p>
                                                    <p className="text-xs text-gray-400">{formatDate(activity.date)}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-600">Brak aktywności</p>
                                )}
                            </Card>
                        )}
                    </div>
                )
            case "schedule":
                return (
                    <div className="space-y-6">
                        <Card title={isTutor ? "Nadchodzące lekcje" : "Zaplanowane lekcje"} icon="calendar">
                            {profileData.upcoming_lessons && profileData.upcoming_lessons.length > 0 ? (
                                <div className="space-y-4">
                                    {profileData.upcoming_lessons.map((lesson) => (
                                        <div key={lesson.id} className="p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                                            <div className="flex justify-between mb-2">
                                                <h3 className="text-sm font-medium text-gray-900">{lesson.title}</h3>
                                                <span className="text-xs text-gray-500">
                                                    {new Date(lesson.date).toLocaleDateString("pl-PL", {
                                                        day: "numeric",
                                                        month: "long",
                                                    })}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs text-gray-600">
                                                    {new Date(lesson.date).toLocaleTimeString("pl-PL", {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                </span>
                                                <span className="text-xs text-gray-600">
                                                    {isTutor ? `Uczeń: ${lesson.student}` : `Nauczyciel: ${lesson.tutor}`}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-600">Brak zaplanowanych lekcji</p>
                            )}
                        </Card>
                    </div>
                )
            default:
                return <div>Zawartość niedostępna</div>
        }
    }

    return (
        <div className="bg-[#FFFDF7] min-h-screen">
            {/* Cover Photo Section */}
            <div className="relative max-w-7xl px-4 mx-auto">
                <div className="h-64 sm:h-72 w-full bg-gray-300 overflow-hidden rounded-b-xl">
                    <img
                        src={profileData.cover_photo}
                        alt="Cover photo"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.target.src = "/images/default-cover.jpg";
                        }}
                    />
                </div>

                {/* Profile Actions - only show if own profile */}
                {isOwnProfile && (
                    <div className="absolute top-4 right-4 flex space-x-2">
                        <button className="bg-white/80 backdrop-blur-sm hover:bg-white p-2 rounded-full text-gray-700 transition-colors">
                            <Edit className="h-5 w-5" />
                        </button>
                        <button className="bg-white/80 backdrop-blur-sm hover:bg-white p-2 rounded-full text-gray-700 transition-colors">
                            <Settings className="h-5 w-5" />
                        </button>
                    </div>
                )}

                {/* Profile Picture - Positioned to overlap */}
                <div className="absolute -bottom-16 left-8 flex items-end">
                    <div className="w-32 h-32 rounded-full border-4 border-white bg-white shadow-md overflow-hidden">
                        <img
                            src={profileData.avatar}
                            alt={`${profileData.first_name} ${profileData.last_name}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.target.src = "/images/default-avatar.png";
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Profile Info Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-20 mb-6">{/* Changed from max-w-5xl to max-w-7xl */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{profileData.first_name} {profileData.last_name}</h1>
                        <p className="text-gray-600">@{profileData.username}</p>
                        <div className="flex items-center gap-4 mt-2">
                            {isTutor ? (
                                <>
                                    <div className="flex items-center text-sm text-gray-700">
                                        <Star className="h-4 w-4 mr-1 text-yellow-500 fill-yellow-500" />
                                        <span>{profileData.stats?.rating || 0} ({profileData.stats?.reviews_count || 0})</span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-700">
                                        <Users className="h-4 w-4 mr-1" />
                                        <span>{profileData.stats?.active_students || 0} uczniów</span>
                                    </div>
                                </>
                            ) : (
                                <div className="flex items-center text-sm text-gray-700">
                                    <BookOpen className="h-4 w-4 mr-1" />
                                    <span>{profileData.stats?.completed_lessons || 0} lekcji ukończonych</span>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="mt-4 sm:mt-0 flex space-x-3">
                        {isTutor && !isOwnProfile && (
                            <button className="px-4 py-2 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-colors flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                Zarezerwuj lekcję
                            </button>
                        )}
                        {!isOwnProfile && (
                            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full font-medium hover:bg-gray-200 transition-colors flex items-center gap-2">
                                <MessageSquare className="h-4 w-4" />
                                Wiadomość
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Quick Stats Cards */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-6">{/* Changed from max-w-5xl to max-w-7xl */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {isTutor ? (
                        <>
                            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                                <h3 className="text-sm font-medium text-gray-700 mb-2">Przeprowadzone lekcje</h3>
                                <div className="text-2xl font-bold text-black">{profileData.stats?.lessons_count || 0}</div>
                            </div>
                            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                                <h3 className="text-sm font-medium text-gray-700 mb-2">Aktywni uczniowie</h3>
                                <div className="text-2xl font-bold text-black">{profileData.stats?.active_students || 0}</div>
                            </div>
                            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                                <h3 className="text-sm font-medium text-gray-700 mb-2">Średnia ocen</h3>
                                <div className="flex items-center">
                                    <div className="text-2xl font-bold text-black mr-2">{profileData.stats?.rating || 0}</div>
                                    <div className="mt-1">
                                        {renderStars(profileData.stats?.rating || 0)}
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                                <h3 className="text-sm font-medium text-gray-700 mb-2">Liczba opinii</h3>
                                <div className="text-2xl font-bold text-black">{profileData.stats?.reviews_count || 0}</div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                                <h3 className="text-sm font-medium text-gray-700 mb-2">Ukończone lekcje</h3>
                                <div className="text-2xl font-bold text-black">{profileData.stats?.completed_lessons || 0}</div>
                            </div>
                            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                                <h3 className="text-sm font-medium text-gray-700 mb-2">Aktywni nauczyciele</h3>
                                <div className="text-2xl font-bold text-black">{profileData.stats?.active_tutors || 0}</div>
                            </div>
                            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                                <h3 className="text-sm font-medium text-gray-700 mb-2">Wystawione oceny</h3>
                                <div className="flex items-center">
                                    <div className="text-2xl font-bold text-black mr-2">{profileData.stats?.avg_rating_given || 0}</div>
                                    <div className="mt-1">
                                        {renderStars(profileData.stats?.avg_rating_given || 0)}
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                                <h3 className="text-sm font-medium text-gray-700 mb-2">Lekcje w tym miesiącu</h3>
                                <div className="text-2xl font-bold text-black">{profileData.stats?.lessons_this_month || 0}</div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="border-b border-gray-200 mb-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">{/* Changed from max-w-5xl to max-w-7xl */}
                    <nav className="flex space-x-8">
                        <button
                            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                                activeTab === "info"
                                    ? "border-black text-black"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            } transition-colors`}
                            onClick={() => setActiveTab("info")}
                        >
                            <User className="h-4 w-4 mr-2" />
                            Informacje
                        </button>
                        <button
                            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                                activeTab === "reviews"
                                    ? "border-black text-black"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            } transition-colors`}
                            onClick={() => setActiveTab("reviews")}
                        >
                            {isTutor ? (
                                <>
                                    <MessageSquare className="h-4 w-4 mr-2" />
                                    Opinie
                                </>
                            ) : (
                                <>
                                    <Heart className="h-4 w-4 mr-2" />
                                    Aktywność
                                </>
                            )}
                        </button>
                        <button
                            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                                activeTab === "schedule"
                                    ? "border-black text-black"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            } transition-colors`}
                            onClick={() => setActiveTab("schedule")}
                        >
                            <Calendar className="h-4 w-4 mr-2" />
                            Harmonogram
                        </button>
                    </nav>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-12">{/* Changed from max-w-5xl to max-w-7xl */}
                {renderTabContent()}
            </div>
        </div>
    )
}

export default UserProfilePage