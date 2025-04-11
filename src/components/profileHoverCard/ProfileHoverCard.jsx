import { useState, useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { User, Calendar, BookOpen, GraduationCap, Star, Users, MessageSquare, ChevronRight } from "lucide-react"

// Możesz zaimportować userService, jeśli masz
// import { userService } from "../api/services/userService"

/**
 * Komponent karty podglądu profilu wyświetlany po najechaniu na profil użytkownika
 */
const ProfileHoverCard = ({
                              userId,
                              userData: initialUserData,
                              placement = "top",
                              children,
                              onScheduleLesson,
                              onSendMessage,
                              delayShow = 300,
                              delayHide = 200
                          }) => {
    // Stan główny
    const [isVisible, setIsVisible] = useState(false)
    const [userData, setUserData] = useState(initialUserData || null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [cardPosition, setCardPosition] = useState({ top: 0, left: 0 })

    // Referencje
    const triggerRef = useRef(null)
    const cardRef = useRef(null)
    const timerRef = useRef(null)
    const hideTimerRef = useRef(null)

    // Funkcja do pobrania danych użytkownika


    // Funkcja do obliczania pozycji karty
    const calculatePosition = () => {
        if (!triggerRef.current) return { top: 0, left: 0 }

        const triggerRect = triggerRef.current.getBoundingClientRect()
        const scrollTop = window.scrollY || document.documentElement.scrollTop
        const scrollLeft = window.scrollX || document.documentElement.scrollLeft

        console.log("Trigger rect:", triggerRect);

        // Podstawowe pozycje
        const positions = {
            right: {
                top: triggerRect.top,
                left: triggerRect.right + 8 // 8px odstępu
            },
            left: {
                top: triggerRect.top,
                left: triggerRect.left - 288 - 8 // szerokość karty (272px) + margines (8px)
            },
            bottom: {
                top: triggerRect.bottom + 8,
                left: triggerRect.left + (triggerRect.width / 2) - 144 // środkowanie (288px / 2 = 144px)
            },
            top: {
                top: triggerRect.top - 8,
                left: triggerRect.left + (triggerRect.width / 2) - 144
            }
        }

        // Domyślna pozycja + sprawdzenie z krawędziami ekranu
        let position = { ...positions[placement] };
        const windowWidth = window.innerWidth
        const windowHeight = window.innerHeight

        // Sprawdzenie czy karta wychodzi poza ekran i dostosowanie pozycji
        if (position.left < 10) position.left = 10
        if (position.left + 288 > windowWidth - 10) position.left = windowWidth - 288 - 10

        // Sprawdzamy czy dla top/bottom karta będzie widoczna
        if (placement === 'top') {
            const cardHeight = 350 // przybliżona wysokość karty
            if (triggerRect.top < cardHeight) {
                // Zmiana na bottom jeśli nie mieści się na górze
                position = { ...positions.bottom };
            } else {
                position.top = triggerRect.top - cardHeight - 8
            }
        }

        console.log("Calculated position:", position);
        return position
    }

    // Funkcje do obsługi pokazywania i ukrywania karty
    const handleMouseEnter = () => {
        console.log("Mouse enter triggered");
        clearTimeout(hideTimerRef.current)

        // Opóźnienie pokazania, aby uniknąć przypadkowego aktywowania
        timerRef.current = setTimeout(() => {
            console.log("Showing card");
            if (!userData && !loading) {
                fetchUserData()
            }

            // Oblicz pozycję przed pokazaniem
            const position = calculatePosition()
            setCardPosition(position)
            setIsVisible(true)
        }, delayShow)
    }

    const handleMouseLeave = () => {
        console.log("Mouse leave triggered");
        clearTimeout(timerRef.current)

        // Opóźnienie ukrycia, aby dać czas na przeniesienie kursora na kartę
        hideTimerRef.current = setTimeout(() => {
            console.log("Hiding card");
            setIsVisible(false)
        }, delayHide)
    }

    // Obsługa myszy na karcie
    const handleCardMouseEnter = () => {
        console.log("Card mouse enter");
        clearTimeout(hideTimerRef.current)
    }

    const handleCardMouseLeave = () => {
        console.log("Card mouse leave");
        hideTimerRef.current = setTimeout(() => {
            setIsVisible(false)
        }, delayHide)
    }

    // Aktualizacja pozycji przy scrollowaniu i zmianie rozmiaru okna
    useEffect(() => {
        if (!isVisible) return

        const updatePosition = () => {
            const position = calculatePosition()
            setCardPosition(position)
        }

        window.addEventListener('scroll', updatePosition)
        window.addEventListener('resize', updatePosition)

        return () => {
            window.removeEventListener('scroll', updatePosition)
            window.removeEventListener('resize', updatePosition)
        }
    }, [isVisible])

    // Funkcja renderująca oceny w postaci gwiazdek
    const renderStars = (rating) => {
        return (
            <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`h-3 w-3 ${star <= Math.round(rating) ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
                    />
                ))}
            </div>
        )
    }

    // Czyszczenie timerów przy odmontowaniu komponentu
    useEffect(() => {
        return () => {
            clearTimeout(timerRef.current)
            clearTimeout(hideTimerRef.current)
        }
    }, [])

    // Sprawdzenie, czy użytkownik jest korepetytorem
    const isTutor = userData?.role === "tutor"

    return (
        <>
            {/* Element trigger */}
            <div
                ref={triggerRef}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className="inline-block" // Upewniamy się, że trigger jest wyświetlany jako inline-block
            >
                {children}
            </div>

            {/* Karta podglądu profilu - używamy portalu */}
            {isVisible && createPortal(
                <div
                    ref={cardRef}
                    className="fixed z-[9999]" // używamy fixed i bardzo wysokiego z-index
                    style={{
                        top: `${cardPosition.top}px`,
                        left: `${cardPosition.left}px`,
                    }}
                    onMouseEnter={handleCardMouseEnter}
                    onMouseLeave={handleCardMouseLeave}
                >
                    <div className="w-72 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
                        {loading ? (
                            <div className="p-4 space-y-4">
                                <div className="flex items-center space-x-3">
                                    <div className="h-12 w-12 rounded-full bg-gray-200 animate-pulse"></div>
                                    <div className="space-y-2">
                                        <div className="h-4 w-24 bg-gray-200 animate-pulse rounded"></div>
                                        <div className="h-3 w-16 bg-gray-200 animate-pulse rounded"></div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="h-3 w-full bg-gray-200 animate-pulse rounded"></div>
                                    <div className="h-3 w-full bg-gray-200 animate-pulse rounded"></div>
                                    <div className="h-3 w-2/3 bg-gray-200 animate-pulse rounded"></div>
                                </div>
                            </div>
                        ) : error ? (
                            <div className="p-4 text-center text-red-500">
                                <p className="text-sm">{error}</p>
                            </div>
                        ) : userData ? (
                            <>
                                {/* Nagłówek z avatarem */}
                                <div className="relative h-20 bg-gray-100">
                                    {userData.cover_photo && (
                                        <img
                                            src={userData.cover_photo}
                                            alt="Cover"
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.src = "/images/default-cover.jpg"
                                            }}
                                        />
                                    )}
                                    <div className="absolute left-4 -bottom-6">
                                        <div className="w-12 h-12 rounded-full border-2 border-white bg-white shadow-sm overflow-hidden">
                                            <img
                                                src={userData.avatar}
                                                alt={userData.first_name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.src = "/images/default-avatar.png"
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Informacje o użytkowniku */}
                                <div className="pt-8 px-4 pb-4">
                                    <div className="mb-3">
                                        <h3 className="text-sm font-semibold text-gray-900">
                                            {userData.first_name} {userData.last_name}
                                        </h3>
                                        <p className="text-xs text-gray-600">
                                            @{userData.username}
                                        </p>
                                    </div>

                                    {/* Podstawowe informacje */}
                                    <div className="space-y-2 mb-4">
                                        {isTutor ? (
                                            <>
                                                {/* Informacje dla korepetytora */}
                                                <div className="flex items-center space-x-1.5">
                                                    <GraduationCap className="h-3.5 w-3.5 text-gray-500" />
                                                    <span className="text-xs text-gray-700">
                                                        {userData.title || (userData.education && userData.education[0]?.degree)}
                                                    </span>
                                                </div>
                                                <div className="flex items-center space-x-1.5">
                                                    <BookOpen className="h-3.5 w-3.5 text-gray-500" />
                                                    <span className="text-xs text-gray-700">
                                                        {userData.subjects?.slice(0, 3).join(", ")}
                                                        {userData.subjects?.length > 3 && "..."}
                                                    </span>
                                                </div>
                                                <div className="flex items-center space-x-1.5">
                                                    <Users className="h-3.5 w-3.5 text-gray-500" />
                                                    <span className="text-xs text-gray-700">
                                                        {userData.stats?.active_students || 0} aktywnych uczniów
                                                    </span>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                {/* Informacje dla ucznia */}
                                                <div className="flex items-center space-x-1.5">
                                                    <User className="h-3.5 w-3.5 text-gray-500" />
                                                    <span className="text-xs text-gray-700">
                                                        Uczeń {userData.school || ""}
                                                    </span>
                                                </div>
                                                <div className="flex items-center space-x-1.5">
                                                    <Calendar className="h-3.5 w-3.5 text-gray-500" />
                                                    <span className="text-xs text-gray-700">
                                                        {userData.stats?.completed_lessons || 0} ukończonych lekcji
                                                    </span>
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    {/* Oceny dla korepetytora */}
                                    {isTutor && (
                                        <div className="flex items-center mb-4">
                                            <div className="flex items-center">
                                                {renderStars(userData.stats?.rating || 0)}
                                            </div>
                                            <span className="text-xs text-gray-600 ml-1.5">
                                                ({userData.stats?.reviews_count || 0} opinii)
                                            </span>
                                        </div>
                                    )}

                                    {/* Krótki opis */}
                                    {userData.bio && (
                                        <p className="text-xs text-gray-700 line-clamp-2 mb-4">
                                            {userData.bio}
                                        </p>
                                    )}

                                    {/* Przyciski akcji */}
                                    <div className="flex space-x-2">
                                        {isTutor && onScheduleLesson && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onScheduleLesson(userData);
                                                    setIsVisible(false);
                                                }}
                                                className="flex-1 py-1.5 px-2 bg-black hover:bg-gray-800 text-white text-xs font-medium rounded-full transition-colors flex items-center justify-center"
                                            >
                                                <Calendar className="h-3 w-3 mr-1.5" />
                                                Zaplanuj lekcję
                                            </button>
                                        )}
                                        {onSendMessage && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onSendMessage(userData);
                                                    setIsVisible(false);
                                                }}
                                                className="flex-1 py-1.5 px-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-medium rounded-full transition-colors flex items-center justify-center"
                                            >
                                                <MessageSquare className="h-3 w-3 mr-1.5" />
                                                Wiadomość
                                            </button>
                                        )}
                                    </div>

                                    {/* Link do pełnego profilu */}
                                    <a
                                        href={`/user/${userId}`}
                                        className="mt-3 text-xs text-gray-500 hover:text-black flex items-center justify-center transition-colors"
                                    >
                                        Zobacz pełny profil
                                        <ChevronRight className="h-3 w-3 ml-1" />
                                    </a>
                                </div>
                            </>
                        ) : (
                            <div className="p-4 text-center text-gray-500">
                                <p className="text-sm">Brak danych</p>
                            </div>
                        )}
                    </div>
                </div>,
                document.body
            )}
        </>
    )
}

export default ProfileHoverCard