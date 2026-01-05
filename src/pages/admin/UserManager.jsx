import { useState, useEffect } from 'react';
import { database } from '../../firebase';
import { ref, update, onValue, remove, push, set } from 'firebase/database';
import { useAuth } from '../../context/auth-context';
import { Trash, Prohibit, CheckCircle, PencilSimple, Plus, User, Envelope, Phone, MagnifyingGlass, GenderMale, GenderFemale, Smiley } from 'phosphor-react';
import clsx from 'clsx';
import Modal from '../../components/Modal/Modal';
import { useToast } from '../../context/toast-context';
import ThemeButton from '../../components/themeButton/themeButton';
import TitleComponent from '../../components/titleComponent/titleComponent';

const UserManager = () => {
    const [users, setUsers] = useState([]);
    const { showToast } = useToast();
    const [filterRole, setFilterRole] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const { updateUserRole, currentUser } = useAuth();

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        age: '',
        gender: 'prefer-not-to-say',
        role: 'Customer',
        status: 'Active',
        image: '',
        password: '', // Only for new users
        confirmPassword: ''
    });

    // Fetch Users from Firebase
    useEffect(() => {
        const usersRef = ref(database, 'users');
        const unsubscribe = onValue(usersRef, (snapshot) => {
            if (snapshot.exists()) {
                const usersData = snapshot.val();
                const usersArray = Object.keys(usersData).map(key => ({
                    id: key,
                    ...usersData[key],
                    // Handle various name storage formats
                    firstName: usersData[key].firstName || '',
                    lastName: usersData[key].lastName || '',
                    name: usersData[key].displayName || `${usersData[key].firstName || ''} ${usersData[key].lastName || ''}`.trim() || 'Unknown User',
                    image: usersData[key].photoURL || usersData[key].image || '',
                    role: usersData[key].role ? usersData[key].role.charAt(0).toUpperCase() + usersData[key].role.slice(1) : 'Customer',
                    status: usersData[key].disabled ? 'Disabled' : 'Active',
                    joinDate: usersData[key].createdAt ? new Date(usersData[key].createdAt).toLocaleDateString() : 'N/A'
                }));
                setUsers(usersArray);
            } else {
                setUsers([]);
            }
        });

        return () => unsubscribe();
    }, []);

    // Filter Users
    const filteredUsers = users.filter(user => {
        const matchesRole = filterRole === 'All' || user.role === filterRole;
        const matchesSearch = (user.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (user.email || '').toLowerCase().includes(searchQuery.toLowerCase());
        return matchesRole && matchesSearch;
    });

    const openModal = (user = null) => {
        if (user) {
            setEditingUser(user);
            setFormData({
                firstName: user.firstName || user.name.split(' ')[0] || '',
                lastName: user.lastName || user.name.split(' ').slice(1).join(' ') || '',
                email: user.email || '',
                phone: user.phone || '',
                age: user.age || '',
                gender: user.gender || 'prefer-not-to-say',
                role: user.role,
                status: user.status,
                image: user.image,
                password: '', // Don't show password
                confirmPassword: ''
            });
        } else {
            setEditingUser(null);
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                age: '',
                gender: 'prefer-not-to-say',
                role: 'Customer',
                status: 'Active',
                image: '',
                password: '',
                confirmPassword: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleSave = async () => {
        // Basic Validation
        if (!formData.firstName || !formData.lastName || !formData.email) {
            showToast("First Name, Last Name and Email are required", "error");
            return;
        }

        if (!editingUser) {
            if (formData.password !== formData.confirmPassword) {
                showToast("Passwords do not match", "error");
                return;
            }
            if (formData.password && formData.password.length < 6) {
                showToast("Password must be at least 6 characters", "error");
                return;
            }
        }

        try {
            const userData = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                displayName: `${formData.firstName} ${formData.lastName}`.trim(),
                email: formData.email,
                phone: formData.phone,
                age: formData.age,
                gender: formData.gender,
                role: formData.role.toLowerCase(),
                disabled: formData.status === 'Disabled',
                image: formData.image,
                photoURL: formData.image, // Ensure photoURL is also updated to match
                updatedAt: new Date().toISOString()
            };

            if (editingUser) {
                // UPDATE USER
                const userRef = ref(database, `users/${editingUser.id}`);
                await update(userRef, userData);

                // If role changed, try to update in custom claims (if supported by auth context helper)
                if (editingUser.role !== formData.role) {
                    try {
                        await updateUserRole(editingUser.id, formData.role.toLowerCase());
                    } catch (e) {
                        console.warn("Could not update auth role claim, likely needs cloud function", e);
                    }
                }

                showToast("User updated successfully", 'success');
            } else {
                // CREATE USER (DB only, note limitation)
                const newUsersRef = ref(database, 'users');
                const newUserRef = push(newUsersRef); // Generate key

                // Note: Real authentication creation requires Admin SDK or client-side auth which logs out current user.
                // We are only creating the DB record here as per request context.
                await set(newUserRef, {
                    ...userData,
                    createdAt: new Date().toISOString()
                });
                showToast("User record created successfully", 'success');
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error saving user:", error);
            showToast("Failed to save user: " + error.message, 'error');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
            try {
                await remove(ref(database, `users/${id}`));
                showToast("User deleted successfully", 'success');
            } catch (error) {
                console.error("Error deleting user:", error);
                showToast("Failed to delete user", 'error');
            }
        }
    };

    const toggleStatus = async (user) => {
        try {
            const newStatus = user.status === 'Active'; // If active, we are disabling
            const userRef = ref(database, `users/${user.id}`);
            await update(userRef, {
                disabled: newStatus
            });
            showToast(`User ${newStatus ? 'disabled' : 'activated'}`, 'info');
        } catch (error) {
            console.error("Error changing status:", error);
            showToast("Failed to change status", 'error');
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 1024 * 1024) {
            showToast("Image size too large. Please select under 1MB", 'error');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData(prev => ({ ...prev, image: reader.result }));
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="space-y-8 animate-fade-in-down pb-20">
            {/* Header Steps */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <TitleComponent type="h2">Users Directory</TitleComponent>
                    <TitleComponent type="p" size="base" className="text-gray-500 mt-2">
                        Manage system access, customer profiles and roles.
                    </TitleComponent>
                </div>
                <ThemeButton variant="primary" onClick={() => openModal()} className="flex items-center gap-2">
                    <Plus size={20} weight="bold" /> Add User
                </ThemeButton>
            </div>

            {/* Toolbar: Filters & Search */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
                {/* Search Bar */}
                <div className="relative w-full md:w-80">
                    <MagnifyingGlass size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search users..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all outline-none"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                {/* Pill Tabs */}
                <div className="flex bg-gray-100/80 p-1 rounded-xl w-full md:w-auto overflow-x-auto">
                    {['All', 'Customer', 'Admin', 'Therapist'].map(role => (
                        <button
                            key={role}
                            onClick={() => setFilterRole(role)}
                            className={clsx(
                                "px-6 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap",
                                filterRole === role
                                    ? "bg-white text-primary shadow-sm scale-100"
                                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
                            )}
                        >
                            {role}
                        </button>
                    ))}
                </div>
            </div>

            {/* Premium Table Layout */}
            <div className="overflow-x-auto pb-4">
                <table className="w-full border-separate border-spacing-y-3">
                    <thead>
                        <tr className="text-gray-400 text-xs uppercase font-bold tracking-wider text-left">
                            <th className="px-6 py-3 font-sans pl-8">User Profile</th>
                            <th className="px-6 py-3 font-sans">Role & Status</th>
                            <th className="px-6 py-3 font-sans">Contact Details</th>
                            <th className="px-6 py-3 font-sans text-right pr-8">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.length > 0 ? filteredUsers.map((user) => (
                            <tr key={user.id} className="group transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-xl shadow-sm bg-white rounded-2xl border border-gray-100/50">
                                {/* Profile Column */}
                                <td className="px-6 py-5 rounded-l-2xl border-l border-y border-gray-100 group-hover:border-primary/10 bg-white">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-full border-2 border-white shadow-md overflow-hidden flex-shrink-0 bg-gray-50 relative group-hover:scale-105 transition-transform duration-500">
                                            {user.image ? (
                                                <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primaryLight to-white text-primary font-Merriwheather font-bold text-xl">
                                                    {(user.name || '?').charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="font-Merriwheather font-bold text-gray-900 text-lg leading-tight group-hover:text-primary transition-colors">{user.name}</h4>
                                            <div className="flex items-center gap-2 text-xs text-gray-500 mt-1.5 font-medium">
                                                <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-600">Age: {user.age || 'N/A'}</span>
                                                <span className="text-gray-300">•</span>
                                                <span className="capitalize flex items-center gap-1">
                                                    {user.gender === 'male' && <GenderMale size={14} className="text-blue-500" />}
                                                    {user.gender === 'female' && <GenderFemale size={14} className="text-pink-500" />}
                                                    {user.gender || 'Unknown'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </td>

                                {/* Role & Status Column */}
                                <td className="px-6 py-5 border-y border-gray-100 group-hover:border-primary/10 bg-white">
                                    <div className="space-y-3">
                                        <span className={clsx(
                                            "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border shadow-sm tracking-wide uppercase",
                                            user.role === 'Admin' ? "bg-purple-50 text-purple-700 border-purple-200" :
                                                user.role === 'Therapist' ? "bg-blue-50 text-blue-700 border-blue-200" :
                                                    "bg-amber-50 text-amber-700 border-amber-200"
                                        )}>
                                            <span className={clsx("w-1.5 h-1.5 rounded-full",
                                                user.role === 'Admin' ? "bg-purple-500" :
                                                    user.role === 'Therapist' ? "bg-blue-500" : "bg-amber-500"
                                            )}></span>
                                            {user.role}
                                        </span>

                                        <div className="flex items-center gap-2">
                                            <div className={clsx("w-2 h-2 rounded-full", user.status === "Active" ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse" : "bg-red-500")}></div>
                                            <span className={clsx("text-sm font-semibold", user.status === "Active" ? "text-green-600" : "text-red-500")}>
                                                {user.status}
                                            </span>
                                        </div>
                                    </div>
                                </td>

                                {/* Contact Column */}
                                <td className="px-6 py-5 border-y border-gray-100 group-hover:border-primary/10 bg-white">
                                    <div className="space-y-2.5">
                                        <div className="flex items-center gap-2.5 text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                                            <div className="p-1.5 bg-primaryLight/30 rounded-full text-primary">
                                                <Envelope size={14} weight="fill" />
                                            </div>
                                            <span className="truncate max-w-[180px] font-medium font-sans">{user.email}</span>
                                        </div>
                                        <div className="flex items-center gap-2.5 text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                                            <div className="p-1.5 bg-primaryLight/30 rounded-full text-primary">
                                                <Phone size={14} weight="fill" />
                                            </div>
                                            <span className="font-mono tracking-tight">{user.phone || 'N/A'}</span>
                                        </div>
                                    </div>
                                </td>

                                {/* Actions Column */}
                                <td className="px-6 py-5 rounded-r-2xl border-r border-y border-gray-100 group-hover:border-primary/10 bg-white text-right">
                                    <div className="flex items-center justify-end gap-1 opacity-60 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                                        <button
                                            onClick={() => toggleStatus(user)}
                                            className={clsx(
                                                "p-2.5 rounded-full transition-all duration-300",
                                                user.status === 'Active'
                                                    ? "text-orange-400 hover:text-white hover:bg-orange-400 hover:shadow-lg hover:shadow-orange-200"
                                                    : "text-green-500 hover:text-white hover:bg-green-500 hover:shadow-lg hover:shadow-green-200"
                                            )}
                                            title={user.status === 'Active' ? "Disable User" : "Activate User"}
                                        >
                                            {user.status === 'Active' ? <Prohibit size={18} weight="bold" /> : <CheckCircle size={18} weight="bold" />}
                                        </button>

                                        <button
                                            onClick={() => openModal(user)}
                                            className="p-2.5 text-gray-400 hover:text-white hover:bg-primary hover:shadow-lg hover:shadow-primary/30 rounded-full transition-all duration-300"
                                            title="Edit User"
                                        >
                                            <PencilSimple size={18} weight="bold" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(user.id)}
                                            className="p-2.5 text-gray-400 hover:text-white hover:bg-red-500 hover:shadow-lg hover:shadow-red-200 rounded-full transition-all duration-300"
                                            title="Delete User"
                                        >
                                            <Trash size={18} weight="bold" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="4" className="px-6 py-16 text-center">
                                    <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 max-w-lg mx-auto">
                                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                                            <MagnifyingGlass size={32} className="text-gray-300" />
                                        </div>
                                        <h3 className="text-gray-900 font-bold text-lg mb-1">No users found</h3>
                                        <p className="text-gray-500 text-sm">We couldn't find any users matching your search or filters.</p>
                                        <button
                                            onClick={() => { setSearchQuery(''); setFilterRole('All'); }}
                                            className="mt-4 text-primary font-semibold text-sm hover:underline"
                                        >
                                            Clear all filters
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Edit Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingUser ? "Edit User Profile" : "Create New User"}
                className="max-w-2xl"
                footer={
                    <>
                        <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium">Cancel</button>
                        <ThemeButton variant="primary" onClick={handleSave} className="!py-2 !px-6 text-sm">
                            {editingUser ? 'Save Changes' : 'Create User'}
                        </ThemeButton>
                    </>
                }
            >
                <div>
                    <div className="col-span-full flex justify-center mb-6">
                        <div className="relative group cursor-pointer w-24 h-24">
                            <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg relative">
                                {formData.image ? (
                                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <User size={36} className="text-gray-400" />
                                )}
                            </div>
                            <label className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full shadow-md hover:bg-primaryDark transition-colors cursor-pointer border-2 border-white">
                                <Plus size={16} weight="bold" />
                                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                            </label>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-gray-700">First Name <span className="text-red-500">*</span></label>
                            <input
                                className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                                value={formData.firstName}
                                onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                                placeholder="Jane"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-gray-700">Last Name <span className="text-red-500">*</span></label>
                            <input
                                className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                                value={formData.lastName}
                                onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                                placeholder="Doe"
                            />
                        </div>

                        <div className="space-y-1.5 md:col-span-2">
                            <label className="text-sm font-semibold text-gray-700">Email Address <span className="text-red-500">*</span></label>
                            <input
                                type="email"
                                className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                placeholder="jane@example.com"
                            />
                        </div>

                        {!editingUser && (
                            <>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-gray-700">Password <span className="text-red-500">*</span></label>
                                    <input
                                        type="password"
                                        className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                                        value={formData.password}
                                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                                        placeholder="Min 6 chars"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-gray-700">Confirm Password <span className="text-red-500">*</span></label>
                                    <input
                                        type="password"
                                        className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                                        value={formData.confirmPassword}
                                        onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                                        placeholder="Re-enter password"
                                    />
                                </div>
                                <div className="md:col-span-2 text-xs text-amber-600 bg-amber-50 p-2 rounded border border-amber-100">
                                    Note: Creating a user here only creates a database record. The user will need to sign up formally or you must use the Admin SDK to generate Auth credentials.
                                </div>
                            </>
                        )}

                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-gray-700">Phone</label>
                            <input
                                className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                                value={formData.phone}
                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                placeholder="+1 (555) 000-0000"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-gray-700">Age</label>
                            <input
                                type="number"
                                className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                                value={formData.age}
                                onChange={e => setFormData({ ...formData, age: e.target.value })}
                                placeholder="18"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-gray-700">Gender</label>
                            <select
                                className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                                value={formData.gender}
                                onChange={e => setFormData({ ...formData, gender: e.target.value })}
                            >
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                                <option value="prefer-not-to-say">Prefer not to say</option>
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-gray-700">Role</label>
                            <select
                                className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                                value={formData.role}
                                onChange={e => setFormData({ ...formData, role: e.target.value })}
                            >
                                <option value="Customer">Customer</option>
                                <option value="Therapist">Therapist</option>
                                <option value="Admin">Admin</option>
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-gray-700">Status</label>
                            <select
                                className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                                value={formData.status}
                                onChange={e => setFormData({ ...formData, status: e.target.value })}
                            >
                                <option value="Active">Active</option>
                                <option value="Disabled">Disabled</option>
                            </select>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default UserManager;
