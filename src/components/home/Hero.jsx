import { motion } from 'framer-motion';
import { FaDiscord, FaSearch } from 'react-icons/fa';
import { useModal } from '../../context/ModalContext';

const Hero = () => {
    const { openLoginModal } = useModal();

    return (
        <section className="pt-32 pb-20 bg-gradient-to-b from-vibely-50 to-white">
            <div className="container-custom">
                <div className="flex flex-col lg:flex-row items-center">
                    {/* Left side - Text content */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="lg:w-1/2 text-center lg:text-left"
                    >
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                            Znajdź idealnego <span className="text-vibely-600">korepetytora</span> na Discord
                        </h1>
                        <p className="mt-6 text-xl text-gray-600 max-w-lg mx-auto lg:mx-0">
                            Vibely to platforma, która łączy uczniów z najlepszymi korepetytorami przez Discord.
                            Zarezerwuj lekcje online i rozwijaj swoje umiejętności.
                        </p>
                        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={openLoginModal}
                                className="btn btn-primary py-3 px-8 text-lg"
                            >
                                <FaDiscord className="mr-2" />
                                Zaloguj się
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className=" btn btn-outline py-3 px-8 text-lg"
                            >
                                <FaSearch className="mr-2" />
                                Szukaj korepetytorów
                            </motion.button>
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
                            src="https://via.placeholder.com/600x500"
                            alt="Vibely - platforma korepetycji przez Discord"
                            className="w-full h-auto rounded-xl shadow-lg"
                        />
                    </motion.div>
                </div>

                {/* Features */}
                <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
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
                            className="bg-white p-6 rounded-xl shadow-md"
                        >
                            <div className="text-3xl mb-4">{feature.icon}</div>
                            <h3 className="text-xl font-semibold text-gray-900">{feature.title}</h3>
                            <p className="mt-2 text-gray-600">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Hero;