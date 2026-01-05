import ThemeButton from '../../components/themeButton/themeButton';
import { Clock, Info, Bell, Lock, Storefront } from 'phosphor-react';

const Settings = () => {
    return (
        <div className="max-w-5xl mx-auto space-y-6 animate-fade-in-down">
            <div>
                <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
                <p className="text-gray-500 text-sm">Manage your spa configuration</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* General Settings */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center gap-2 border-b border-gray-100 pb-4 mb-4">
                            <Storefront size={20} className="text-primary" />
                            <h3 className="font-semibold text-gray-900">General Information</h3>
                        </div>
                        <form className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700">Spa Name</label>
                                    <input type="text" defaultValue="Sereniva SPA" className="w-full p-2 border border-gray-200 rounded text-sm bg-gray-50 focus:bg-white transition-colors" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700">Contact Email</label>
                                    <input type="email" defaultValue="admin@sereniva.com" className="w-full p-2 border border-gray-200 rounded text-sm bg-gray-50 focus:bg-white transition-colors" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700">Phone</label>
                                    <input type="text" defaultValue="+1 234 567 890" className="w-full p-2 border border-gray-200 rounded text-sm bg-gray-50 focus:bg-white transition-colors" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700">Currency</label>
                                    <select className="w-full p-2 border border-gray-200 rounded text-sm bg-gray-50 focus:bg-white transition-colors">
                                        <option>USD ($)</option>
                                        <option>EUR (€)</option>
                                    </select>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Working Hours */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center gap-2 border-b border-gray-100 pb-4 mb-4">
                            <Clock size={20} className="text-primary" />
                            <h3 className="font-semibold text-gray-900">Working Hours</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Opening Time</label>
                                <input type="time" defaultValue="09:00" className="w-full p-2 border border-gray-200 rounded text-sm" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Closing Time</label>
                                <input type="time" defaultValue="20:00" className="w-full p-2 border border-gray-200 rounded text-sm" />
                            </div>
                            <div className="col-span-full flex items-center gap-2 mt-2">
                                <input type="checkbox" id="weekend" className="rounded text-primary focus:ring-primary" defaultChecked />
                                <label htmlFor="weekend" className="text-sm text-gray-700">Open on Weekends</label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Settings (Security & Notifications) */}
                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center gap-2 border-b border-gray-100 pb-4 mb-4">
                            <Lock size={20} className="text-primary" />
                            <h3 className="font-semibold text-gray-900">Security</h3>
                        </div>
                        <form className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Current Password</label>
                                <input type="password" className="w-full p-2 border border-gray-200 rounded text-sm" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">New Password</label>
                                <input type="password" className="w-full p-2 border border-gray-200 rounded text-sm" />
                            </div>
                            <ThemeButton variant="secondary" className="w-full justify-center">Update Password</ThemeButton>
                        </form>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center gap-2 border-b border-gray-100 pb-4 mb-4">
                            <Bell size={20} className="text-primary" />
                            <h3 className="font-semibold text-gray-900">Notifications</h3>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <label className="text-sm text-gray-700">Email Notifications</label>
                                <input type="checkbox" defaultChecked className="rounded text-primary focus:ring-primary toggle-checkbox" />
                            </div>
                            <div className="flex items-center justify-between">
                                <label className="text-sm text-gray-700">New Booking Alerts</label>
                                <input type="checkbox" defaultChecked className="rounded text-primary focus:ring-primary" />
                            </div>
                            <div className="flex items-center justify-between">
                                <label className="text-sm text-gray-700">Marketing Emails</label>
                                <input type="checkbox" className="rounded text-primary focus:ring-primary" />
                            </div>
                        </div>
                    </div>

                    <ThemeButton variant="primary" className="w-full justify-center py-3">Save All Changes</ThemeButton>
                </div>
            </div>
        </div>
    );
};

export default Settings;
