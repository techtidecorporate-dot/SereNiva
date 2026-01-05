import { useState, useEffect } from 'react';
import { useAuth } from '../context/auth-context';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    User, CalendarCheck, Lock, Heart, SignOut, Trash, Eye, CaretRight,
    ChatCircleDots, UserCircle, PencilSimple, Bell, CheckCircle, Info, XCircle
} from 'phosphor-react';
import clsx from 'clsx';
import ThemeButton from '../components/themeButton/themeButton';
import { database } from '../firebase';
import { ref, onValue, update, remove, query, orderByChild, equalTo } from 'firebase/database';
import ReviewModal from '../components/Modal/ReviewModal';

const ProfilePage = () => {
    const { currentUser, logout, updateUserProfile } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [activeTab, setActiveTab] = useState('personal');
    const [isEditing, setIsEditing] = useState(false);

    // Real-time Data State
    const [appointments, setAppointments] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [userMessages, setUserMessages] = useState([]);
    const [loading, setLoading] = useState({
        appointments: true,
        notifications: true,
        messages: false
    });

    // Review Modal State
    const [isReviewOpen, setIsReviewOpen] = useState(false);
    const [selectedApt, setSelectedApt] = useState(null);
    const [reviewMode, setReviewMode] = useState('add');

    // Toast Notification
    const [toast, setToast] = useState(null);
    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    // Form State
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        age: '',
        gender: 'prefer-not-to-say',
        email: '',
        profilePhoto: ''
    });

    // Initial load and Redirect
    useEffect(() => {
        if (!currentUser) {
            navigate('/signin');
            return;
        }

        const params = new URLSearchParams(location.search);
        const tab = params.get('tab');
        if (tab) setActiveTab(tab);

        setFormData({
            firstName: currentUser.firstName || "",
            lastName: currentUser.lastName || "",
            phone: currentUser.phone || "",
            age: currentUser.age || "",
            gender: currentUser.gender || "prefer-not-to-say",
            email: currentUser.email || "",
            profilePhoto: currentUser.photoURL || ""
        });
    }, [currentUser, navigate, location.search]);

    // FETCH APPOINTMENTS
    useEffect(() => {
        if (!currentUser) return;

        const aptsRef = ref(database, 'appointments');
        const unsub = onValue(aptsRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const list = Object.entries(data)
                    .map(([id, val]) => ({ id, ...val }))
                    .filter(a =>
                        a.userId === currentUser.uid ||
                        (currentUser.role === 'therapist' && a.therapistEmail?.toLowerCase() === currentUser.email?.toLowerCase())
                    )
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setAppointments(list);
            } else {
                setAppointments([]);
            }
            setLoading(prev => ({ ...prev, appointments: false }));
        });

        return () => unsub();
    }, [currentUser]);

    // FETCH NOTIFICATIONS
    useEffect(() => {
        if (!currentUser) return;

        const notifRef = ref(database, `notifications/${currentUser.uid}`);
        const unsub = onValue(notifRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const list = Object.entries(data)
                    .map(([id, val]) => ({ id, ...val }))
                    .sort((a, b) => new Date(b.date) - new Date(a.date));
                setNotifications(list);
            } else {
                setNotifications([]);
            }
            setLoading(prev => ({ ...prev, notifications: false }));
        });

        return () => unsub();
    }, [currentUser]);

    // FETCH MESSAGES
    useEffect(() => {
        if (activeTab === 'messages' && currentUser) {
            setLoading(prev => ({ ...prev, messages: true }));
            const messagesRef = ref(database, 'messages');
            const unsub = onValue(messagesRef, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    const loadedMessages = Object.keys(data)
                        .map(key => ({ id: key, ...data[key] }))
                        .filter(msg => msg.userId === currentUser.uid || msg.email === currentUser.email)
                        .sort((a, b) => new Date(b.date) - new Date(a.date));
                    setUserMessages(loadedMessages);
                } else {
                    setUserMessages([]);
                }
                setLoading(prev => ({ ...prev, messages: false }));
            });
            return () => unsub();
        }
    }, [activeTab, currentUser]);

    const [passwordData, setPasswordData] = useState({
        newPassword: '',
        confirmPassword: ''
    });
    const { changePassword } = useAuth();

    // Handlers
    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            return showToast("Passwords do not match", 'error');
        }
        if (passwordData.newPassword.length < 6) {
            return showToast("Password must be at least 6 characters", 'error');
        }

        try {
            await changePassword(passwordData.newPassword);
            showToast("Password updated successfully!");
            setPasswordData({ newPassword: '', confirmPassword: '' });
        } catch (error) {
            showToast(error.message, 'error');
        }
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        try {
            setIsEditing(false);
            await updateUserProfile({
                firstName: formData.firstName,
                lastName: formData.lastName,
                phone: formData.phone,
                age: formData.age,
                gender: formData.gender
            });
            showToast("Profile updated successfully!");
        } catch (error) {
            setIsEditing(true);
            showToast(error.message, 'error');
        }
    };

    const handlePhotoUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) return showToast('Image must be less than 2MB', 'error');
            try {
                await updateUserProfile({}, file);
                showToast("Photo updated!");
            } catch (error) {
                showToast("Failed to upload photo", 'error');
            }
        }
    };

    const handleCancelAppointment = async (id) => {
        if (confirm("Are you sure you want to cancel this request?")) {
            try {
                await update(ref(database, `appointments/${id}`), { status: 'Cancelled' });
                showToast("Appointment cancelled.", 'info');
            } catch (error) {
                showToast("Failed to cancel", 'error');
            }
        }
    };

    const markNotificationRead = (id) => {
        update(ref(database, `notifications/${currentUser.uid}/${id}`), { read: true });
    };

    const deleteNotification = (id) => {
        remove(ref(database, `notifications/${currentUser.uid}/${id}`));
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    // Sub-components
    const SidebarItem = ({ id, icon: Icon, label, badge = 0 }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={clsx(
                "w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-xl transition-all",
                activeTab === id ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-gray-600 hover:bg-gray-50"
            )}
        >
            <div className="flex items-center gap-3">
                <Icon size={20} weight={activeTab === id ? "fill" : "regular"} />
                {label}
            </div>
            <div className="flex items-center gap-2">
                {badge > 0 && (
                    <span className={clsx(
                        "px-1.5 py-0.5 text-[10px] rounded-full font-bold",
                        activeTab === id ? "bg-white text-primary" : "bg-red-500 text-white"
                    )}>
                        {badge}
                    </span>
                )}
                {activeTab === id && <CaretRight size={14} weight="bold" />}
            </div>
        </button>
    );

    return (
        <div className="bg-gray-50 min-h-screen pt-32 pb-20">
            <div className="container mx-auto px-4">

                {/* Profile Overview Card */}
                <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8 mb-8 flex flex-col md:flex-row items-center gap-8">
                    <div className="relative group">
                        <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-primary/10 shadow-inner">
                            <img src={currentUser?.photoURL || "https://i.pravatar.cc/150"} alt="Avatar" className="w-full h-full object-cover" />
                        </div>
                        <label className="absolute bottom-1 right-1 bg-primary text-white p-2 rounded-full shadow-lg cursor-pointer hover:scale-110 transition-transform">
                            <PencilSimple size={16} weight="bold" />
                            <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                        </label>
                    </div>
                    <div className="text-center md:text-left flex-1">
                        <h1 className="text-3xl font-Merriwheather font-bold text-gray-900 leading-tight">
                            Howdy, {currentUser?.firstName || 'User'}!
                        </h1>
                        <p className="text-gray-500 font-medium">{currentUser?.email}</p>
                        <div className="flex flex-wrap items-center gap-3 justify-center md:justify-start mt-4">
                            <span className="px-3 py-1 bg-primaryLight/50 text-primary text-[10px] font-bold uppercase tracking-wider rounded-lg">
                                {currentUser?.role || "Member"}
                            </span>
                            <span className="text-xs text-gray-400 font-medium">✨ Client ID: {currentUser?.uid?.slice(0, 8)}</span>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <ThemeButton variant="outline" onClick={() => navigate('/appointment')} className="!rounded-2xl">Book Massage</ThemeButton>
                        <ThemeButton variant="primary" onClick={logout} className="!rounded-2xl !bg-red-500 !border-red-500 hover:!bg-red-600">Logout</ThemeButton>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <div className="lg:col-span-1 space-y-2">
                        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-4 sticky top-28 space-y-1">
                            <SidebarItem id="personal" icon={User} label="My Profile" />
                            <SidebarItem id="appointments" icon={CalendarCheck} label="Appointments" badge={appointments.filter(a => a.status === 'Pending').length} />
                            <SidebarItem id="notifications" icon={Bell} label="Notifications" badge={unreadCount} />
                            {currentUser?.role !== 'therapist' && <SidebarItem id="messages" icon={ChatCircleDots} label="Messages" />}
                            <SidebarItem id="security" icon={Lock} label="Security" />
                        </div>
                    </div>

                    {/* Content */}
                    <div className="lg:col-span-3">
                        {toast && (
                            <div className={clsx(
                                "fixed top-24 right-4 z-[9999] px-6 py-4 rounded-2xl shadow-2xl text-white animate-fade-in-right flex items-center gap-3",
                                toast.type === 'success' ? "bg-green-600" : "bg-primary"
                            )}>
                                <CheckCircle size={24} weight="fill" />
                                <span className="font-bold">{toast.message}</span>
                            </div>
                        )}

                        {/* Personal Info */}
                        {activeTab === 'personal' && (
                            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8 md:p-12 animate-fade-in">
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-2xl font-Merriwheather font-bold text-gray-800">Profile Details</h2>
                                    <button onClick={() => setIsEditing(!isEditing)} className="text-primary font-bold text-sm flex items-center gap-2 hover:underline">
                                        {isEditing ? 'Cancel Edit' : 'Modify Information'}
                                    </button>
                                </div>
                                <form onSubmit={handleSaveProfile} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">First Name</label>
                                        <input type="text" disabled={!isEditing} value={formData.firstName} onChange={e => setFormData({ ...formData, firstName: e.target.value })} className="w-full p-4 bg-gray-50 border-transparent rounded-2xl outline-none focus:bg-white focus:border-primary transition-all disabled:opacity-60" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Last Name</label>
                                        <input type="text" disabled={!isEditing} value={formData.lastName} onChange={e => setFormData({ ...formData, lastName: e.target.value })} className="w-full p-4 bg-gray-50 border-transparent rounded-2xl outline-none focus:bg-white focus:border-primary transition-all disabled:opacity-60" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Phone Number</label>
                                        <input type="tel" disabled={!isEditing} value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full p-4 bg-gray-50 border-transparent rounded-2xl outline-none focus:bg-white focus:border-primary transition-all disabled:opacity-60" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Gender</label>
                                        <select disabled={!isEditing} value={formData.gender} onChange={e => setFormData({ ...formData, gender: e.target.value })} className="w-full p-4 bg-gray-50 border-transparent rounded-2xl appearance-none outline-none focus:bg-white focus:border-primary disabled:opacity-60">
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="prefer-not-to-say">Prefer not to say</option>
                                        </select>
                                    </div>
                                    {isEditing && (
                                        <div className="col-span-full pt-4">
                                            <ThemeButton type="submit" variant="primary" className="!px-12 !py-4 shadow-lg shadow-primary/20">Update My Account</ThemeButton>
                                        </div>
                                    )}
                                </form>
                            </div>
                        )}

                        {/* Appointments */}
                        {activeTab === 'appointments' && (
                            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8 animate-fade-in">
                                <h2 className="text-2xl font-Merriwheather font-bold text-gray-800 mb-8">My Spa Schedule</h2>
                                <div className="space-y-4">
                                    {loading.appointments ? (
                                        <div className="py-20 text-center animate-pulse text-gray-400 font-medium">Syncing your schedule...</div>
                                    ) : appointments.length === 0 ? (
                                        <div className="py-20 text-center space-y-4">
                                            <p className="text-gray-400">You haven't booked any experiences yet.</p>
                                            <ThemeButton variant="outline" onClick={() => navigate('/appointment')}>Start Your Journey</ThemeButton>
                                        </div>
                                    ) : appointments.map((apt) => (
                                        <div key={apt.id} className="group p-6 border border-gray-100 rounded-3xl hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all bg-gray-50/30 flex flex-col md:flex-row justify-between items-center gap-6">
                                            <div className="flex gap-5 flex-1">
                                                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm group-hover:scale-110 transition-transform">
                                                    <CalendarCheck size={32} />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-bold text-gray-900">
                                                        {apt.serviceName}
                                                        {currentUser.role === 'therapist' && apt.userId !== currentUser.uid && (
                                                            <span className="text-sm font-normal text-gray-400 ml-2">for {apt.customerName}</span>
                                                        )}
                                                    </h3>
                                                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500 mt-1">
                                                        <span className="flex items-center gap-1.5"><Bell size={14} className="text-primary" /> {apt.date} at {apt.time}</span>
                                                        <span className="flex items-center gap-1.5"><UserCircle size={14} className="text-primary" /> {apt.userId === currentUser.uid ? apt.therapistName : 'Patient'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-6">
                                                <span className={clsx(
                                                    "px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border",
                                                    apt.status === 'Confirmed' ? "bg-green-50 text-green-700 border-green-100" :
                                                        apt.status === 'Pending' ? "bg-amber-50 text-amber-700 border-amber-100" :
                                                            apt.status === 'Cancelled' ? "bg-red-50 text-red-700 border-red-100" : "bg-gray-100 text-gray-500"
                                                )}>
                                                    {apt.status}
                                                </span>
                                                {apt.status === 'Pending' && apt.userId === currentUser.uid && (
                                                    <button onClick={() => handleCancelAppointment(apt.id)} className="text-xs font-bold text-red-400 hover:text-red-600 transition-colors">Cancel Request</button>
                                                )}
                                                {apt.status === 'Completed' && !apt.reviewed && apt.userId === currentUser.uid && (
                                                    <ThemeButton variant="primary" className="!py-2 !px-4 !text-xs" onClick={() => { setSelectedApt(apt); setReviewMode('add'); setIsReviewOpen(true); }}>Review</ThemeButton>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Notifications */}
                        {activeTab === 'notifications' && (
                            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8 animate-fade-in min-h-[500px]">
                                <h2 className="text-2xl font-Merriwheather font-bold text-gray-800 mb-8 flex items-center gap-3">
                                    Notifications {unreadCount > 0 && <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full animate-pulse">{unreadCount} NEW</span>}
                                </h2>
                                <div className="space-y-4">
                                    {notifications.length === 0 ? (
                                        <div className="py-20 text-center text-gray-400">Your inbox is empty. ✨</div>
                                    ) : notifications.map((n) => (
                                        <div
                                            key={n.id}
                                            onMouseEnter={() => !n.read && markNotificationRead(n.id)}
                                            className={clsx(
                                                "p-6 rounded-3xl border transition-all flex items-start gap-4 relative group",
                                                n.read ? "bg-white border-gray-50" : "bg-primary/5 border-primary/10 shadow-sm"
                                            )}
                                        >
                                            <div className={clsx(
                                                "p-3 rounded-2xl",
                                                n.title.includes('Confirm') ? "bg-green-100 text-green-600" :
                                                    n.title.includes('Cancel') ? "bg-red-100 text-red-600" : "bg-primary/10 text-primary"
                                            )}>
                                                {n.title.includes('Confirm') ? <CheckCircle size={24} weight="fill" /> :
                                                    n.title.includes('Cancel') ? <XCircle size={24} weight="fill" /> : <Info size={24} weight="fill" />}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-1">
                                                    <h4 className="font-bold text-gray-900">{n.title}</h4>
                                                    {!n.read && <div className="w-2 h-2 bg-primary rounded-full" />}
                                                </div>
                                                <p className="text-sm text-gray-600 leading-relaxed mb-2 whitespace-pre-line">{n.message}</p>
                                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">{new Date(n.date).toLocaleString()}</span>
                                            </div>
                                            <button onClick={() => deleteNotification(n.id)} className="opacity-0 group-hover:opacity-100 p-2 text-gray-300 hover:text-red-500 transition-all absolute top-4 right-4">
                                                <Trash size={18} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Messages Tab */}
                        {activeTab === 'messages' && currentUser?.role !== 'therapist' && (
                            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8 animate-fade-in">
                                <h2 className="text-2xl font-Merriwheather font-bold text-gray-800 mb-8">Messages & Queries</h2>
                                <div className="space-y-6">
                                    {loading.messages ? (
                                        <div className="py-10 text-center animate-pulse text-gray-400">Loading your conversations...</div>
                                    ) : userMessages.length === 0 ? (
                                        <div className="py-20 text-center text-gray-400">No active messages.</div>
                                    ) : userMessages.map((msg) => (
                                        <div key={msg.id} className="p-8 border border-gray-50 rounded-[2rem] bg-gray-50/20">
                                            <div className="pb-4 border-b border-gray-100 flex justify-between items-center mb-6">
                                                <h3 className="font-bold text-gray-800">{msg.subject}</h3>
                                                <span className="text-[10px] bg-white px-3 py-1 rounded-full text-gray-400 font-bold uppercase">{msg.date}</span>
                                            </div>
                                            <div className="space-y-4">
                                                <div className="flex flex-col items-end">
                                                    <div className="bg-primary text-white p-5 rounded-3xl rounded-tr-none max-w-[80%] shadow-lg shadow-primary/10">
                                                        <p className="text-sm">{msg.message}</p>
                                                    </div>
                                                </div>
                                                {msg.adminReply && (
                                                    <div className="flex flex-col items-start pt-2">
                                                        <div className="bg-white border border-gray-100 p-5 rounded-3xl rounded-tl-none max-w-[80%] shadow-sm">
                                                            <p className="text-sm text-gray-800">{msg.adminReply}</p>
                                                        </div>
                                                        <span className="text-[10px] text-primary font-bold tracking-widest mt-2 ml-2">ADMIN RESPONSE</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Security Tab */}
                        {activeTab === 'security' && (
                            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8 md:p-12 animate-fade-in">
                                <h2 className="text-2xl font-Merriwheather font-bold text-gray-800 mb-8">Security Settings</h2>
                                <div className="max-w-md">
                                    <form onSubmit={handlePasswordChange} className="space-y-6">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">New Password</label>
                                            <input
                                                type="password"
                                                placeholder="••••••••"
                                                value={passwordData.newPassword}
                                                onChange={e => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                                className="w-full p-4 bg-gray-50 border-transparent rounded-2xl outline-none focus:bg-white focus:border-primary transition-all"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Confirm New Password</label>
                                            <input
                                                type="password"
                                                placeholder="••••••••"
                                                value={passwordData.confirmPassword}
                                                onChange={e => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                                className="w-full p-4 bg-gray-50 border-transparent rounded-2xl outline-none focus:bg-white focus:border-primary transition-all"
                                                required
                                            />
                                        </div>
                                        <div className="pt-2">
                                            <ThemeButton type="submit" variant="primary" className="shadow-lg shadow-primary/20">Update Password</ThemeButton>
                                        </div>
                                    </form>
                                    <div className="mt-10 p-6 bg-amber-50 rounded-[2rem] border border-amber-100 flex gap-4">
                                        <div className="size-10 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 shrink-0">
                                            <Lock size={20} weight="bold" />
                                        </div>
                                        <div className="space-y-1">
                                            <h4 className="font-bold text-amber-900 text-sm">Security Tip</h4>
                                            <p className="text-xs text-amber-700/80 leading-relaxed">Use at least 8 characters with a mix of letters, numbers, and symbols to keep your account safe.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Preferences etc placeholders */}
                    </div>
                </div>
            </div>

            <ReviewModal
                isOpen={isReviewOpen}
                onClose={() => setIsReviewOpen(false)}
                appointment={selectedApt}
                onSubmit={() => showToast("Review submitted!")}
                mode={reviewMode}
            />
        </div>
    );
};

export default ProfilePage;
