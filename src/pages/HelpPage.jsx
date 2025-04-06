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
        <section className="pt-20 pb-16 bg-gray-50 min-h-screen">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Page Title */}
                <motion.h1
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-4xl font-extrabold text-gray-900 mb-8 text-center"
                >
                    Centrum Pomocy
                </motion.h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* LEFT: Bug Report Section */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="bg-white rounded-xl shadow-md p-6 border border-gray-100"
                    >
                        <div className="flex items-center mb-6">
                            <FaBug className="text-purple-700 text-2xl mr-3" />
                            <h2 className="text-xl font-semibold text-gray-900">Zgłoś błąd</h2>
                        </div>
                        <p className="text-gray-700 mb-4">
                            Natknąłeś się na problem? Opisz go poniżej, a my postaramy się go jak najszybciej
                            naprawić.
                        </p>
                        <form onSubmit={handleBugSubmit} className="space-y-4">
              <textarea
                  required
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Opisz błąd, który napotkałeś..."
                  value={bugDescription}
                  onChange={(e) => setBugDescription(e.target.value)}
              />
                            <button
                                type="submit"
                                className="bg-purple-700 hover:bg-purple-800 text-white font-semibold px-6 py-2 rounded-md transition-colors"
                            >
                                Wyślij zgłoszenie
                            </button>
                        </form>
                    </motion.div>

                    {/* RIGHT: Tutorial Section */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="bg-white rounded-xl shadow-md p-6 border border-gray-100"
                    >
                        <div className="flex items-center mb-6">
                            <FaQuestionCircle className="text-purple-700 text-2xl mr-3" />
                            <h2 className="text-xl font-semibold text-gray-900">Jak dołączyć do lekcji?</h2>
                        </div>
                        <p className="text-gray-700 mb-4">
                            Aby dołączyć do lekcji, wykonaj poniższe kroki. Pamiętaj, że wszystkie spotkania
                            odbywają się poprzez Discord.
                        </p>
                        <ol className="list-decimal list-inside space-y-3 text-gray-700">
                            <li>
                                <strong>Zaloguj się przez Discord:</strong> Upewnij się, że Twoje konto Discord jest
                                połączone z Oporovo.
                            </li>
                            <li>
                                <strong>Wybierz korepetytora i termin:</strong> Przejdź na stronę korepetytorów,
                                znajdź nauczyciela i zarezerwuj termin lekcji.
                            </li>
                            <li>
                                <strong>Otrzymaj link do spotkania:</strong> Na stronie z lekcją pojawi się przycisk
                                „Dołącz do lekcji na Discord”. Kliknij go w wyznaczonym czasie.
                            </li>
                            <li>
                                <strong>Uruchom Discord:</strong> Lekcja rozpocznie się w wybranym kanale głosowym
                                lub wideoczatowym. Możesz udostępniać ekran i rozmawiać z korepetytorem na żywo.
                            </li>
                        </ol>
                        <p className="mt-6 text-gray-600">
                            Jeśli wciąż masz problemy z dołączeniem do lekcji, skontaktuj się z nami lub sprawdź
                            sekcję{' '}
                            <span className="font-medium text-purple-700 underline">
                FAQ
              </span>
                            .
                        </p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default HelpPage;
