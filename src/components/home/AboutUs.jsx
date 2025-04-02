import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaDiscord, FaCalendarAlt, FaGraduationCap } from 'react-icons/fa';

const AboutUs = () => {
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    const steps = [
        {
            icon: <FaDiscord className="text-vibely-600 text-3xl" />,
            title: 'Połącz konto Discord',
            description: 'Zaloguj się przez Discord, aby uzyskać dostęp do platformy i korepetytorów.',
        },
        {
            icon: <FaCalendarAlt className="text-vibely-600 text-3xl" />,
            title: 'Wybierz termin',
            description: 'Przeglądaj profile korepetytorów i zarezerwuj termin, który Ci pasuje.',
        },
        {
            icon: <FaGraduationCap className="text-vibely-600 text-3xl" />,
            title: 'Ucz się przez Discord',
            description: 'Dołącz do spotkania w wybranym terminie i korzystaj z korepetycji przez Discord.',
        },
    ];

    return (
        <section id="about" className="py-20 bg-white" ref={ref}>
            <div className="container-custom">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl font-bold text-gray-900">O Vibely</h2>
                    <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
                        Vibely to innowacyjna platforma korepetycji online, która łączy uczniów i studentów
                        z doświadczonymi korepetytorami za pośrednictwem Discord. Nasza misja to uczynienie
                        edukacji bardziej dostępną i wygodną dla wszystkich.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <img
                            src="https://via.placeholder.com/600x400"
                            alt="O Vibely"
                            className="w-full h-auto rounded-xl shadow-lg"
                        />
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                            Dlaczego warto korzystać z Vibely?
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
                                    <div className="flex-shrink-0 w-8 h-8 bg-vibely-100 rounded-full flex items-center justify-center">
                                        <span className="text-vibely-600 font-semibold">{index + 1}</span>
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

                <div className="mt-20">
                    <motion.h3
                        initial={{ opacity: 0, y: 20 }}
                        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="text-2xl font-semibold text-gray-900 text-center mb-12"
                    >
                        Jak to działa?
                    </motion.h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {steps.map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                                transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                                className="bg-gray-50 p-6 rounded-xl text-center"
                            >
                                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-md">
                                    {step.icon}
                                </div>
                                <h4 className="mt-6 text-xl font-semibold text-gray-900">{step.title}</h4>
                                <p className="mt-3 text-gray-600">{step.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutUs;