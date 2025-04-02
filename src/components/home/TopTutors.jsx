import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import TutorCard from './TutorCard';
import { TutorCardSkeleton } from '../ui/Skeleton';
import { useModal } from '../../hooks/useModal';

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

const TopTutors = () => {
    const [loading, setLoading] = useState(true);
    const [tutors, setTutors] = useState([]);
    const { openTutorModal } = useModal();
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    // Simulate loading tutors data
    useEffect(() => {
        const timer = setTimeout(() => {
            setTutors(mockTutors);
            setLoading(false);
        }, 1500);

        return () => clearTimeout(timer);
    }, []);

    return (
        <section id="tutors" className="py-20 bg-gray-50" ref={ref}>
            <div className="container-custom">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl font-bold text-gray-900">Nasi najlepsi korepetytorzy</h2>
                    <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
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
                                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                            >
                                <TutorCardSkeleton />
                            </motion.div>
                        ))
                        : tutors.map((tutor, index) => (
                            <motion.div
                                key={tutor.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                whileHover={{ y: -5 }}
                            >
                                <TutorCard tutor={tutor} onClick={openTutorModal} />
                            </motion.div>
                        ))}
                </div>

                <div className="mt-12 text-center">
                    <button className="btn-outline">
                        Zobacz wszystkich korepetytorów
                    </button>
                </div>
            </div>
        </section>
    );
};

export default TopTutors;