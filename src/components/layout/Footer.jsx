import { FaDiscord, FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-300" id="contact">
            <div className="container-custom py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Logo & Description */}
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-4">Vibely</h2>
                        <p className="text-gray-400">
                            Platforma korepetycji przez Discord dla uczniów i studentów.
                            Znajdź idealnego korepetytora i zarezerwuj lekcje online.
                        </p>
                        <div className="mt-4 flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <FaDiscord size={20} />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <FaFacebook size={20} />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <FaInstagram size={20} />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <FaTwitter size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">Szybkie linki</h3>
                        <ul className="space-y-2">
                            {['Strona główna', 'O nas', 'Korepetytorzy', 'Cennik', 'FAQ'].map((item, index) => (
                                <li key={index}>
                                    <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Categories */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">Kategorie</h3>
                        <ul className="space-y-2">
                            {[
                                'Matematyka',
                                'Fizyka',
                                'Chemia',
                                'Biologia',
                                'Języki obce',
                                'Informatyka',
                            ].map((item, index) => (
                                <li key={index}>
                                    <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">Kontakt</h3>
                        <ul className="space-y-2 text-gray-400">
                            <li>Email: kontakt@vibely.pl</li>
                            <li>Discord: Vibely#1234</li>
                            <li>Godziny pracy: 9:00 - 17:00 (Pon-Pt)</li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400 text-sm">
                    <p>© {new Date().getFullYear()} Vibely. Wszelkie prawa zastrzeżone.</p>
                    <div className="mt-2 space-x-4">
                        <a href="#" className="hover:text-white transition-colors">
                            Regulamin
                        </a>
                        <a href="#" className="hover:text-white transition-colors">
                            Polityka prywatności
                        </a>
                        <a href="#" className="hover:text-white transition-colors">
                            Cookies
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;