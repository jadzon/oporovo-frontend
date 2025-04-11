// pages/HomePage.jsx
import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue, useAnimation, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
    FaDiscord, FaSearch, FaCalendarAlt, FaGraduationCap,
    FaChalkboardTeacher, FaUserGraduate, FaChartLine,
    FaPhoneAlt, FaStar, FaQuoteLeft, FaBrain, FaBookOpen,
    FaArrowRight, FaLock, FaRocket
} from 'react-icons/fa';
import TutorCard from '../components/tutorCard/TutorCard.jsx';
import { TutorCardSkeleton } from '../components/ui/Skeleton';
import { useModal } from '../hooks/useModal';

// Simple Testimonial slider component
const TestimonialSlider = ({ testimonials }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const controls = useAnimation();

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [testimonials.length]);

    useEffect(() => {
        controls.start({
            opacity: [0, 1],
            y: [50, 0],
            transition: { duration: 0.7, ease: "easeOut" }
        });
    }, [currentIndex, controls]);

    return (
        <div className="relative w-full max-w-3xl mx-auto py-12">
            <FaQuoteLeft className="absolute text-gray-200 text-6xl -top-6 left-0 opacity-50" />

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, y: 50 }}
                    animate={controls}
                    exit={{ opacity: 0, y: -50 }}
                    className="text-center px-8"
                >
                    <p className="text-xl md:text-2xl font-medium text-gray-700 italic mb-6">
                        "{testimonials[currentIndex].text}"
                    </p>
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-black mb-3">
                            <img
                                src={testimonials[currentIndex].image}
                                alt={testimonials[currentIndex].name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <h3 className="font-bold text-gray-900">{testimonials[currentIndex].name}</h3>
                        <p className="text-sm text-gray-500">{testimonials[currentIndex].role}</p>
                    </div>
                </motion.div>
            </AnimatePresence>

            <div className="flex justify-center mt-8 space-x-2">
                {testimonials.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-3 h-3 rounded-full ${
                            index === currentIndex ? "bg-black" : "bg-gray-300"
                        } transition-colors duration-300`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

// Card with 3D tilt effect
const TiltCard = ({ children, className }) => {
    const [rotateX, setRotateX] = useState(0);
    const [rotateY, setRotateY] = useState(0);
    const [scale, setScale] = useState(1);

    const handleMouseMove = (e) => {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateXVal = (y - centerY) / 10;
        const rotateYVal = (centerX - x) / 10;

        setRotateX(rotateXVal);
        setRotateY(rotateYVal);
        setScale(1.05);
    };

    const handleMouseLeave = () => {
        setRotateX(0);
        setRotateY(0);
        setScale(1);
    };

    return (
        <motion.div
            className={`relative transition-all ${className}`}
            style={{
                transformStyle: "preserve-3d",
                transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`,
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            transition={{ duration: 0.5, ease: "easeOut" }}
        >
            {children}
            <div
                className="absolute inset-0 rounded-xl border border-gray-100 bg-gradient-to-br from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity"
                style={{ transform: "translateZ(20px)" }}
            ></div>
        </motion.div>
    );
};

