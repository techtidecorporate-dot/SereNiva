import { useState, useRef, useEffect } from 'react';
import { database } from '../../firebase';
import { ref, onValue, push, remove, update, set } from 'firebase/database';
import { Plus, PencilSimple, Trash, Image as ImageIcon, Star, Clock, Tag, Check } from 'phosphor-react';
import clsx from 'clsx';
import { useToast } from '../../context/toast-context';
import TitleComponent from '../../components/titleComponent/titleComponent';
import ThemeButton from '../../components/themeButton/themeButton';
import { massageServicesData } from '../../Data';

const ServiceManager = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const { showToast } = useToast();
    const formRef = useRef(null);

    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        category: 'Massage',
        price: '',
        duration: '60 min',
        cardDescription: '',
        fullDescription: '',
        detailPageHeading: '',
        image: '',
        altText: '',
        featured: false,
        status: 'Active',
        benefits: [], // Array of strings
        included: [], // Array of strings
    });

    // Fetch Services from Firebase
    useEffect(() => {
        const servicesRef = ref(database, 'services');

        const unsubscribeServices = onValue(servicesRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const servicesArray = Object.keys(data).map(key => ({
                    id: key,
                    ...data[key]
                }));
                setServices(servicesArray);
            } else {
                setServices([]);
            }
            setLoading(false);
        });

        return () => {
            unsubscribeServices();
        };
    }, []);

    const resetForm = () => {
        setFormData({
            name: '',
            category: 'Massage',
            price: '',
            duration: '60 min',
            cardDescription: '',
            fullDescription: '',
            detailPageHeading: '',
            image: '',
            altText: '',
            featured: false,
            status: 'Active',
            benefits: [],
            included: [],
        });
        setEditingId(null);
    };

    const handleEdit = (service) => {
        setEditingId(service.id);
        setFormData({
            ...service,
            benefits: service.benefits || [],
            included: service.included || [],
            // Fallback for old data structure
            cardDescription: service.cardDescription || service.description || '',
            fullDescription: service.fullDescription || service.description || '',
            detailPageHeading: service.detailPageHeading || '',
        });
        setTimeout(() => {
            formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this service?")) {
            try {
                await remove(ref(database, `services/${id}`));
                showToast("Service deleted", 'success');
            } catch (error) {
                console.error("Error deleting service:", error);
                showToast("Failed to delete service", 'error');
            }
        }
    };

    const handleArrayInput = (field, value, index = null, action = 'add') => {
        const currentArray = [...(formData[field] || [])];
        if (action === 'add') {
            currentArray.push('');
        } else if (action === 'update') {
            currentArray[index] = value;
        } else if (action === 'remove') {
            currentArray.splice(index, 1);
        }
        setFormData({ ...formData, [field]: currentArray });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Filter out empty benefits/included before saving
        const cleanFormData = {
            ...formData,
            benefits: formData.benefits.filter(b => b.trim() !== ''),
            included: formData.included.filter(i => i.trim() !== '')
        };

        if (!cleanFormData.name || !cleanFormData.price || !cleanFormData.duration) {
            showToast("Please fill in required fields", 'error');
            return;
        }

        try {
            const serviceData = {
                ...cleanFormData,
                updatedAt: new Date().toISOString()
            };

            if (editingId) {
                await update(ref(database, `services/${editingId}`), serviceData);
                showToast("Service updated successfully", 'success');
                resetForm();
            } else {
                await push(ref(database, 'services'), {
                    ...serviceData,
                    createdAt: new Date().toISOString()
                });
                showToast("New service created", 'success');
                resetForm();
            }
        } catch (error) {
            console.error("Error saving service:", error);
            showToast("Failed to save service", 'error');
        }
    };

    const handleSeedData = async () => {
        try {
            for (const service of massageServicesData) {
                await push(ref(database, 'services'), {
                    ...service,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                });
            }
            showToast("Massage services seeded successfully!", "success");
        } catch (error) {
            console.error("Error seeding services:", error);
            showToast("Failed to seed massage services", "error");
        }
    };

    return (
        <div className="space-y-8 animate-fade-in-down pb-20">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <div>
                    <TitleComponent type="h2" className="!text-3xl font-bold text-black2">Service Management</TitleComponent>
                    <p className="text-textColor mt-2 font-medium">Add, edit, and organize your spa treatments with premium presentation.</p>
                </div>
                {!editingId && (
                    <ThemeButton variant="primary" onClick={() => formRef.current?.scrollIntoView({ behavior: 'smooth' })} className="flex items-center gap-2 !px-6">
                        <Plus size={20} weight="bold" /> Add Service
                    </ThemeButton>
                )}
            </div>

            {/* Input Form Section */}
            <div ref={formRef} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
                <div className="mb-8 border-b border-gray-100 pb-4">
                    <TitleComponent type="h4" className="flex items-center gap-2 text-primary">
                        {editingId ? <PencilSimple size={24} /> : <Plus size={24} />}
                        {editingId ? 'Edit Service' : 'Add New Service'}
                    </TitleComponent>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
                    {/* Left Col - Basic Info */}
                    <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-semibold text-gray-700 tracking-wide">SERVICE TITLE *</label>
                            <input
                                type="text"
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                placeholder="e.g. Deep Tissue Massage"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 tracking-wide">CATEGORY *</label>
                            <select
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:border-primary outline-none"
                                value={formData.category}
                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                            >
                                <option>Massage</option>
                                <option>Facial</option>
                                <option>Hydrotherapy</option>
                                <option>Beauty</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 tracking-wide">STATUS</label>
                            <select
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:border-primary outline-none"
                                value={formData.status}
                                onChange={e => setFormData({ ...formData, status: e.target.value })}
                            >
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 tracking-wide">PRICE ($) *</label>
                            <input
                                type="number"
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:border-primary outline-none"
                                value={formData.price}
                                onChange={e => setFormData({ ...formData, price: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 tracking-wide">DURATION *</label>
                            <input
                                type="text"
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:border-primary outline-none"
                                placeholder="e.g. 60 min"
                                value={formData.duration}
                                onChange={e => setFormData({ ...formData, duration: e.target.value })}
                            />
                        </div>

                        {/* NEW: Detail Page Heading */}
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-semibold text-gray-700 tracking-wide">DETAIL PAGE HEADING</label>
                            <input
                                type="text"
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:border-primary outline-none transition-all"
                                placeholder="e.g. Experience Deep Relaxation and Rejuvenation"
                                value={formData.detailPageHeading}
                                onChange={e => setFormData({ ...formData, detailPageHeading: e.target.value })}
                            />
                        </div>

                        {/* NEW: Card Description */}
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-semibold text-gray-700 tracking-wide">CARD DESCRIPTION (SHORT)</label>
                            <textarea
                                rows="2"
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:border-primary outline-none resize-none"
                                placeholder="Brief description for the service card..."
                                value={formData.cardDescription}
                                onChange={e => setFormData({ ...formData, cardDescription: e.target.value })}
                            ></textarea>
                        </div>

                        {/* NEW: Full Description */}
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-semibold text-gray-700 tracking-wide">FULL SERVICE DETAILS (DETAIL PAGE)</label>
                            <textarea
                                rows="4"
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:border-primary outline-none resize-none"
                                placeholder="Comprehensive description for the detail page..."
                                value={formData.fullDescription}
                                onChange={e => setFormData({ ...formData, fullDescription: e.target.value })}
                            ></textarea>
                        </div>

                        {/* Benefits Section */}
                        <div className="md:col-span-1 space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-semibold text-gray-700 tracking-wide">KEY BENEFITS</label>
                                <button type="button" onClick={() => handleArrayInput('benefits', '', null, 'add')} className="text-xs text-primary font-bold hover:underline">+ Add Benefit</button>
                            </div>
                            <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                                {(formData.benefits || []).map((benefit, index) => (
                                    <div key={index} className="flex gap-2">
                                        <input
                                            type="text"
                                            className="w-full p-2 bg-gray-50 border border-gray-200 rounded text-sm focus:bg-white focus:border-primary outline-none"
                                            placeholder="e.g. Relieves stress"
                                            value={benefit}
                                            onChange={e => handleArrayInput('benefits', e.target.value, index, 'update')}
                                        />
                                        <button type="button" onClick={() => handleArrayInput('benefits', null, index, 'remove')} className="text-red-500 hover:text-red-700">
                                            <Trash size={16} />
                                        </button>
                                    </div>
                                ))}
                                {(!formData.benefits || formData.benefits.length === 0) && (
                                    <p className="text-xs text-gray-400 italic">No benefits added yet.</p>
                                )}
                            </div>
                        </div>

                        {/* Included Section */}
                        <div className="md:col-span-1 space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-semibold text-gray-700 tracking-wide">WHAT'S INCLUDED</label>
                                <button type="button" onClick={() => handleArrayInput('included', '', null, 'add')} className="text-xs text-primary font-bold hover:underline">+ Add Item</button>
                            </div>
                            <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                                {(formData.included || []).map((item, index) => (
                                    <div key={index} className="flex gap-2">
                                        <input
                                            type="text"
                                            className="w-full p-2 bg-gray-50 border border-gray-200 rounded text-sm focus:bg-white focus:border-primary outline-none"
                                            placeholder="e.g. Hot towel"
                                            value={item}
                                            onChange={e => handleArrayInput('included', e.target.value, index, 'update')}
                                        />
                                        <button type="button" onClick={() => handleArrayInput('included', null, index, 'remove')} className="text-red-500 hover:text-red-700">
                                            <Trash size={16} />
                                        </button>
                                    </div>
                                ))}
                                {(!formData.included || formData.included.length === 0) && (
                                    <p className="text-xs text-gray-400 italic">No items added yet.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Col - Image & Featured */}
                    <div className="lg:col-span-4 space-y-5">
                        {/* Image Upload */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 tracking-wide">IMAGE UPLOAD</label>
                            <div className="flex items-center gap-3">
                                <label className="flex-1 cursor-pointer">
                                    <div className="w-full p-2.5 bg-gray-50 border border-gray-200 border-dashed rounded-lg text-sm text-gray-500 hover:bg-gray-100 hover:border-primary transition-colors flex items-center justify-center gap-2">
                                        <ImageIcon size={18} />
                                        <span>{formData.image ? 'Change Image' : 'Choose File'}</span>
                                    </div>
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                const reader = new FileReader();
                                                reader.onloadend = () => {
                                                    setFormData({ ...formData, image: reader.result });
                                                };
                                                reader.readAsDataURL(file);
                                            }
                                        }}
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
                                placeholder="Descriptive text for image..."
                                value={formData.altText}
                                onChange={e => setFormData({ ...formData, altText: e.target.value })}
                            />
                        </div>

                        {/* Image Preview */}
                        <div className="aspect-video w-full rounded-lg bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center relative shadow-inner">
                            {formData.image ? (
                                <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <div className="text-gray-400 flex flex-col items-center">
                                    <ImageIcon size={32} weight="light" />
                                    <span className="text-xs mt-1">Image Preview</span>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-100">
                            <input
                                type="checkbox"
                                id="featured-check"
                                checked={formData.featured}
                                onChange={e => setFormData({ ...formData, featured: e.target.checked })}
                                className="w-4 h-4 text-primary rounded focus:ring-primary cursor-pointer"
                            />
                            <label htmlFor="featured-check" className="text-sm text-gray-700 cursor-pointer select-none font-medium">Mark as Featured Service</label>
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
                            {editingId ? 'Update Service' : 'Add Service'}
                        </ThemeButton>
                    </div>
                </form>
            </div>

            {/* Grid List Section */}
            <div className="space-y-8">
                <div className="flex items-center gap-4 px-1">
                    <div className="h-0.5 flex-1 bg-gray-100"></div>
                    <TitleComponent type="h3" className="text-black2 !text-2xl font-bold px-4">
                        All Services
                        <span className="ml-2 text-sm font-normal text-textColor font-sans tracking-normal bg-gray-100 px-3 py-1 rounded-full">{services.length} Total</span>
                    </TitleComponent>
                    <div className="h-0.5 flex-1 bg-gray-100"></div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                        {services.map((service) => (
                            <div key={service.id} className="group flex flex-col bg-black rounded-[2rem] overflow-hidden hover:shadow-2xl transition-all duration-500 border border-gray-100 relative h-[450px]">
                                {/* Full Background Image */}
                                <div className="absolute inset-0">
                                    {service.image ? (
                                        <img
                                            src={service.image}
                                            alt={service.altText || service.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out opacity-80"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-800 text-white/20">
                                            <ImageIcon size={64} weight="duotone" />
                                        </div>
                                    )}
                                    {/* Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                                </div>

                                {/* Top Actions Overlay */}
                                <div className="absolute top-5 left-5 right-5 flex justify-between items-start z-10">
                                    <div className="flex flex-col gap-2 items-start">
                                        <span className={clsx(
                                            "px-4 py-1.5 backdrop-blur-md font-bold text-[10px] uppercase tracking-widest rounded-full shadow-sm border",
                                            service.status === 'Active' ? "bg-emerald-500/90 text-white border-white/20" : "bg-gray-800/90 text-white border-white/20"
                                        )}>
                                            {service.status}
                                        </span>
                                        {service.featured && (
                                            <span className="px-4 py-1.5 bg-amber-500/90 backdrop-blur-md text-white font-bold text-[10px] uppercase tracking-widest rounded-full shadow-sm border border-white/20 flex items-center gap-1">
                                                <Star size={12} weight="fill" /> Featured
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEdit(service)}
                                            className="w-10 h-10 bg-white/20 backdrop-blur-md text-white rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300 border border-white/30"
                                            title="Edit Service"
                                        >
                                            <PencilSimple size={20} weight="bold" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(service.id)}
                                            className="w-10 h-10 bg-white/20 backdrop-blur-md text-red-100 rounded-full flex items-center justify-center hover:bg-red-600 hover:text-white transition-all duration-300 border border-white/30"
                                            title="Delete Service"
                                        >
                                            <Trash size={20} weight="bold" />
                                        </button>
                                    </div>
                                </div>

                                {/* Bottom Content Overlay */}
                                <div className="absolute bottom-0 left-0 right-0 p-8 z-10 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                                    <div className="flex items-center gap-3 mb-3 text-white/80">
                                        <span className="text-xs font-bold uppercase tracking-widest bg-white/10 px-2 py-0.5 rounded border border-white/10">{service.category}</span>
                                        <span className="text-xs flex items-center gap-1"><Clock size={12} weight="fill" /> {service.duration}</span>
                                    </div>

                                    <h3 className="text-2xl font-Merriwheather font-bold text-white mb-2 leading-tight">
                                        {service.name}
                                    </h3>

                                    <div className="flex items-baseline gap-1 text-primaryLight mb-4">
                                        <span className="text-lg font-Merriwheather">$</span>
                                        <span className="text-3xl font-bold font-Merriwheather">{service.price}</span>
                                    </div>

                                    <p className="text-gray-300 text-sm leading-relaxed line-clamp-2 max-h-0 opacity-0 group-hover:max-h-20 group-hover:opacity-100 transition-all duration-500 overflow-hidden">
                                        {service.cardDescription || service.description || "Indulge in this premium relaxation treatment."}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!loading && services.length === 0 && (
                    <div className="col-span-full py-32 text-center bg-white rounded-[2rem] border border-dashed border-gray-200 shadow-sm">
                        <div className="w-24 h-24 bg-primaryLight rounded-full flex items-center justify-center mx-auto mb-6">
                            <Plus size={48} className="text-primary" weight="duotone" />
                        </div>
                        <TitleComponent type="h3" className="!text-2xl font-bold text-black2 mb-2">No Services Yet</TitleComponent>
                        <p className="text-textColor max-w-sm mx-auto">Create your first professional spa treatment above or use the import data feature to get started.</p>
                        <ThemeButton variant="primary" onClick={() => formRef.current?.scrollIntoView({ behavior: 'smooth' })} className="mt-8 !px-8">
                            Add Your First Service
                        </ThemeButton>
                        <button
                            onClick={handleSeedData}
                            className="mt-4 block mx-auto text-sm text-gray-500 hover:text-primary underline"
                        >
                            Load Default Services Data
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ServiceManager;
