import { useState } from 'react';
import {
    User,
    Bell,
    Shield,
    Globe,
    Settings,
    CreditCard,
    HelpCircle,
    BookOpen,
    X,
    ChevronRight,
    AlertTriangle,
    Moon,
    Sun,
    Monitor,
    Smartphone,
    Volume2,
    MessageSquare,
    LogOut,
    Palette,
    Languages,
    Eye,
    Users,
    Lock
} from 'lucide-react';

const SettingsPage = () => {
    const [activeCategory, setActiveCategory] = useState('account');

    // Define settings categories
    const categories = [
        {
            title: 'User Settings',
            items: [
                { id: 'account', name: 'My Account', icon: <User className="h-5 w-5" /> },
                { id: 'profile', name: 'Profile', icon: <User className="h-5 w-5" /> },
                { id: 'privacy', name: 'Privacy & Safety', icon: <Shield className="h-5 w-5" /> },
                { id: 'notifications', name: 'Notifications', icon: <Bell className="h-5 w-5" /> },
                { id: 'connections', name: 'Connections', icon: <Globe className="h-5 w-5" /> },
            ]
        },
        {
            title: 'App Settings',
            items: [
                { id: 'appearance', name: 'Appearance', icon: <Palette className="h-5 w-5" /> },
                { id: 'accessibility', name: 'Accessibility', icon: <Eye className="h-5 w-5" /> },
                { id: 'language', name: 'Language', icon: <Languages className="h-5 w-5" /> },
                { id: 'payment', name: 'Payment Methods', icon: <CreditCard className="h-5 w-5" /> },
            ]
        },
        {
            title: 'Oporovo Settings',
            items: [
                { id: 'lessons', name: 'Lesson Preferences', icon: <BookOpen className="h-5 w-5" /> },
                { id: 'chat', name: 'Communication', icon: <MessageSquare className="h-5 w-5" /> },
                { id: 'help', name: 'Help & Support', icon: <HelpCircle className="h-5 w-5" /> },
                { id: 'advanced', name: 'Advanced', icon: <Settings className="h-5 w-5" /> }
            ]
        }
    ];

    // Render settings content based on active category
    const renderContent = () => {
        switch (activeCategory) {
            case 'account':
                return <AccountSettings />;
            case 'appearance':
                return <AppearanceSettings />;
            case 'privacy':
                return <PrivacySettings />;
            default:
                return (
                    <div className="flex flex-col items-center justify-center h-full">
                        <div className="text-gray-400 mb-4">
                            <Settings className="h-16 w-16" />
                        </div>
                        <p className="text-gray-500 text-center">Select a category from the sidebar to view settings</p>
                    </div>
                );
        }
    };

    return (
        <div className="flex min-h-screen bg-[#FFFDF7]">
            {/* Sidebar */}
            <div className="w-72 bg-white border-r border-gray-100 shadow-sm flex flex-col h-screen sticky top-0 ">
                <div className="p-4 border-b border-gray-100">
                    <h1 className="text-xl font-bold text-gray-900">User Settings</h1>
                </div>

                <div className="overflow-y-auto flex-1">
                    {categories.map((category, index) => (
                        <div key={index} className="px-3 py-5">
                            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">{category.title}</h2>
                            <div className="space-y-1">
                                {category.items.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => setActiveCategory(item.id)}
                                        className={`w-full flex items-center px-3 py-2.5 rounded-lg transition-colors ${
                                            activeCategory === item.id
                                                ? 'bg-black text-white'
                                                : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                    >
                    <span className={`${activeCategory === item.id ? 'text-white' : 'text-gray-500'}`}>
                      {item.icon}
                    </span>
                                        <span className="ml-3">{item.name}</span>
                                        {activeCategory === item.id && <ChevronRight className="ml-auto h-4 w-4" />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-4 border-t border-gray-100">
                    <button
                        className="w-full flex items-center justify-center px-4 py-2.5 rounded-lg text-white bg-red-600 hover:bg-red-700 transition-colors"
                    >
                        <LogOut className="h-5 w-5 mr-2" />
                        <span>Log Out</span>
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 flex flex-col">
                {/* Close button (absolute positioned in top-right corner) */}
                <button
                    onClick={() => console.log('Close settings')}
                    className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-sm border border-gray-100 text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors z-50"
                >
                    <X className="h-5 w-5" />
                </button>

                {/* Content */}
                <div className="flex-1 p-10 overflow-auto">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

// Account Settings Component
const AccountSettings = () => {
    return (
        <div className="max-w-3xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">My Account</h2>

            {/* Profile Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
                <div className="flex items-start gap-5">
                    <div className="relative">
                        <div className="h-20 w-20 rounded-full overflow-hidden bg-gray-200 border-4 border-white shadow-sm">
                            <img
                                src="/api/placeholder/100/100"
                                alt="Profile"
                                className="h-full w-full object-cover"
                            />
                        </div>
                        <button className="absolute bottom-0 right-0 bg-black text-white p-1.5 rounded-full shadow-sm">
                            <Settings className="h-3.5 w-3.5" />
                        </button>
                    </div>

                    <div className="flex-1">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-bold text-xl text-gray-900">John Smith</h3>
                                <p className="text-gray-500">john.smith@example.com</p>
                            </div>
                            <button className="px-4 py-1.5 text-sm bg-black text-white rounded-full hover:bg-gray-800 transition-colors">
                                Edit Profile
                            </button>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
                            <span className="px-2.5 py-1 text-xs rounded-full bg-blue-50 text-blue-700">Student</span>
                            <span className="px-2.5 py-1 text-xs rounded-full bg-amber-50 text-amber-700">Premium</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Account Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
                <div className="px-6 py-4 border-b border-gray-100">
                    <h3 className="font-medium text-gray-900">Account Information</h3>
                </div>

                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                                Username
                            </label>
                            <input
                                id="username"
                                type="text"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                                defaultValue="johnsmith123"
                                readOnly
                            />
                            <p className="mt-1 text-xs text-gray-500">This is your unique identifier on Oporovo</p>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                                defaultValue="john.smith@example.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                                Phone Number
                            </label>
                            <input
                                id="phone"
                                type="tel"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                                placeholder="+1 (555) 123-4567"
                            />
                        </div>

                        <div>
                            <label htmlFor="birthday" className="block text-sm font-medium text-gray-700 mb-1">
                                Date of Birth
                            </label>
                            <input
                                id="birthday"
                                type="date"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                                defaultValue="1990-01-01"
                            />
                            <p className="mt-1 text-xs text-gray-500">Your date of birth is not shown publicly</p>
                        </div>
                    </div>
                </div>

                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
                    <button className="px-4 py-2 bg-black text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors">
                        Save Changes
                    </button>
                </div>
            </div>

            {/* Password Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
                <div className="px-6 py-4 border-b border-gray-100">
                    <h3 className="font-medium text-gray-900">Password and Authentication</h3>
                </div>

                <div className="p-6 space-y-4">
                    <div>
                        <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 mb-1">
                            Current Password
                        </label>
                        <input
                            id="current-password"
                            type="password"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                            placeholder="••••••••••••"
                        />
                    </div>

                    <div>
                        <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1">
                            New Password
                        </label>
                        <input
                            id="new-password"
                            type="password"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                            placeholder="••••••••••••"
                        />
                    </div>

                    <div>
                        <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
                            Confirm New Password
                        </label>
                        <input
                            id="confirm-password"
                            type="password"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                            placeholder="••••••••••••"
                        />
                    </div>

                    <div className="pt-4 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h4>
                                <p className="text-xs text-gray-500 mt-1">Add an extra layer of security to your account</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                            </label>
                        </div>
                    </div>
                </div>

                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
                    <button className="px-4 py-2 bg-black text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors">
                        Update Password
                    </button>
                </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center">
                        <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                        <h3 className="font-medium text-red-500">Danger Zone</h3>
                    </div>
                </div>

                <div className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="text-base font-medium text-gray-900">Delete Account</h4>
                            <p className="text-sm text-gray-500 mt-1">Once you delete your account, there is no going back. Please be certain.</p>
                        </div>
                        <button className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors">
                            Delete Account
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Appearance Settings Component
const AppearanceSettings = () => {
    return (
        <div className="max-w-3xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Appearance</h2>

            {/* Theme Selection */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
                <div className="px-6 py-4 border-b border-gray-100">
                    <h3 className="font-medium text-gray-900">Theme</h3>
                </div>

                <div className="p-6">
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">Theme Options</label>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="relative">
                                    <input type="radio" id="theme-light" name="theme" className="sr-only peer" defaultChecked />
                                    <label htmlFor="theme-light" className="flex flex-col items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer peer-checked:border-black hover:bg-gray-50 transition-colors">
                                        <div className="mb-3 bg-white border border-gray-200 rounded-lg h-24 w-full relative overflow-hidden">
                                            <div className="h-6 bg-gray-100 border-b border-gray-200 w-full"></div>
                                            <div className="h-full w-24 absolute left-0 top-6 bg-gray-50 border-r border-gray-200"></div>
                                        </div>
                                        <div className="flex items-center">
                                            <Sun className="h-4 w-4 mr-2 text-gray-700" />
                                            <span className="text-gray-900 font-medium">Light</span>
                                        </div>
                                    </label>
                                    <div className="absolute top-2 right-2 h-4 w-4 bg-black rounded-full peer-checked:block hidden"></div>
                                </div>

                                <div className="relative">
                                    <input type="radio" id="theme-dark" name="theme" className="sr-only peer" />
                                    <label htmlFor="theme-dark" className="flex flex-col items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer peer-checked:border-black hover:bg-gray-50 transition-colors">
                                        <div className="mb-3 bg-gray-800 border border-gray-700 rounded-lg h-24 w-full relative overflow-hidden">
                                            <div className="h-6 bg-gray-900 border-b border-gray-700 w-full"></div>
                                            <div className="h-full w-24 absolute left-0 top-6 bg-gray-900 border-r border-gray-700"></div>
                                        </div>
                                        <div className="flex items-center">
                                            <Moon className="h-4 w-4 mr-2 text-gray-700" />
                                            <span className="text-gray-900 font-medium">Dark</span>
                                        </div>
                                    </label>
                                    <div className="absolute top-2 right-2 h-4 w-4 bg-black rounded-full peer-checked:block hidden"></div>
                                </div>

                                <div className="relative">
                                    <input type="radio" id="theme-system" name="theme" className="sr-only peer" />
                                    <label htmlFor="theme-system" className="flex flex-col items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer peer-checked:border-black hover:bg-gray-50 transition-colors">
                                        <div className="mb-3 bg-gradient-to-r from-white to-gray-800 border border-gray-200 rounded-lg h-24 w-full relative overflow-hidden">
                                            <div className="h-6 bg-gradient-to-r from-gray-100 to-gray-900 border-b border-gray-200 w-full"></div>
                                            <div className="h-full w-24 absolute left-0 top-6 bg-gradient-to-r from-gray-50 to-gray-900 border-r border-gray-200"></div>
                                        </div>
                                        <div className="flex items-center">
                                            <Monitor className="h-4 w-4 mr-2 text-gray-700" />
                                            <span className="text-gray-900 font-medium">Sync with System</span>
                                        </div>
                                    </label>
                                    <div className="absolute top-2 right-2 h-4 w-4 bg-black rounded-full peer-checked:block hidden"></div>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-gray-100 pt-6">
                            <label className="block text-sm font-medium text-gray-700 mb-3">Font Size</label>
                            <input
                                type="range"
                                min="12"
                                max="24"
                                defaultValue="16"
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-2">
                                <span>12px</span>
                                <span>16px (Default)</span>
                                <span>24px</span>
                            </div>
                        </div>

                        <div className="border-t border-gray-100 pt-6">
                            <label className="block text-sm font-medium text-gray-700 mb-3">App Scaling</label>
                            <div className="grid grid-cols-3 gap-4">
                                <button className="flex flex-col items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                                    <Smartphone className="h-5 w-5 mb-1 text-gray-700" />
                                    <span className="text-xs">Compact</span>
                                </button>
                                <button className="flex flex-col items-center p-3 border-2 border-black rounded-lg bg-gray-50">
                                    <Monitor className="h-5 w-5 mb-1 text-black" />
                                    <span className="text-xs font-medium">Normal</span>
                                </button>
                                <button className="flex flex-col items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                                    <Monitor className="h-6 w-6 mb-1 text-gray-700" />
                                    <span className="text-xs">Large</span>
                                </button>
                            </div>
                        </div>

                        <div className="border-t border-gray-100 pt-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="text-sm font-medium text-gray-900">Reduced Motion</h4>
                                    <p className="text-xs text-gray-500 mt-1">Disable animations when possible</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="text-sm font-medium text-gray-900">Message Animation</h4>
                                    <p className="text-xs text-gray-500 mt-1">Show subtle animations when new messages arrive</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" defaultChecked className="sr-only peer" />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="text-sm font-medium text-gray-900">Compact Mode</h4>
                                    <p className="text-xs text-gray-500 mt-1">Display more content with less spacing</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
                    <button className="px-4 py-2 bg-black text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors">
                        Save Changes
                    </button>
                </div>
            </div>

            {/* Notifications */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                    <h3 className="font-medium text-gray-900">Sounds & Notifications</h3>
                </div>

                <div className="p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">Sound Volume</label>
                        <div className="flex items-center">
                            <Volume2 className="h-5 w-5 text-gray-400 mr-2" />
                            <input
                                type="range"
                                min="0"
                                max="100"
                                defaultValue="80"
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>
                    </div>

                    <div className="border-t border-gray-100 pt-6">
                        <h4 className="text-sm font-medium text-gray-900 mb-3">Notification Settings</h4>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-900">Lesson Reminders</p>
                                    <p className="text-xs text-gray-500">Get notifications about upcoming lessons</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" defaultChecked className="sr-only peer" />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-900">New Messages</p>
                                    <p className="text-xs text-gray-500">Get notifications when you receive a new message</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" defaultChecked className="sr-only peer" />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-900">Marketing Emails</p>
                                    <p className="text-xs text-gray-500">Receive updates about new features and promotions</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
                    <button className="px-4 py-2 bg-black text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors">
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

// Privacy Settings Component
const PrivacySettings = () => {
    return (
        <div className="max-w-3xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Privacy & Safety</h2>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
                <div className="px-6 py-4 border-b border-gray-100">
                    <h3 className="font-medium text-gray-900">Privacy Settings</h3>
                </div>

                <div className="p-6 space-y-6">
                    <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-3">Who can contact me</h4>
                        <div className="space-y-4">
                            <div className="flex items-center">
                                <input id="contact-everyone" name="contact" type="radio" defaultChecked className="h-4 w-4 text-black focus:ring-black border-gray-300" />
                                <label htmlFor="contact-everyone" className="ml-3">
                                    <span className="block text-sm font-medium text-gray-900">Everyone</span>
                                    <span className="block text-xs text-gray-500">Any user on the platform can send you a message</span>
                                </label>
                            </div>

                            <div className="flex items-center">
                                <input id="contact-connections" name="contact" type="radio" className="h-4 w-4 text-black focus:ring-black border-gray-300" />
                                <label htmlFor="contact-connections" className="ml-3">
                                    <span className="block text-sm font-medium text-gray-900">My connections only</span>
                                    <span className="block text-xs text-gray-500">Only users you've connected with can message you</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-100 pt-6">
                        <h4 className="text-sm font-medium text-gray-900 mb-3">Profile visibility</h4>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-900">Show my online status</p>
                                    <p className="text-xs text-gray-500">Let others see when you're online</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" defaultChecked className="sr-only peer" />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-900">Show my learning progress</p>
                                    <p className="text-xs text-gray-500">Display your progress on your public profile</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" defaultChecked className="sr-only peer" />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-900">Include me in search results</p>
                                    <p className="text-xs text-gray-500">Allow others to find you through search</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" defaultChecked className="sr-only peer" />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-100 pt-6">
                        <h4 className="text-sm font-medium text-gray-900 mb-3">Security</h4>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-900">Two-factor authentication</p>
                                    <p className="text-xs text-gray-500">Secure your account with an additional verification step</p>
                                </div>
                                <button className="px-3 py-1.5 text-xs font-medium text-black border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                                    Enable
                                </button>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-900">Login activity</p>
                                    <p className="text-xs text-gray-500">Review devices that have logged into your account</p>
                                </div>
                                <button className="px-3 py-1.5 text-xs font-medium text-black border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                                    View
                                </button>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-900">Data privacy report</p>
                                    <p className="text-xs text-gray-500">Download a copy of your personal data</p>
                                </div>
                                <button className="px-3 py-1.5 text-xs font-medium text-black border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                                    Request
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
                    <button className="px-4 py-2 bg-black text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors">
                        Save Changes
                    </button>
                </div>
            </div>

            {/* Blocked Users */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center">
                        <Lock className="h-5 w-5 text-gray-700 mr-2" />
                        <h3 className="font-medium text-gray-900">Blocked Users</h3>
                    </div>
                </div>

                <div className="p-6">
                    <p className="text-sm text-gray-500 mb-4">You haven't blocked any users yet.</p>
                    <p className="text-xs text-gray-500">When you block someone, they won't be able to message you or see your profile.</p>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;