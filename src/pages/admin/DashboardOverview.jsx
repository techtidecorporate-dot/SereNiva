import { useRef, useEffect, useState, useMemo } from 'react';
import { TrendUp, Users, CalendarCheck, Money, Envelope } from 'phosphor-react';
import clsx from 'clsx';
import { useAuth } from '../../context/auth-context';
import { useNavigate } from 'react-router-dom';
import { database } from '../../firebase';
import { ref, onValue } from 'firebase/database';
import { massageServicesData } from '../../Data';

const StatCard = ({ title, value, subtext, icon: Icon, color, onClick }) => (
    <div
        onClick={onClick}
        className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start justify-between hover:shadow-md transition-all duration-300 hover:scale-[1.02] cursor-pointer"
    >
        <div>
            <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">{title}</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">{value}</h3>
            <p className="text-gray-400 text-xs mt-2">{subtext}</p>
        </div>
        <div className={clsx("p-3 rounded-lg", color)}>
            <Icon size={24} weight="fill" className="text-white" />
        </div>
    </div>
);

const DashboardOverview = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [timeRange, setTimeRange] = useState('Week');

    // Real Data States
    const [data, setData] = useState({
        appointments: [],
        users: [],
        messages: [],
        loading: true
    });

    useEffect(() => {
        const refs = {
            appointments: ref(database, 'appointments'),
            users: ref(database, 'users'),
            messages: ref(database, 'messages')
        };

        const unsubs = Object.entries(refs).map(([key, r]) => {
            return onValue(r, (snapshot) => {
                const val = snapshot.val();
                const list = val ? Object.entries(val).map(([id, item]) => ({ id, ...item })) : [];
                setData(prev => ({ ...prev, [key]: list, loading: false }));
            });
        });

        return () => unsubs.forEach(unsub => unsub());
    }, []);

    // Calculate Dynamic Stats
    const stats = useMemo(() => {
        const todayStr = new Date().toISOString().split('T')[0];
        const monthStr = todayStr.substring(0, 7);

        // Appointments
        const totalApts = data.appointments.length;
        const todayApts = data.appointments.filter(a => a.date === todayStr).length;

        // Revenue
        const getPrice = (serviceName) => {
            const service = massageServicesData.find(s => s.name === serviceName);
            return service ? Number(service.price) : 100; // Default $100
        };

        const confirmedApts = data.appointments.filter(a => a.status === 'Confirmed' || a.status === 'Completed');
        const totalRevenue = confirmedApts.reduce((sum, a) => sum + getPrice(a.serviceName), 0);
        const monthRevenue = confirmedApts
            .filter(a => a.date?.startsWith(monthStr))
            .reduce((sum, a) => sum + getPrice(a.serviceName), 0);

        // Users
        const totalUsers = data.users.length;
        const newUsers = data.users.filter(u => u.createdAt?.startsWith(monthStr)).length;

        // Messages
        const totalMsgs = data.messages.length;
        const unreadMsgs = data.messages.filter(m => !m.read).length;

        // Top Services
        const serviceCounts = data.appointments.reduce((acc, a) => {
            acc[a.serviceName] = (acc[a.serviceName] || 0) + 1;
            return acc;
        }, {});
        const topServices = Object.entries(serviceCounts)
            .map(([name, count]) => ({
                name,
                count,
                progress: `${Math.min(100, (count / (totalApts || 1)) * 200).toFixed(0)}%`, // Relative progress
                color: 'bg-primary'
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 4);

        // Recent Appointments
        const recentApts = [...data.appointments]
            .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
            .slice(0, 5);

        // Weekly Trends (last 7 days)
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const trends = Array.from({ length: 7 }).map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            const dateStr = d.toISOString().split('T')[0];
            const count = data.appointments.filter(a => a.date === dateStr).length;
            return {
                label: days[d.getDay()],
                height: `${Math.min(100, (count / (todayApts || 5)) * 100)}%`,
                fullDate: dateStr
            };
        });

        return {
            totalApts, todayApts,
            totalRevenue, monthRevenue,
            totalUsers, newUsers,
            totalMsgs, unreadMsgs,
            topServices,
            recentApts,
            trends
        };
    }, [data]);

    // Chart Component (Simulated Bar Chart)
    const ChartBar = ({ height, label, color = "bg-primary" }) => (
        <div className="flex flex-col items-center gap-2 group cursor-pointer flex-1">
            <div className="relative w-full max-w-[40px] bg-gray-50 rounded-t-sm h-48 flex items-end overflow-hidden group-hover:bg-gray-100 transition-colors">
                <div className={`w-full ${color} rounded-t-sm transition-all duration-1000 ease-out`} style={{ height: height }}></div>
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                    {height}
                </div>
            </div>
            <span className="text-xs text-gray-400 font-medium">{label}</span>
        </div>
    );

    if (data.loading) {
        return <div className="py-20 text-center animate-pulse text-gray-400 font-medium">Loading Dashboard Insights...</div>;
    }

    return (
        <div className="space-y-6 animate-fade-in-down">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Overview</h2>
                    <p className="text-gray-500 text-sm">Welcome back, {currentUser?.firstName || 'Admin'}</p>
                </div>
                <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-gray-100 shadow-sm">
                    {['Day', 'Week', 'Month'].map(range => (
                        <button
                            key={range}
                            onClick={() => setTimeRange(range)}
                            className={clsx(
                                "px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
                                timeRange === range ? "bg-gray-100 text-gray-900" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                            )}
                        >
                            {range}
                        </button>
                    ))}
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <StatCard
                    title="Appointments"
                    value={stats.totalApts}
                    subtext={`${stats.todayApts} today`}
                    icon={CalendarCheck}
                    color="bg-blue-500"
                    onClick={() => navigate('/admin/appointments')}
                />
                <StatCard
                    title="Revenue"
                    value={`$${stats.totalRevenue.toLocaleString()}`}
                    subtext={`+$${stats.monthRevenue.toLocaleString()} this month`}
                    icon={Money}
                    color="bg-green-500"
                    onClick={() => navigate('/admin/appointments')}
                />
                <StatCard
                    title="New Users"
                    value={stats.totalUsers}
                    subtext={`+${stats.newUsers} this month`}
                    icon={Users}
                    color="bg-purple-500"
                    onClick={() => navigate('/admin/users')}
                />
                <StatCard
                    title="Messages"
                    value={stats.totalMsgs}
                    subtext={`${stats.unreadMsgs} unread`}
                    icon={Envelope}
                    color="bg-orange-500"
                    onClick={() => navigate('/admin/messages')}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue/Booking Chart */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="font-bold text-gray-800">Booking Trends</h3>
                            <p className="text-xs text-gray-400">Number of appointments (last 7 days)</p>
                        </div>
                    </div>

                    <div className="flex items-end justify-between gap-2 md:gap-4 h-56 pb-2">
                        {stats.trends.map((t, i) => (
                            <ChartBar key={i} height={t.height} label={t.label} color={t.label === 'Fri' || t.label === 'Sat' ? 'bg-primary' : 'bg-primaryLight'} />
                        ))}
                    </div>
                </div>

                {/* Popular Services */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
                    <h3 className="font-bold text-gray-800 mb-6 transition-all duration-300">Top Services</h3>
                    <div className="space-y-6 flex-1">
                        {stats.topServices.length === 0 ? (
                            <p className="text-sm text-gray-400 text-center py-10">No booking data available yet.</p>
                        ) : stats.topServices.map((service, i) => (
                            <div key={i}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-700 font-medium truncate pr-2">{service.name}</span>
                                    <span className="text-gray-500">{service.count} bookings</span>
                                </div>
                                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                    <div className={`h-full ${i === 0 ? 'bg-primary' : 'bg-primaryLight'}`} style={{ width: service.progress }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={() => navigate('/admin/services')}
                        className="mt-6 w-full py-2 text-sm text-gray-600 hover:text-primary font-medium border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Manage Services
                    </button>
                </div>
            </div>

            {/* Recent Appointments Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="font-bold text-gray-800">Recent Appointments</h3>
                    <button
                        onClick={() => navigate('/admin/appointments')}
                        className="text-sm text-primary hover:underline"
                    >
                        View All
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-semibold">
                            <tr>
                                <th className="px-6 py-4">Customer</th>
                                <th className="px-6 py-4">Service</th>
                                <th className="px-6 py-4">Date & Time</th>
                                <th className="px-6 py-4">Therapist</th>
                                <th className="px-6 py-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {stats.recentApts.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-10 text-center text-gray-400">No recent appointments found.</td>
                                </tr>
                            ) : stats.recentApts.map((apt) => (
                                <tr key={apt.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900">{apt.customerName}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{apt.serviceName}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{apt.date} <span className="text-gray-100">|</span> {apt.time}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{apt.therapistName}</td>
                                    <td className="px-6 py-4">
                                        <span className={clsx(
                                            "inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                                            apt.status === 'Confirmed' ? "bg-green-50 text-green-700 border-green-100" :
                                                apt.status === 'Pending' ? "bg-amber-50 text-amber-700 border-amber-100" :
                                                    "bg-red-50 text-red-700 border-red-100"
                                        )}>
                                            {apt.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DashboardOverview;

