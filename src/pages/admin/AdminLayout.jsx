import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import {
    SquaresFour, CalendarCheck, Users, UserList,
    Article, Star, Envelope, Gear, SignOut, List as MenuIcon, X, List as ListIcon
} from 'phosphor-react';
import { useAuth } from '../../context/auth-context';

const AdminLayout = () => {
    const { currentUser, logout } = useAuth();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // If no user, redirect to signin
    if (!currentUser) {
        return <div className="flex flex-col items-center justify-center h-screen">
            <p className="mb-4">Please sign in to access the dashboard.</p>
            <Link to="/signin" className="px-4 py-2 bg-primary text-white rounded">Sign In</Link>
        </div>;
    }

    // If user but not authorized
    if (currentUser.role !== 'admin' && currentUser.role !== 'therapist') {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-50 font-sans">
                <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md border border-gray-100">
                    <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <X size={32} weight="bold" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
                    <p className="text-gray-500 mb-6 text-sm">
                        You do not have permission to view the admin dashboard.
                        <br />
                        Current Role: <span className="font-mono font-medium text-gray-700 bg-gray-100 px-2 py-0.5 rounded">{currentUser.role}</span>
                    </p>
                    <button
                        onClick={() => {
                            logout();
                            // Optional: navigate to signin immediately, though logout usually clears state
                        }}
                        className="w-full py-2.5 bg-primary text-white rounded-lg hover:bg-primaryDark transition-colors font-medium"
                    >
                        Logout & Sign In as Admin
                    </button>
                    <p className="text-xs text-gray-400 mt-6 border-t border-gray-100 pt-4">
                        Tip: Sign in with an email containing "admin" (e.g., admin@sereniva.com) to access this area.
                    </p>
                    <Link to="/" className="block mt-4 text-sm text-gray-500 hover:text-primary">
                        Return to Home
                    </Link>
                </div>
            </div>
        );
    }

    const menuItems = [
        { icon: SquaresFour, label: 'Dashboard', path: '/admin' },
        { icon: CalendarCheck, label: 'Appointments', path: '/admin/appointments' },
        ...(currentUser.role === 'admin' ? [
            { icon: ListIcon, label: 'Services', path: '/admin/services' }, // Renamed import alias used below
            { icon: UserList, label: 'Therapists', path: '/admin/therapists' },
            { icon: Users, label: 'Users', path: '/admin/users' },
            { icon: Article, label: 'Manage Blogs', path: '/admin/content' },
            { icon: Star, label: 'Reviews', path: '/admin/reviews' },
            { icon: Envelope, label: 'Messages', path: '/admin/messages' },
            { icon: Gear, label: 'Settings', path: '/admin/settings' },
        ] : []),
    ];

    return (
        <div className="flex h-screen bg-gray-50 font-sans">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={clsx(
                "fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-100 transform transition-transform duration-300 lg:transform-none flex flex-col shadow-xl lg:shadow-none",
                sidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                {/* Logo Area */}
                <div className="h-20 flex items-center px-8 border-b border-gray-50">
                    <Link to="/" className="text-2xl font-bold font-Merriwheather text-primary flex items-center gap-2">
                        Sereniva
                        <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-sans font-bold tracking-wider uppercase border border-primary/20">Admin</span>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1.5 scrollbar-thin scrollbar-thumb-gray-200">
                    <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Main Menu</p>
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setSidebarOpen(false)}
                            className={clsx(
                                "flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 group",
                                location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path))
                                    ? "bg-primary text-white shadow-lg shadow-primary/25 translate-x-1"
                                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900 hover:translate-x-1"
                            )}
                        >
                            <item.icon
                                size={22}
                                weight={location.pathname === item.path ? "fill" : "duotone"}
                                className={clsx(
                                    "transition-colors",
                                    location.pathname === item.path ? "text-white" : "text-gray-400 group-hover:text-primary"
                                )}
                            />
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {/* Bottom User Profile Section */}
                <div className="p-4 border-t border-gray-50 bg-gray-50/30">
                    <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 mb-3 group transition-all hover:shadow-md hover:border-primary/20 cursor-default">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <img
                                    src={currentUser.photoURL || `https://ui-avatars.com/api/?name=${currentUser.name}&background=random`}
                                    alt="Profile"
                                    className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                                />
                                <span className={clsx(
                                    "absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white",
                                    currentUser.status === "Disabled" ? "bg-red-500" : "bg-green-500"
                                )}></span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-gray-900 truncate group-hover:text-primary transition-colors">
                                    {currentUser.displayName || currentUser.name}
                                </p>
                                <p className="text-xs text-gray-500 capitalize truncate flex items-center gap-1">
                                    {currentUser.role}
                                </p>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={logout}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl text-sm font-medium transition-all duration-200 group"
                    >
                        <SignOut size={18} weight="bold" className="group-hover:-translate-x-0.5 transition-transform" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden bg-gray-50/50">
                {/* Topbar */}
                <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-4 lg:px-8 shrink-0 sticky top-0 z-30">
                    <button
                        className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-xl transition-colors"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <MenuIcon size={24} />
                    </button>

                    <div className="flex-1 max-w-xl mx-4 lg:mx-0">
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                            {menuItems.find(i => i.path === location.pathname)?.label || 'Dashboard'}
                        </h1>
                        <p className="hidden md:block text-xs text-gray-400 mt-0.5">
                            Welcome back, {currentUser.displayName || currentUser.name}
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg shadow-sm text-xs font-medium text-gray-600">
                            <CalendarCheck size={16} className="text-primary" />
                            {new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-4 lg:p-8 scroll-smooth">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