// Main HomePage component
const HomePage = () => {
    const { scrollYProgress } = useScroll();
    const { openLoginModal, openTutorModal } = useModal();

    // Parallax effect values
    const heroImageY = useTransform(scrollYProgress, [0, 0.5], [0, 100]);
    const heroContentY = useTransform(scrollYProgress, [0, 0.5], [0, -50]);
    const gradientOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

    // Hooks for section visibility
    const [heroRef, heroInView] = useInView({ triggerOnce: false, threshold: 0.5 });
    const [aboutRef, aboutInView] = useInView({ triggerOnce: true, threshold: 0.2 });
    const [tutorsRef, tutorsInView] = useInView({ triggerOnce: true, threshold: 0.2 });
    const [howRef, howInView] = useInView({ triggerOnce: true, threshold: 0.2 });
    const [testimonialsRef, testimonialsInView] = useInView({ triggerOnce: true, threshold: 0.2 });

    // State for tutors section
    const [loading, setLoading] = useState(true);
    const [tutors, setTutors] = useState([]);

    // Mock tutor data
    const mockTutors = [
        {
            id: 1,
            name: 'Anna Kowalska',
            image: '/mock-tutors/tutor1.jpg',
            subjects: ['Matematyka', 'Fizyka'],
            shortBio: 'Jestem nauczycielką z 5-letnim doświadczeniem. Specjalizuję się w przygotowaniu do matury z matematyki i fizyki.',
            rating: 5,
            reviewsCount: 48,
            price: 120,
            longBio: 'Jestem nauczycielką z 5-letnim doświadczeniem. Ukończyłam matematykę na Uniwersytecie Warszawskim. Specjalizuję się w przygotowaniu do matury z matematyki i fizyki. Moi uczniowie regularnie osiągają wysokie wyniki na egzaminach.',
            availability: 'Poniedziałek-Piątek: 15:00-20:00, Sobota: 10:00-15:00',
        },
        {
            id: 2,
            name: 'Piotr Nowak',
            image: '/mock-tutors/tutor2.jpg',
            subjects: ['Angielski', 'Niemiecki'],
            shortBio: 'Lektor języków obcych z certyfikatami C2. Pomagam w przygotowaniu do egzaminów i w codziennej komunikacji.',
            rating: 4.8,
            reviewsCount: 36,
            price: 100,
            longBio: 'Lektor języków obcych z certyfikatami C2 z angielskiego i niemieckiego. Mam 7 lat doświadczenia w nauczaniu. Pomagam w przygotowaniu do egzaminów Cambridge, TOEFL i Goethe oraz w codziennej komunikacji.',
            availability: 'Wtorek-Czwartek: 16:00-20:00, Sobota-Niedziela: 12:00-18:00',
        },
        {
            id: 3,
            name: 'Marta Wiśniewska',
            image: '/mock-tutors/tutor3.jpg',
            subjects: ['Chemia', 'Biologia'],
            shortBio: 'Z wykształcenia farmaceutka, z zamiłowania nauczycielka. Tłumaczę najtrudniejsze zagadnienia w prosty sposób.',
            rating: 4.9,
            reviewsCount: 27,
            price: 130,
            longBio: 'Z wykształcenia farmaceutka, z zamiłowania nauczycielka. Ukończyłam farmację na Uniwersytecie Medycznym. Tłumaczę najtrudniejsze zagadnienia w prosty sposób. Pomagam w przygotowaniu do matury i egzaminów na kierunki medyczne.',
            availability: 'Poniedziałek, Środa, Piątek: 16:00-20:00, Sobota: 10:00-14:00',
        },
        {
            id: 4,
            name: 'Tomasz Kamiński',
            image: '/mock-tutors/tutor4.jpg',
            subjects: ['Informatyka', 'Programowanie'],
            shortBio: 'Programista z 10-letnim stażem. Uczę programowania w Python, JavaScript i podstaw algorytmiki.',
            rating: 4.7,
            reviewsCount: 19,
            price: 150,
            longBio: 'Programista z 10-letnim stażem w branży IT. Pracuję jako senior developer. Uczę programowania w językach Python, JavaScript oraz podstaw algorytmiki i struktur danych. Pomagam w przygotowaniu projektów i w nauce od podstaw.',
            availability: 'Poniedziałek-Czwartek: 18:00-21:00, Sobota: 14:00-18:00',
        },
    ];

    // Testimonial data
    const testimonials = [
        {
            name: "Michał Nowak",
            role: "Student informatyki",
            text: "Dzięki zajęciom na Oporovo zdałem maturę z matematyki na 98%. Korepetytorzy są świetnie przygotowani i potrafią wytłumaczyć nawet najtrudniejsze zagadnienia.",
            image: "/mock-tutors/testimonial1.jpg"
        },
        {
            name: "Julia Kowalczyk",
            role: "Uczennica liceum",
            text: "Polecam każdemu, kto ma problemy z nauką. Odkąd korzystam z Oporovo, moje oceny znacznie się poprawiły. Platforma jest intuicyjna, a korepetytorzy zawsze pomocni.",
            image: "/mock-tutors/testimonial2.jpg"
        },
        {
            name: "Adam Wiśniewski",
            role: "Student medycyny",
            text: "Oporovo to strzał w dziesiątkę! Zajęcia przez Discord są bardzo wygodne, a jakość nauczania jest na najwyższym poziomie. Dzięki temu dostałem się na wymarzone studia.",
            image: "/mock-tutors/testimonial3.jpg"
        }
    ];

    // Steps for "How it works" section
    const steps = [
        {
            icon: <FaDiscord className="text-white text-3xl" />,
            title: 'Połącz konto Discord',
            description: 'Zaloguj się przez Discord, aby uzyskać dostęp do platformy i korepetytorów.',
            color: 'from-purple-500 to-indigo-600'
        },
        {
            icon: <FaCalendarAlt className="text-white text-3xl" />,
            title: 'Wybierz termin',
            description: 'Przeglądaj profile korepetytorów i zarezerwuj termin, który Ci pasuje.',
            color: 'from-blue-500 to-cyan-600'
        },
        {
            icon: <FaGraduationCap className="text-white text-3xl" />,
            title: 'Ucz się przez Discord',
            description: 'Dołącz do spotkania w wybranym terminie i korzystaj z korepetycji przez Discord.',
            color: 'from-emerald-500 to-teal-600'
        },
    ];

    // Simulate loading tutors data
    useEffect(() => {
        const timer = setTimeout(() => {
            setTutors(mockTutors);
            setLoading(false);
        }, 1500);

        return () => clearTimeout(timer);
    }, []);

    // Scroll progress indicator
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    return (
        <div className="relative">
            {/* Scroll progress indicator */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-1 bg-black z-50 origin-left"
                style={{ scaleX }}
            />

            {/* HERO SECTION */}
            <section
                ref={heroRef}
                className="relative h-screen flex items-center justify-center overflow-hidden bg-[#FFFDF7]"
                id="hero"
            >
                {/* Background gradient overlay */}
                <motion.div
                    className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent mix-blend-overlay z-10"
                    style={{ opacity: gradientOpacity }}
                />

                {/* Parallax background image */}
                <motion.div
                    className="absolute inset-0 z-0"
                    style={{ y: heroImageY }}
                >
                    <div className="h-full w-full bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('../../../public/temp_data/classroom.png')" }}>
                        <div className="absolute inset-0 bg-black/40" />
                    </div>
                </motion.div>

                {/* Hero content */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
                    <motion.div
                        className="text-center"
                        initial={{ opacity: 0, y: 50 }}
                        animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        style={{ y: heroContentY }}
                    >
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-white drop-shadow-lg">
                            Odkryj nowy sposób <br/> na <span className="text-white underline decoration-4 decoration-black">efektywną naukę</span>
                        </h1>

                        <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-10 drop-shadow-md">
                            Oporovo łączy uczniów z najlepszymi korepetytorami przez Discord.
                            Zarezerwuj lekcje online i rozwijaj swoje umiejętności.
                        </p>

                        <div className="flex flex-wrap justify-center gap-4">
                            <motion.button
                                onClick={openLoginModal}
                                className="px-8 py-4 bg-white hover:bg-gray-100 text-black text-base font-medium rounded-full shadow-lg flex items-center group relative overflow-hidden"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <FaDiscord className="text-2xl mr-3 text-[#5865F2] group-hover:scale-110 transition-transform" />
                                <span className="relative z-10">Zaloguj się przez Discord</span>
                                <motion.span
                                    className="absolute bottom-0 left-0 right-0 h-1 bg-[#5865F2]"
                                    initial={{ width: 0 }}
                                    whileHover={{ width: "100%" }}
                                    transition={{ duration: 0.3 }}
                                />
                            </motion.button>

                            <motion.button
                                onClick={() => window.location.href = '/tutors'}
                                className="px-8 py-4 bg-black/80 backdrop-blur-sm hover:bg-black text-white text-base font-medium rounded-full shadow-lg flex items-center"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <FaSearch className="mr-3" />
                                Znajdź korepetytora
                            </motion.button>
                        </div>
                    </motion.div>
                </div>

                {/* Scroll indicator */}
                <motion.div
                    className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20 flex flex-col items-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                >
                    <p className="text-white text-sm mb-3 font-medium tracking-wider">SCROLL DOWN</p>
                    <motion.div
                        className="w-6 h-10 border-2 border-white rounded-full flex justify-center p-1"
                        initial={{ y: 0 }}
                        animate={{ y: [0, 10, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                        <motion.div className="w-1.5 h-2 bg-white rounded-full" />
                    </motion.div>
                </motion.div>
            </section>

            {/* Features section */}
            <section className="py-20 bg-[#FFFDF7]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true, margin: "-100px" }}
                    >
                        <motion.div
                            className="inline-block mb-3"
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
                            viewport={{ once: true }}
                        >
              <span className="bg-black/10 text-black px-4 py-1.5 rounded-full text-sm font-medium">
                Dlaczego Oporovo?
              </span>
                        </motion.div>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Innowacyjne podejście do nauki</h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Wykorzystujemy technologię aby połączyć najlepszych korepetytorów z ambitnymi uczniami.
                            Nauka nigdy nie była tak wygodna i efektywna.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                title: "Lekcje przez Discord",
                                description: "Ucz się w znajomym środowisku Discord, bez potrzeby instalowania nowych aplikacji.",
                                icon: <FaDiscord className="text-3xl text-[#5865F2]" />,
                                delay: 0.1
                            },
                            {
                                title: "Zweryfikowani nauczyciele",
                                description: "Wszyscy korepetytorzy przechodzą dokładną weryfikację, zapewniając wysoką jakość nauczania.",
                                icon: <FaChalkboardTeacher className="text-3xl text-black" />,
                                delay: 0.3
                            },
                            {
                                title: "Elastyczny harmonogram",
                                description: "Wybierz dogodny termin z kalendarzem dostępnych godzin twojego korepetytora.",
                                icon: <FaCalendarAlt className="text-3xl text-black" />,
                                delay: 0.5
                            },
                            {
                                title: "Spersonalizowane lekcje",
                                description: "Każda lekcja jest dostosowana do twoich indywidualnych potrzeb i tempa nauki.",
                                icon: <FaUserGraduate className="text-3xl text-black" />,
                                delay: 0.2
                            },
                            {
                                title: "Śledzenie postępów",
                                description: "Monitoruj swoje postępy i osiągnięcia dzięki zaawansowanym narzędziom analitycznym.",
                                icon: <FaChartLine className="text-3xl text-black" />,
                                delay: 0.4
                            },
                            {
                                title: "Wsparcie 24/7",
                                description: "Nasz zespół jest dostępny przez całą dobę, aby pomóc ci w razie jakichkolwiek problemów.",
                                icon: <FaPhoneAlt className="text-3xl text-black" />,
                                delay: 0.6
                            }
                        ].map((feature, index) => (
                            <TiltCard key={index} className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 relative">
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: feature.delay }}
                                    viewport={{ once: true }}
                                    className="relative z-10"
                                >
                                    <div className="mb-4">{feature.icon}</div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                                    <p className="text-gray-600">{feature.description}</p>
                                </motion.div>
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-black/0 via-black to-black/0" />
                            </TiltCard>
                        ))}
                    </div>
                </div>
            </section>

            {/* ABOUT US SECTION */}
            <section className="py-24 bg-[#FFFDF7]" ref={aboutRef} id="about">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={aboutInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
              <span className="bg-black/10 text-black px-4 py-1.5 rounded-full text-sm font-medium">
                O platformie
              </span>
                            <h2 className="text-4xl font-bold text-gray-900 mt-4 mb-6">
                                Reimagined Learning <br />for Digital Natives
                            </h2>
                            <p className="text-lg text-gray-600 mb-6">
                                Oporovo to innowacyjna platforma korepetycji online, która łączy uczniów i studentów
                                z doświadczonymi korepetytorami za pośrednictwem Discord. Nasza misja to uczynienie
                                edukacji bardziej dostępną i wygodną dla wszystkich.
                            </p>

                            <div className="space-y-4 mb-8">
                                {[
                                    "Lekcje jeden na jeden z ekspertami w swojej dziedzinie",
                                    "Nauka w przyjaznym i znajomym środowisku Discord",
                                    "Elastyczny harmonogram dostosowany do Twoich potrzeb",
                                    "Materiały dydaktyczne dostępne w chmurze"
                                ].map((item, index) => (
                                    <motion.div
                                        key={index}
                                        className="flex items-start"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={aboutInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                                        transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                                    >
                                        <div className="mr-3 mt-1 text-black">
                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM8 15L3 10L4.41 8.59L8 12.17L15.59 4.58L17 6L8 15Z" fill="currentColor" />
                                            </svg>
                                        </div>
                                        <p className="text-gray-700">{item}</p>
                                    </motion.div>
                                ))}
                            </div>

                            <motion.button
                                className="px-8 py-3 bg-black text-white font-medium rounded-full inline-flex items-center"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={aboutInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                                transition={{ duration: 0.5, delay: 0.8 }}
                            >
                                <FaRocket className="mr-2" />
                                Dołącz do nas
                            </motion.button>
                        </motion.div>

                        <div className="relative">
                            <motion.div
                                className="absolute -top-6 -left-6 w-full h-full border-2 border-black rounded-2xl"
                                initial={{ opacity: 0, x: 30, y: 30 }}
                                animate={aboutInView ? { opacity: 0.5, x: 0, y: 0 } : { opacity: 0, x: 30, y: 30 }}
                                transition={{ duration: 0.8, delay: 0.4 }}
                            />

                            <motion.div
                                className="relative z-10 overflow-hidden rounded-2xl shadow-xl"
                                initial={{ opacity: 0, x: 50 }}
                                animate={aboutInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                            >
                                <img
                                    src="../../../public/temp_data/construction.png"
                                    alt="O Oporovo"
                                    className="w-full h-auto rounded-2xl shadow-lg"
                                />

                                {/* Floating elements */}
                                <motion.div
                                    className="absolute top-5 right-5 bg-white p-4 rounded-xl shadow-lg flex items-center"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={aboutInView ?
                                        { opacity: 1, y: 0, x: 0 } :
                                        { opacity: 0, y: 20 }
                                    }
                                    transition={{ duration: 0.5, delay: 0.6 }}
                                >
                                    <FaStar className="text-yellow-400 mr-2" />
                                    <span className="font-bold">4.9/5</span>
                                    <span className="text-gray-600 text-sm ml-2">Ocena</span>
                                </motion.div>

                                <motion.div
                                    className="absolute bottom-5 left-5 bg-white p-3 rounded-xl shadow-lg"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={aboutInView ?
                                        { opacity: 1, y: 0, x: 0 } :
                                        { opacity: 0, y: 20 }
                                    }
                                    transition={{ duration: 0.5, delay: 0.8 }}
                                >
                                    <FaLock className="text-black text-xl" />
                                </motion.div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* HOW IT WORKS SECTION */}
            <section className="py-20 bg-black text-white" ref={howRef} id="how-it-works">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 30 }}
                        animate={howInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">Jak to działa?</h2>
                        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                            Proces nauki z Oporovo jest prosty, intuicyjny i dostosowany do potrzeb dzisiejszych uczniów.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {steps.map((step, index) => (
                            <motion.div
                                key={index}
                                className="relative"
                                initial={{ opacity: 0, y: 50 }}
                                animate={howInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                                transition={{ duration: 0.8, delay: 0.2 + index * 0.2 }}
                            >
                                <div className={`h-full bg-gradient-to-br ${step.color} rounded-2xl p-8`}>
                                    <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mb-6">
                                        {step.icon}
                                    </div>
                                    <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                                    <p className="text-gray-200">{step.description}</p>

                                    {/* Number indicator */}
                                    <div className="absolute top-6 right-6 bg-white/10 backdrop-blur-sm h-12 w-12 rounded-full flex items-center justify-center text-white border border-white/20">
                                        <span className="text-xl font-bold">{index + 1}</span>
                                    </div>

                                    {/* Arrow connector */}
                                    {index < steps.length - 1 && (
                                        <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                                            <FaArrowRight className="text-3xl text-white/50" />
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div
                        className="mt-16 text-center"
                        initial={{ opacity: 0, y: 30 }}
                        animate={howInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                        transition={{ duration: 0.8, delay: 0.8 }}
                    >
                        <motion.button
                            onClick={openLoginModal}
                            className="px-8 py-4 bg-white text-black font-medium rounded-full inline-flex items-center"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <FaDiscord className="mr-2 text-[#5865F2]" />
                            Rozpocznij teraz
                        </motion.button>
                    </motion.div>
                </div>
            </section>

            {/* TESTIMONIALS SECTION */}
            <section className="py-20 bg-white" ref={testimonialsRef} id="testimonials">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 30 }}
                        animate={testimonialsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                        transition={{ duration: 0.8 }}
                    >
            <span className="bg-black/10 text-black px-4 py-1.5 rounded-full text-sm font-medium">
              Opinie uczniów
            </span>
                        <h2 className="text-4xl font-bold text-gray-900 mt-4 mb-6">Co mówią o nas uczniowie?</h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Poznaj opinie osób, które skorzystały z Oporovo i osiągnęły swoje cele edukacyjne.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={testimonialsInView ? { opacity: 1 } : { opacity: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <TestimonialSlider testimonials={testimonials} />
                    </motion.div>
                </div>
            </section>

            {/* TOP TUTORS SECTION */}
            <section className="py-20 bg-[#FFFDF7]" ref={tutorsRef} id="tutors">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 30 }}
                        animate={tutorsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                        transition={{ duration: 0.8 }}
                    >
            <span className="bg-black/10 text-black px-4 py-1.5 rounded-full text-sm font-medium">
              Najlepsi z najlepszych
            </span>
                        <h2 className="text-4xl font-bold text-gray-900 mt-4 mb-6">Poznaj naszych korepetytorów</h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Wybierz spośród setek wykwalifikowanych nauczycieli, którzy pomogą Ci osiągnąć Twoje cele edukacyjne.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {loading
                            ? Array.from({ length: 4 }).map((_, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={tutorsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                >
                                    <TutorCardSkeleton />
                                </motion.div>
                            ))
                            : tutors.map((tutor, index) => (
                                <motion.div
                                    key={tutor.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={tutorsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                    whileHover={{ y: -10 }}
                                    className="h-full"
                                >
                                    <TutorCard tutor={tutor} onClick={() => openTutorModal(tutor)} />
                                </motion.div>
                            ))}
                    </div>

                    <motion.div
                        className="mt-12 text-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={tutorsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                    >
                        <motion.button
                            className="px-8 py-3 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-full shadow-sm transition-colors inline-flex items-center"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <FaSearch className="mr-2" />
                            Zobacz wszystkich korepetytorów
                        </motion.button>
                    </motion.div>
                </div>
            </section>

            {/* CALL TO ACTION */}
            <section className="py-24 relative overflow-hidden bg-black">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.div
                        className="text-center"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-5xl md:text-6xl font-bold text-white mb-8">
                            Gotowy, by zacząć swoją <br/>edukacyjną podróż?
                        </h2>
                        <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">
                            Dołącz do tysięcy zadowolonych uczniów i rozpocznij naukę w nowy, efektywny sposób.
                        </p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            viewport={{ once: true }}
                            className="flex flex-wrap justify-center gap-4"
                        >
                            <motion.button
                                onClick={openLoginModal}
                                className="px-8 py-4 bg-white hover:bg-gray-100 text-black text-base font-bold rounded-full shadow-lg flex items-center group relative overflow-hidden"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <FaDiscord className="text-xl mr-3 text-[#5865F2] group-hover:scale-110 transition-transform" />
                                <span className="relative z-10">Rozpocznij teraz</span>
                            </motion.button>

                            <motion.button
                                onClick={() => window.location.href = '/tutors'}
                                className="px-8 py-4 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white text-base font-bold rounded-full shadow-lg flex items-center"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <FaSearch className="mr-3" />
                                Przeglądaj korepetytorów
                            </motion.button>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-100 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div>
                            <img src="/logo.png" alt="Oporovo" className="h-8 mb-6" />
                            <p className="text-gray-600 mb-6">
                                Platforma korepetycji online, która łączy uczniów z najlepszymi korepetytorami przez Discord.
                            </p>
                            <div className="flex space-x-4">
                                <a href="#" className="text-gray-400 hover:text-black transition-colors">
                                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                                    </svg>
                                </a>
                                <a href="#" className="text-gray-400 hover:text-black transition-colors">
                                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                                    </svg>
                                </a>
                                <a href="#" className="text-gray-400 hover:text-black transition-colors">
                                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                                    </svg>
                                </a>
                                <a href="#" className="text-gray-400 hover:text-[#5865F2] transition-colors">
                                    <FaDiscord className="h-6 w-6" />
                                </a>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
                                Nawigacja
                            </h3>
                            <ul className="space-y-3">
                                <li>
                                    <a href="#hero" className="text-gray-600 hover:text-black transition-colors">
                                        Strona główna
                                    </a>
                                </li>
                                <li>
                                    <a href="#about" className="text-gray-600 hover:text-black transition-colors">
                                        O nas
                                    </a>
                                </li>
                                <li>
                                    <a href="#how-it-works" className="text-gray-600 hover:text-black transition-colors">
                                        Jak to działa
                                    </a>
                                </li>
                                <li>
                                    <a href="#tutors" className="text-gray-600 hover:text-black transition-colors">
                                        Korepetytorzy
                                    </a>
                                </li>
                                <li>
                                    <a href="#testimonials" className="text-gray-600 hover:text-black transition-colors">
                                        Opinie
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
                                Wsparcie
                            </h3>
                            <ul className="space-y-3">
                                <li>
                                    <a href="#" className="text-gray-600 hover:text-black transition-colors">
                                        Centrum pomocy
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-600 hover:text-black transition-colors">
                                        Kontakt
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-600 hover:text-black transition-colors">
                                        FAQ
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-600 hover:text-black transition-colors">
                                        Status platformy
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
                                Informacje
                            </h3>
                            <ul className="space-y-3">
                                <li>
                                    <a href="#" className="text-gray-600 hover:text-black transition-colors">
                                        Regulamin
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-600 hover:text-black transition-colors">
                                        Polityka prywatności
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-600 hover:text-black transition-colors">
                                        Dla korepetytorów
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-600 hover:text-black transition-colors">
                                        Blog
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center">
                        <p className="text-gray-500 text-sm">
                            &copy; {new Date().getFullYear()} Oporovo. Wszystkie prawa zastrzeżone.
                        </p>
                        <div className="mt-4 md:mt-0 flex space-x-4">
                            <a href="#" className="text-gray-500 hover:text-black transition-colors text-sm">
                                Regulamin
                            </a>
                            <a href="#" className="text-gray-500 hover:text-black transition-colors text-sm">
                                Polityka prywatności
                            </a>
                            <a href="#" className="text-gray-500 hover:text-black transition-colors text-sm">
                                Cookies
                            </a>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Floating "Back to top" button */}
            <motion.button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="fixed bottom-8 right-8 bg-black text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg z-40"
                initial={{ opacity: 0, y: 100 }}
                animate={{
                    opacity: scrollYProgress.get() > 0.1 ? 1 : 0,
                    y: scrollYProgress.get() > 0.1 ? 0 : 100
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
            </motion.button>
        </div>
    );
};

export default HomePage;