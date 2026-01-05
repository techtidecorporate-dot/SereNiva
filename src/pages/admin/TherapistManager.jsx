import { useState, useRef, useEffect } from 'react';
import { database } from '../../firebase';
import { ref, set, push, onValue, remove, update } from 'firebase/database';
import {
    Plus, PencilSimple, Trash, UserCircle, Envelope, Phone, Clock, Check,
    Image as ImageIcon, FacebookLogo, TwitterLogo, LinkedinLogo, InstagramLogo, YoutubeLogo
} from 'phosphor-react';
import clsx from 'clsx';
import ThemeButton from '../../components/themeButton/themeButton';
import TitleComponent from '../../components/titleComponent/titleComponent';
import { useToast } from '../../context/toast-context';

const TherapistManager = () => {
    const [therapists, setTherapists] = useState([]);
    const { showToast } = useToast();
    const formRef = useRef(null);
    const fileInputRef = useRef(null);

    const [editingId, setEditingId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        specialty: '',
        shift: 'Morning',
        phone: '',
        status: 'Active',
        image: '',
        altText: '',
        socials: {
            facebook: '',
            twitter: '',
            linkedin: '',
            instagram: ''
        }
    });

    useEffect(() => {
        const therapistsRef = ref(database, 'therapists');
        const unsubscribe = onValue(therapistsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const therapistList = Object.entries(data).map(([key, value]) => ({
                    id: key,
                    ...value
                }));
                setTherapists(therapistList);
            } else {
                setTherapists([]);
            }
            setIsFetching(false);
        });
        return () => unsubscribe();
    }, []);

    const resetForm = () => {
        setFormData({
            name: '',
            email: '',
            specialty: '',
            shift: 'Morning',
            phone: '',
            status: 'Active',
            image: '',
            altText: '',
            socials: {
                facebook: '',
                twitter: '',
                linkedin: '',
                instagram: ''
            }
        });
        setEditingId(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleEdit = (therapist) => {
        setEditingId(therapist.id);
        const { id, ...data } = therapist;
        // Ensure socials structure exists if it was missing in DB
        setFormData({
            ...data,
            socials: {
                facebook: '',
                twitter: '',
                linkedin: '',
                instagram: '',
                ...(data.socials || {})
            }
        });
        setTimeout(() => {
            formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        if (window.confirm("Are you sure you want to remove this therapist?")) {
            try {
                await remove(ref(database, `therapists/${id}`));
                showToast("Therapist removed", 'success');
            } catch (error) {
                console.error("Error deleting therapist:", error);
                showToast("Failed to delete therapist", 'error');
            }
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Check file size limit
        if (file.size > 1024 * 1024) {
            showToast("Image size too large. Please choose an image under 1MB.", 'error');
            return;
        }

        setIsLoading(true);
        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData(prev => ({ ...prev, image: reader.result }));
            setIsLoading(false);
            showToast("Image converted successfully", 'success');
        };
        reader.onerror = () => {
            console.error("Error reading file");
            showToast("Failed to process image", 'error');
            setIsLoading(false);
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.specialty) {
            showToast("Please fill in required fields", 'error');
            return;
        }

        setIsLoading(true);
        try {
            if (editingId) {
                await update(ref(database, `therapists/${editingId}`), formData);
                showToast("Therapist updated successfully", 'success');
            } else {
                const newTherapistRef = push(ref(database, 'therapists'));
                await set(newTherapistRef, {
                    ...formData,
                    createdAt: new Date().toISOString()
                });
                showToast("New therapist added", 'success');
            }
            resetForm();
        } catch (error) {
            console.error("Error saving therapist:", error);
            showToast("Failed to save therapist details", 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-8 animate-fade-in-down pb-20">
            {/* Page Header */}
            <div>
                <TitleComponent type="h2">Therapist Management</TitleComponent>
                <TitleComponent type="p" size="base" className="text-gray-500 mt-2">
                    Manage your professional team, schedules, and profiles.
                </TitleComponent>
            </div>

            {/* Input Form Section */}
            <div ref={formRef} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
                <div className="mb-8 border-b border-gray-100 pb-4">
                    <TitleComponent type="h4" className="flex items-center gap-2 text-primary">
                        {editingId ? <PencilSimple size={24} /> : <Plus size={24} />}
                        {editingId ? 'Edit Therapist' : 'Add New Therapist'}
                    </TitleComponent>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
                    {/* Left Col - Personal Info */}
                    <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-semibold text-gray-700 tracking-wide">FULL NAME *</label>
                            <input
                                type="text"
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                placeholder="e.g. Dr. Sarah Jenkins"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 tracking-wide">EMAIL ADDRESS *</label>
                            <input
                                type="email"
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:border-primary outline-none"
                                placeholder="sarah@example.com"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 tracking-wide">CONTACT NO</label>
                            <input
                                type="text"
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:border-primary outline-none"
                                placeholder="+1 (555) 000-0000"
                                value={formData.phone}
                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 tracking-wide">SPECIALTY *</label>
                            <input
                                type="text"
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:border-primary outline-none"
                                placeholder="e.g. Senior Massage Therapist"
                                value={formData.specialty}
                                onChange={e => setFormData({ ...formData, specialty: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 tracking-wide">AVAILABILITY (SHIFT)</label>
                            <select
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:border-primary outline-none"
                                value={formData.shift}
                                onChange={e => setFormData({ ...formData, shift: e.target.value })}
                            >
                                <option>Morning</option>
                                <option>Afternoon</option>
                                <option>Evening</option>
                                <option>Flexible</option>
                            </select>
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-semibold text-gray-700 tracking-wide">STATUS</label>
                            <select
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:border-primary outline-none"
                                value={formData.status}
                                onChange={e => setFormData({ ...formData, status: e.target.value })}
                            >
                                <option value="Active">Active</option>
                                <option value="On Leave">On Leave</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>

                        {/* Social Media Section */}
                        <div className="space-y-4 md:col-span-2 pt-6 border-t border-gray-100 mt-2">
                            <label className="text-sm font-semibold text-gray-700 tracking-wide block mb-1">SOCIAL PROFILES (OPTIONAL)</label>
                            <div className="grid grid-cols-1 gap-4">
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-blue-700">
                                        <LinkedinLogo size={20} weight="fill" />
                                    </div>
                                    <input
                                        type="url"
                                        className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:border-primary outline-none"
                                        placeholder="LinkedIn Profile URL"
                                        value={formData.socials.linkedin}
                                        onChange={e => setFormData({
                                            ...formData,
                                            socials: { ...formData.socials, linkedin: e.target.value }
                                        })}
                                    />
                                </div>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-blue-500">
                                        <TwitterLogo size={20} weight="fill" />
                                    </div>
                                    <input
                                        type="url"
                                        className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:border-primary outline-none"
                                        placeholder="X (Twitter) Profile URL"
                                        value={formData.socials.twitter}
                                        onChange={e => setFormData({
                                            ...formData,
                                            socials: { ...formData.socials, twitter: e.target.value }
                                        })}
                                    />
                                </div>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-blue-600">
                                        <FacebookLogo size={20} weight="fill" />
                                    </div>
                                    <input
                                        type="url"
                                        className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:border-primary outline-none"
                                        placeholder="Facebook Profile URL"
                                        value={formData.socials.facebook}
                                        onChange={e => setFormData({
                                            ...formData,
                                            socials: { ...formData.socials, facebook: e.target.value }
                                        })}
                                    />
                                </div>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-pink-600">
                                        <InstagramLogo size={20} weight="fill" />
                                    </div>
                                    <input
                                        type="url"
                                        className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:border-primary outline-none"
                                        placeholder="Instagram Profile URL"
                                        value={formData.socials.instagram}
                                        onChange={e => setFormData({
                                            ...formData,
                                            socials: { ...formData.socials, instagram: e.target.value }
                                        })}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Col - Image & Preview */}
                    <div className="lg:col-span-4 space-y-5">
                        {/* Image Upload */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 tracking-wide">PROFILE IMAGE</label>
                            <div className="flex items-center gap-3">
                                <label className="flex-1 cursor-pointer">
                                    <div className="w-full p-2.5 bg-gray-50 border border-gray-200 border-dashed rounded-lg text-sm text-gray-500 hover:bg-gray-100 hover:border-primary transition-colors flex items-center justify-center gap-2">
                                        <ImageIcon size={18} />
                                        <span>{formData.image ? 'Change Photo' : 'Upload Photo'}</span>
                                    </div>
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        ref={fileInputRef}
                                        onChange={handleImageChange}
                                        disabled={isLoading}
                                    />
                                </label>
                                {formData.image && (
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, image: '' })}
                                        className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                                    >
                                        <Trash size={18} />
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 tracking-wide">IMAGE ALT TEXT</label>
                            <input
                                type="text"
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:border-primary outline-none"
                                placeholder="Description of therapist..."
                                value={formData.altText}
                                onChange={e => setFormData({ ...formData, altText: e.target.value })}
                            />
                        </div>

                        {/* Image Preview */}
                        <div className="aspect-square w-full max-w-[200px] mx-auto rounded-full bg-gray-100 border-4 border-white shadow-lg overflow-hidden flex items-center justify-center relative">
                            {formData.image ? (
                                <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <div className="text-gray-400 flex flex-col items-center">
                                    <UserCircle size={64} weight="thin" />
                                    <span className="text-xs mt-1">No Image</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="col-span-full flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-gray-100">
                        {editingId && (
                            <ThemeButton
                                variant="outline"
                                onClick={resetForm}
                                className="!py-2 !px-6"
                            >
                                Cancel Edit
                            </ThemeButton>
                        )}
                        <ThemeButton
                            variant="primary"
                            type="submit"
                            className="!py-2 !px-8 flex items-center justify-center gap-2"
                        >
                            {editingId ? <Check size={20} weight="bold" /> : <Plus size={20} weight="bold" />}
                            {editingId ? 'Update Therapist' : 'Add Therapist'}
                        </ThemeButton>
                    </div>
                </form>
            </div>

            {/* Grid List Section */}
            <div>
                <div className="flex items-center justify-between mb-6 px-1">
                    <TitleComponent type="h3" size="large-bold" className="text-gray-800">
                        Our Therapists
                        <span className="ml-2 text-sm font-normal text-gray-500 font-sans tracking-normal">({therapists.length} Team Members)</span>
                    </TitleComponent>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {isFetching ? (
                        // Loading Skeletons
                        Array(3).fill(0).map((_, index) => (
                            <div key={index} className="bg-white rounded-xl overflow-hidden border border-gray-100 flex flex-col h-[400px] animate-pulse">
                                <div className="h-24 bg-gray-200/50 w-full relative"></div>
                                <div className="pt-8 px-6 flex flex-col items-center">
                                    <div className="w-32 h-32 rounded-full bg-gray-200 z-10 border-4 border-white"></div>
                                    <div className="h-6 w-3/4 bg-gray-200 rounded mt-4"></div>
                                    <div className="h-4 w-1/2 bg-gray-200 rounded mt-2"></div>
                                    <div className="h-6 w-20 bg-gray-200 rounded-full mt-2"></div>
                                </div>
                                <div className="p-6 mt-4 space-y-3">
                                    <div className="h-8 w-full bg-gray-200 rounded"></div>
                                    <div className="h-8 w-full bg-gray-200 rounded"></div>
                                    <div className="h-8 w-full bg-gray-200 rounded"></div>
                                </div>
                            </div>
                        ))
                    ) : therapists.length === 0 ? (
                        <div className="col-span-full py-12 text-center text-gray-400">
                            <UserCircle size={64} weight="thin" className="mx-auto mb-2" />
                            <p>No therapists found. Add one to get started.</p>
                        </div>
                    ) : (
                        therapists.map((therapist) => (
                            <div key={therapist.id} className="group bg-white rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-500 ease-out flex flex-col border border-gray-100 relative">
                                {/* Background Decoration */}
                                <div className="h-24 bg-primaryLight/30 w-full absolute top-0 left-0 z-0"></div>

                                {/* Card Header / Image */}
                                <div className="pt-8 px-6 flex flex-col items-center relative z-10">
                                    <div className="w-32 h-32 rounded-full border-4 border-white shadow-md overflow-hidden relative group-hover:scale-105 transition-transform duration-500">
                                        {therapist.image ? (
                                            <img
                                                src={therapist.image}
                                                alt={therapist.altText || therapist.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                                                <UserCircle size={64} weight="light" />
                                            </div>
                                        )}
                                        {/* Glass Overlay on Hover */}
                                        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-[1px]"></div>
                                    </div>

                                    <h3 className="font-Merriwheather font-bold text-xl text-gray-900 mt-4 text-center">{therapist.name}</h3>
                                    <p className="text-primary font-medium text-sm text-center uppercase tracking-wide">{therapist.specialty}</p>

                                    <div className="mt-2">
                                        <span className={clsx(
                                            "px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase",
                                            therapist.status === 'Active' ? "bg-green-100 text-green-700" :
                                                therapist.status === 'On Leave' ? "bg-orange-100 text-orange-700" : "bg-gray-100 text-gray-600"
                                        )}>
                                            {therapist.status}
                                        </span>
                                    </div>
                                </div>

                                {/* Details */}
                                <div className="p-6 mt-2 space-y-3 relative z-10">
                                    <div className="flex items-center gap-3 text-sm text-gray-600 bg-gray-50/50 p-2 rounded-lg">
                                        <Envelope size={18} className="text-primary" />
                                        <span className="truncate">{therapist.email || 'No email provided'}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-600 bg-gray-50/50 p-2 rounded-lg">
                                        <Phone size={18} className="text-primary" />
                                        <span>{therapist.phone || 'No phone number'}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-600 bg-gray-50/50 p-2 rounded-lg">
                                        <Clock size={18} className="text-primary" />
                                        <span>{therapist.shift} Shift</span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="mt-auto p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/30 relative z-20">
                                    <button
                                        onClick={() => handleEdit(therapist)}
                                        className="flex-1 text-gray-600 hover:text-primary font-medium text-sm py-2 hover:bg-white rounded-lg transition-all flex items-center justify-center gap-2"
                                    >
                                        <PencilSimple size={18} /> Edit Profile
                                    </button>
                                    <div className="w-[1px] h-6 bg-gray-200 mx-2"></div>
                                    <button
                                        onClick={(e) => handleDelete(e, therapist.id)}
                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                        title="Delete Therapist"
                                    >
                                        <Trash size={18} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default TherapistManager;
