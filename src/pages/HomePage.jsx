// pages/HomePage.jsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaDiscord, FaSearch, FaCalendarAlt, FaGraduationCap } from 'react-icons/fa';
import TutorCard from '../components/tutorCard/TutorCard.jsx';
import { TutorCardSkeleton } from '../components/ui/Skeleton';
import { useModal } from '../hooks/useModal';

const HomePage = () => {
    const { openLoginModal, openTutorModal } = useModal();

    // Hooks for section visibility
    const [aboutRef, aboutInView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    const [tutorsRef, tutorsInView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

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

    // Simulate loading tutors data
    useEffect(() => {
        const timer = setTimeout(() => {
            setTutors(mockTutors);
            setLoading(false);
        }, 1500);

        return () => clearTimeout(timer);
    }, []);

    // Steps for "How it works" section
    const steps = [
        {
            icon: <FaDiscord className="text-blue-900 text-3xl" />,
            title: 'Połącz konto Discord',
            description: 'Zaloguj się przez Discord, aby uzyskać dostęp do platformy i korepetytorów.',
        },
        {
            icon: <FaCalendarAlt className="text-blue-900 text-3xl" />,
            title: 'Wybierz termin',
            description: 'Przeglądaj profile korepetytorów i zarezerwuj termin, który Ci pasuje.',
        },
        {
            icon: <FaGraduationCap className="text-blue-900 text-3xl" />,
            title: 'Ucz się przez Discord',
            description: 'Dołącz do spotkania w wybranym terminie i korzystaj z korepetycji przez Discord.',
        },
    ];

    return (
        <div className="bg-gray-50">
            {/* HERO SECTION */}
            <section className="pt-24 pb-16 bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row items-center">
                        {/* Left side - Text content */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="lg:w-1/2 text-center lg:text-left"
                        >
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
                                Znajdź idealnego <span className="text-blue-900">korepetytora</span> na Oporovo
                            </h1>
                            <p className="mt-6 text-xl text-gray-700 max-w-lg mx-auto lg:mx-0">
                                Oporovo to platforma, która łączy uczniów z najlepszymi korepetytorami przez Discord.
                                Zarezerwuj lekcje online i rozwijaj swoje umiejętności.
                            </p>
                            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                <button
                                    onClick={openLoginModal}
                                    className="px-6 py-3 bg-blue-900 hover:bg-blue-800 text-white text-base font-medium rounded-md shadow-sm transition-colors flex items-center justify-center"
                                >
                                    <FaDiscord className="mr-2" />
                                    Zaloguj się
                                </button>
                                <button
                                    onClick={() => window.location.href = '/tutors'}
                                    className="px-6 py-3 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-base font-medium rounded-md shadow-sm transition-colors flex items-center justify-center"
                                >
                                    <FaSearch className="mr-2" />
                                    Szukaj korepetytorów
                                </button>
                            </div>
                        </motion.div>

                        {/* Right side - Image */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="lg:w-1/2 mt-12 lg:mt-0"
                        >
                            <img
                                src="../../../public/temp_data/classroom.png"
                                alt="Oporovo - platforma korepetycji online"
                                className="w-full h-auto rounded-lg shadow-sm"
                            />
                        </motion.div>
                    </div>

                    {/* Features */}
                    <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            {
                                title: 'Łatwy dostęp',
                                description: 'Korzystaj z korepetycji bezpośrednio przez Discord, bez instalowania dodatkowych aplikacji.',
                                icon: '🚀',
                                delay: 0.3
                            },
                            {
                                title: 'Sprawdzeni korepetytorzy',
                                description: 'Wszyscy korepetytorzy przechodzą weryfikację i posiadają potwierdzone kwalifikacje.',
                                icon: '✅',
                                delay: 0.4
                            },
                            {
                                title: 'Elastyczny harmonogram',
                                description: 'Wybierz dogodne terminy i rezerwuj lekcje w kilka kliknięć.',
                                icon: '📅',
                                delay: 0.5
                            },
                        ].map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: feature.delay }}
                                className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
                            >
                                <div className="text-3xl mb-4">{feature.icon}</div>
                                <h3 className="text-lg font-medium text-gray-900">{feature.title}</h3>
                                <p className="mt-2 text-gray-600">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ABOUT US SECTION */}
            <section className="py-16 bg-white" ref={aboutRef}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={aboutInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl font-bold text-gray-900">O Oporovo</h2>
                        <p className="mt-4 text-lg text-gray-700 max-w-3xl mx-auto">
                            Oporovo to innowacyjna platforma korepetycji online, która łączy uczniów i studentów
                            z doświadczonymi korepetytorami za pośrednictwem Discord. Nasza misja to uczynienie
                            edukacji bardziej dostępną i wygodną dla wszystkich.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={aboutInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <img
                                src="../../../public/temp_data/construction.png"
                                alt="O Oporovo"
                                className="w-full h-auto rounded-lg shadow-sm border border-gray-200"
                            />
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={aboutInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                        >
                            <h3 className="text-2xl font-medium text-gray-900 mb-6">
                                Dlaczego warto korzystać z Oporovo?
                            </h3>

                            <ul className="space-y-6">
                                {[
                                    {
                                        title: 'Wygoda i dostępność',
                                        description: 'Korzystaj z korepetycji bez wychodzenia z domu, bezpośrednio przez Discord.',
                                    },
                                    {
                                        title: 'Najlepsi korepetytorzy',
                                        description: 'Współpracujemy tylko z doświadczonymi i sprawdzonymi korepetytorami.',
                                    },
                                    {
                                        title: 'Oszczędność czasu',
                                        description: 'Łatwa rezerwacja i zarządzanie lekcjami oszczędza Twój cenny czas.',
                                    },
                                    {
                                        title: 'Bezpieczeństwo',
                                        description: 'Wszystkie płatności i dane osobowe są bezpieczne i chronione.',
                                    },
                                ].map((item, index) => (
                                    <li key={index} className="flex">
                                        <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                            <span className="text-blue-900 font-medium">{index + 1}</span>
                                        </div>
                                        <div className="ml-4">
                                            <h4 className="text-lg font-medium text-gray-900">{item.title}</h4>
                                            <p className="mt-1 text-gray-600">{item.description}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    </div>

                    <div className="mt-16">
                        <motion.h3
                            initial={{ opacity: 0, y: 20 }}
                            animate={aboutInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="text-2xl font-medium text-gray-900 text-center mb-12"
                        >
                            Jak to działa?
                        </motion.h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {steps.map((step, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={aboutInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                                    transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                                    className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center"
                                >
                                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto shadow-sm border border-blue-100">
                                        {step.icon}
                                    </div>
                                    <h4 className="mt-6 text-lg font-medium text-gray-900">{step.title}</h4>
                                    <p className="mt-3 text-gray-600">{step.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* TOP TUTORS SECTION */}
            <section className="py-16 bg-gray-50" ref={tutorsRef}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={tutorsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl font-bold text-gray-900">Nasi najlepsi korepetytorzy</h2>
                        <p className="mt-4 text-lg text-gray-700 max-w-2xl mx-auto">
                            Poznaj naszych top korepetytorów z najwyższymi ocenami i bogatym doświadczeniem.
                            Wybierz eksperta, który pomoże Ci osiągnąć Twoje cele edukacyjne.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {loading
                            ? Array.from({ length: 4 }).map((_, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={tutorsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                >
                                    <TutorCardSkeleton />
                                </motion.div>
                            ))
                            : tutors.map((tutor, index) => (
                                <motion.div
                                    key={tutor.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={tutorsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                    whileHover={{ y: -5 }}
                                >
                                    <TutorCard tutor={tutor} onClick={() => openTutorModal(tutor)} />
                                </motion.div>
                            ))}
                    </div>

                    <div className="mt-12 text-center">
                        <button className="px-6 py-2 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-md shadow-sm transition-colors">
                            Zobacz wszystkich korepetytorów
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;