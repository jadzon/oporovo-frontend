// src/pages/HelpPage.jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaBug, FaQuestionCircle } from 'react-icons/fa';

const HelpPage = () => {
    // State for bug-report form
    const [bugDescription, setBugDescription] = useState('');

    const handleBugSubmit = (e) => {
        e.preventDefault();
        // Replace with actual bug reporting logic (e.g., send to API endpoint)
        alert(`Dziękujemy za zgłoszenie!\n\nTreść błędu:\n${bugDescription}`);
        setBugDescription('');
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Hero section with big text */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="py-8">
                        <motion.div
                            initial={{opacity: 0, y: 20}}
                            animate={{opacity: 1, y: 0}}
                            transition={{duration: 0.5}}
                            className="text-center lg:text-left"
                        >
                            <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight">
                                Centrum <span className="text-blue-900">Pomocy</span>
                            </h1>
                            <p className="mt-4 text-lg text-gray-700">
                                Znajdź odpowiedzi na swoje pytania lub zgłoś problem techniczny.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* LEFT: Bug Report Section */}
                    <motion.div
                        initial={{opacity: 0, x: -20}}
                        animate={{opacity: 1, x: 0}}
                        transition={{duration: 0.5}}
                        className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                    >
                        <div className="px-6 py-4 border-b border-gray-200">
                            <div className="flex items-center">
                                <FaBug className="text-blue-900 text-lg mr-3" />
                                <h2 className="text-lg font-medium text-gray-900">Zgłoś błąd</h2>
                            </div>
                        </div>

                        <div className="p-6">
                            <p className="text-gray-600 mb-4">
                                Natknąłeś się na problem? Opisz go poniżej, a my postaramy się go jak najszybciej
                                naprawić.
                            </p>
                            <form onSubmit={handleBugSubmit} className="space-y-4">
                                <textarea
                                    required
                                    rows={5}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                                    placeholder="Opisz błąd, który napotkałeś..."
                                    value={bugDescription}
                                    onChange={(e) => setBugDescription(e.target.value)}
                                />
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white text-sm font-medium rounded-md shadow-sm transition-colors"
                                >
                                    Wyślij zgłoszenie
                                </button>
                            </form>
                        </div>
                    </motion.div>

                    {/* RIGHT: Tutorial Section */}
                    <motion.div
                        initial={{opacity: 0, x: 20}}
                        animate={{opacity: 1, x: 0}}
                        transition={{duration: 0.5}}
                        className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                    >
                        <div className="px-6 py-4 border-b border-gray-200">
                            <div className="flex items-center">
                                <FaQuestionCircle className="text-blue-900 text-lg mr-3" />
                                <h2 className="text-lg font-medium text-gray-900">Jak dołączyć do lekcji?</h2>
                            </div>
                        </div>

                        <div className="p-6">
                            <p className="text-gray-600 mb-4">
                                Aby dołączyć do lekcji, wykonaj poniższe kroki. Pamiętaj, że wszystkie spotkania
                                odbywają się poprzez Discord.
                            </p>
                            <ol className="list-decimal list-inside space-y-3 text-gray-600">
                                <li>
                                    <span className="font-medium text-gray-700">Zaloguj się przez Discord:</span> Upewnij się, że Twoje konto Discord jest
                                    połączone z Oporovo.
                                </li>
                                <li>
                                    <span className="font-medium text-gray-700">Wybierz korepetytora i termin:</span> Przejdź na stronę korepetytorów,
                                    znajdź nauczyciela i zarezerwuj termin lekcji.
                                </li>
                                <li>
                                    <span className="font-medium text-gray-700">Otrzymaj link do spotkania:</span> Na stronie z lekcją pojawi się przycisk
                                    „Dołącz do lekcji na Discord". Kliknij go w wyznaczonym czasie.
                                </li>
                                <li>
                                    <span className="font-medium text-gray-700">Uruchom Discord:</span> Lekcja rozpocznie się w wybranym kanale głosowym
                                    lub wideoczatowym. Możesz udostępniać ekran i rozmawiać z korepetytorem na żywo.
                                </li>
                            </ol>
                            <p className="mt-6 text-gray-600">
                                Jeśli wciąż masz problemy z dołączeniem do lekcji, skontaktuj się z nami lub sprawdź
                                sekcję{' '}
                                <span className="font-medium text-blue-900 hover:underline cursor-pointer">
                                    FAQ
                                </span>.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default HelpPage;