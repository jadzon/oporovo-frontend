import { useState, useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { User, Calendar, BookOpen, GraduationCap, MessageSquare, ChevronRight } from "lucide-react"
import {useModal} from "../modal/index.js";

const ProfileHoverCard = ({
                              userId,
                              userData: initialUserData,
                              placement = "right",
                              children,
                              onScheduleLesson,
                              onSendMessage,
                              delayShow = 300,
                              delayHide = 200
                          }) => {
    const { openScheduleModal} = useModal();
    const [isVisible, setIsVisible] = useState(false)
    const [userData, setUserData] = useState(initialUserData || null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [position, setPosition] = useState({ top: 0, left: 0 })

    const triggerRef = useRef(null)
    const cardRef = useRef(null)
    const showTimerRef = useRef(null)
    const hideTimerRef = useRef(null)

    // Funkcja pobierająca dane użytkownika - zakładamy, że mamy userData z propsa
    const fetchUserData = () => {
        // Implementacja pobierania danych użytkownika jeśli potrzebna
        console.log("Would fetch data for user:", userId);
    }

    // Obliczanie pozycji karty z uwzględnieniem mniejszej wysokości
    const calculatePosition = () => {
        if (!triggerRef.current) return { top: 0, left: 0 }

        const rect = triggerRef.current.getBoundingClientRect()
        const cardWidth = 288
        const cardHeight = 320

        let top = 0
        let left = 0

        // Pozycjonowanie w zależności od opcji placement
        switch (placement) {
            case "right":
                top = rect.top
                left = rect.right + 8
                break
            case "left":
                top = rect.top
                left = rect.left - cardWidth - 8
                break
            case "bottom":
                top = rect.bottom + 8
                left = rect.left + (rect.width / 2) - (cardWidth / 2)
                break
            case "top":
                top = rect.top - cardHeight - 8
                left = rect.left + (rect.width / 2) - (cardWidth / 2)
                break
            default:
                top = rect.top
                left = rect.right + 8
        }

        // Sprawdzenie i dostosowanie, aby karta nie wychodziła poza ekran
        const windowWidth = window.innerWidth
        const windowHeight = window.innerHeight

        // Dostosowanie poziome
        if (left < 10) left = 10
        if (left + cardWidth > windowWidth - 10) {
            left = windowWidth - cardWidth - 10
        }

        // Dostosowanie pionowe - jeśli nie mieści się na górze, pokaż na dole i odwrotnie
        if (placement === "top" && rect.top < cardHeight + 20) {
            // Niewystarczająco miejsca na górze, przełącz na dół
            top = rect.bottom + 8
        } else if (placement === "bottom" && rect.bottom + cardHeight > windowHeight - 10) {
            // Niewystarczająco miejsca na dole, przełącz na górę, jeśli jest tam więcej miejsca
            if (rect.top > windowHeight - rect.bottom) {
                top = Math.max(10, rect.top - cardHeight - 8)
            }
        }

        return { top, left }
    }

    // Aktualizacja pozycji przy scrollowaniu i zmianie rozmiaru
    useEffect(() => {
        if (!isVisible) return

        const updatePosition = () => {
            const newPosition = calculatePosition()
            setPosition(newPosition)
        }

        window.addEventListener('scroll', updatePosition)
        window.addEventListener('resize', updatePosition)

        return () => {
            window.removeEventListener('scroll', updatePosition)
            window.removeEventListener('resize', updatePosition)
        }
    }, [isVisible])

    // Pokazywanie karty po najechaniu
    const handleMouseEnter = () => {
        clearTimeout(hideTimerRef.current)

        showTimerRef.current = setTimeout(() => {
            if (!userData && !loading) {
                fetchUserData()
            }

            const pos = calculatePosition()
            setPosition(pos)
            setIsVisible(true)
        }, delayShow)
    }

    // Ukrywanie karty po zjechaniu
    const handleMouseLeave = () => {
        clearTimeout(showTimerRef.current)

        hideTimerRef.current = setTimeout(() => {
            setIsVisible(false)
        }, delayHide)
    }

    // Obsługa najechania na samą kartę
    const handleCardMouseEnter = () => {
        clearTimeout(hideTimerRef.current)
    }

    const handleCardMouseLeave = () => {
        hideTimerRef.current = setTimeout(() => {
            setIsVisible(false)
        }, delayHide)
    }

    // Czyszczenie timerów przy odmontowaniu
    useEffect(() => {
        return () => {
            clearTimeout(showTimerRef.current)
            clearTimeout(hideTimerRef.current)
        }
    }, [])

    // Sprawdzenie typu użytkownika (korepetytor czy uczeń)
    const isTutor = userData?.role === "tutor"

    return (
        <>
            {/* Element wyzwalający hover card */}
            <div
                ref={triggerRef}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                style={{ display: 'inline-block' }}
            >
                {children}
            </div>

            {/* Portal do body dla karty */}
            {isVisible && createPortal(
                <div
                    ref={cardRef}
                    style={{
                        position: 'fixed',
                        top: `${position.top}px`,
                        left: `${position.left}px`,
                        zIndex: 9999,
                    }}
                    onMouseEnter={handleCardMouseEnter}
                    onMouseLeave={handleCardMouseLeave}
                >
                    <div className="w-72 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
                        {/* Stany ładowania */}
                        {loading ? (
                            <div className="p-4">
                                <div className="flex items-center space-x-3 mb-4">
                                    <div className="h-12 w-12 rounded-full bg-gray-200 animate-pulse"></div>
                                    <div className="space-y-2">
                                        <div className="h-4 w-24 bg-gray-200 animate-pulse rounded"></div>
                                        <div className="h-3 w-16 bg-gray-200 animate-pulse rounded"></div>
                                    </div>
                                </div>
                            </div>
                        ) : error ? (
                            <div className="p-4 text-center text-red-500">
                                <p className="text-sm">{error}</p>
                            </div>
                        ) : userData ? (
                            <>
                                {/* Nagłówek z tłem */}
                                <div className="relative h-20 bg-gray-100">
                                    <div className="absolute left-4 -bottom-6">
                                        <div className="w-12 h-12 rounded-full border-2 border-white bg-white shadow-sm overflow-hidden">
                                            <img
                                                src={userData.avatar || "/images/default-avatar.png"}
                                                alt={userData.first_name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => { e.target.src = "/images/default-avatar.png" }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Informacje o użytkowniku - UPROSZCZONE */}
                                <div className="pt-8 px-4 pb-4">
                                    <div className="mb-3">
                                        <h3 className="text-sm font-semibold text-gray-900">
                                            {userData.first_name} {userData.last_name}
                                        </h3>
                                        <p className="text-xs text-gray-600">
                                            @{userData.username}
                                        </p>
                                    </div>

                                    {/* TYLKO PODSTAWOWE INFO: rola, przedmioty, poziom */}
                                    <div className="space-y-2 mb-4">
                                        {/* Rola */}
                                        <div className="flex items-center space-x-1.5">
                                            {isTutor ? (
                                                <>
                                                    <GraduationCap className="h-3.5 w-3.5 text-gray-500" />
                                                    <span className="text-xs text-gray-700">Korepetytor</span>
                                                </>
                                            ) : (
                                                <>
                                                    <User className="h-3.5 w-3.5 text-gray-500" />
                                                    <span className="text-xs text-gray-700">Uczeń</span>
                                                </>
                                            )}
                                        </div>

                                        {/* Przedmioty - maksymalnie 2 + liczba pozostałych */}
                                        {userData.subjects?.length > 0 && (
                                            <div className="flex items-center space-x-1.5">
                                                <BookOpen className="h-3.5 w-3.5 text-gray-500" />
                                                <span className="text-xs text-gray-700">
                                                    {userData.subjects.length <= 2
                                                        ? userData.subjects.join(", ")
                                                        : `${userData.subjects.slice(0, 2).join(", ")} +${userData.subjects.length - 2}`
                                                    }
                                                </span>
                                            </div>
                                        )}

                                        {/* Poziomy - maksymalnie 2 + liczba pozostałych */}
                                        {userData.levels?.length > 0 && (
                                            <div className="flex items-center space-x-1.5">
                                                <GraduationCap className="h-3.5 w-3.5 text-gray-500" />
                                                <span className="text-xs text-gray-700">
                                                    {userData.levels.length <= 2
                                                        ? userData.levels.join(", ")
                                                        : `${userData.levels.slice(0, 2).join(", ")} +${userData.levels.length - 2}`
                                                    }
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Action buttons */}
                                    <div className="flex space-x-2">
                                        {isTutor && onScheduleLesson && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    openScheduleModal(userData.id)
                                                    setIsVisible(false)
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
                                                    e.stopPropagation()
                                                    onSendMessage(userData)
                                                    setIsVisible(false)
                                                }}
                                                className="flex-1 py-1.5 px-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-medium rounded-full transition-colors flex items-center justify-center"
                                            >
                                                <MessageSquare className="h-3 w-3 mr-1.5" />
                                                Wiadomość
                                            </button>
                                        )}
                                    </div>

                                    {/* Link to profile */}
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
                                <p className="text-sm">Brak danych o użytkowniku</p>
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