import { useState, useRef, useEffect } from 'react';
import { database } from '../../firebase';
import { ref, onValue, push, set, remove, update } from 'firebase/database';
import { useAuth } from '../../context/auth-context';
import {
    Plus, Trash, PencilSimple, Image as ImageIcon,
    TextHOne, TextH, TextT, ListBullets,
    ListDashes, X, FileText, Check,
    CalendarCheck, User, ArrowRight
} from 'phosphor-react';
import clsx from 'clsx';
import ThemeButton from '../../components/themeButton/themeButton';
import TitleComponent from '../../components/titleComponent/titleComponent';
import { useToast } from '../../context/toast-context';

const ContentManager = () => {
    const { showToast } = useToast();
    const { currentUser } = useAuth();
    const [blogs, setBlogs] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const formRef = useRef(null);

    // Categories Constant
    const CATEGORIES = [
        'Wellness', 'Spa', 'Beauty', 'Relaxation',
        'Self-Care', 'Spa Treatments', 'Beauty Tips', 'Health'
    ];

    // Initial State for Form
    const initialFormState = {
        title: '',
        description: '',
        category: 'Wellness',
        image: '',
        altText: '',
        contentBlocks: []
    };

    const [formData, setFormData] = useState(initialFormState);

    // Block Types Configuration
    const blockTypes = [
        { type: 'h1', icon: TextHOne, label: 'H1 Heading' },
        { type: 'h2', icon: TextH, label: 'H2 (Subheading)' },
        { type: 'h3', icon: TextH, label: 'H3 (Small Heading)' },
        { type: 'p', icon: TextT, label: 'Paragraph' },
        { type: 'list', icon: ListBullets, label: 'Bullet List' },
        { type: 'descList', icon: ListDashes, label: 'Description List' },
        { type: 'image', icon: ImageIcon, label: 'Content Image' },
    ];

    // Fetch Blogs from Firebase
    useEffect(() => {
        const blogsRef = ref(database, 'blogs');
        const unsubscribe = onValue(blogsRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const blogsArray = Object.keys(data).map(key => ({
                    id: key,
                    ...data[key],
                    // Ensure contentBlocks is always an array
                    contentBlocks: data[key].contentBlocks || []
                })).reverse(); // Newest first
                setBlogs(blogsArray);
            } else {
                setBlogs([]);
            }
        });
        return () => unsubscribe();
    }, []);

    // Helper: Scroll to top
    const scrollToForm = () => {
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    // Helper: Image Upload
    const handleImageUpload = (e, field, blockId = null) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                showToast("Image too large. Max 2MB.", "error");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result;
                if (blockId) {
                    // Update content block image
                    setFormData(prev => ({
                        ...prev,
                        contentBlocks: prev.contentBlocks.map(b =>
                            b.id === blockId ? { ...b, value: result } : b
                        )
                    }));
                } else {
                    // Update main image
                    setFormData(prev => ({ ...prev, [field]: result }));
                }
            };
            reader.readAsDataURL(file);
        }
    };

    // Action: Add Block
    const addBlock = (type) => {
        let initialValue = '';
        if (type === 'list') initialValue = [''];
        if (type === 'descList') initialValue = [{ term: '', details: '' }];

        const newBlock = {
            id: Date.now(),
            type,
            value: initialValue,
            alt: '' // for images
        };
        setFormData(prev => ({
            ...prev,
            contentBlocks: [...prev.contentBlocks, newBlock]
        }));
    };

    // Action: Remove Block
    const removeBlock = (id) => {
        setFormData(prev => ({
            ...prev,
            contentBlocks: prev.contentBlocks.filter(b => b.id !== id)
        }));
    };

    // Action: Update Block Content
    const updateBlock = (id, value, field = 'value') => {
        setFormData(prev => ({
            ...prev,
            contentBlocks: prev.contentBlocks.map(b =>
                b.id === id ? { ...b, [field]: value } : b
            )
        }));
    };

    // --- List Managers ---
    const updateListItem = (blockId, itemIndex, newValue) => {
        setFormData(prev => {
            const block = prev.contentBlocks.find(b => b.id === blockId);
            const newItems = [...block.value];
            newItems[itemIndex] = newValue;
            return {
                ...prev,
                contentBlocks: prev.contentBlocks.map(b => b.id === blockId ? { ...b, value: newItems } : b)
            };
        });
    };

    const addListItem = (blockId) => {
        setFormData(prev => {
            const block = prev.contentBlocks.find(b => b.id === blockId);
            return {
                ...prev,
                contentBlocks: prev.contentBlocks.map(b => b.id === blockId ? { ...b, value: [...block.value, ''] } : b)
            };
        });
    };

    const removeListItem = (blockId, itemIndex) => {
        setFormData(prev => {
            const block = prev.contentBlocks.find(b => b.id === blockId);
            // Prevent removing the last item if you want at least one
            if (block.value.length <= 1) return prev;
            const newItems = block.value.filter((_, i) => i !== itemIndex);
            return {
                ...prev,
                contentBlocks: prev.contentBlocks.map(b => b.id === blockId ? { ...b, value: newItems } : b)
            };
        });
    };

    // --- Description List Managers ---
    const updateDescItem = (blockId, itemIndex, key, newValue) => {
        setFormData(prev => {
            const block = prev.contentBlocks.find(b => b.id === blockId);
            const newItems = [...block.value];
            newItems[itemIndex] = { ...newItems[itemIndex], [key]: newValue };
            return {
                ...prev,
                contentBlocks: prev.contentBlocks.map(b => b.id === blockId ? { ...b, value: newItems } : b)
            };
        });
    };

    const addDescItem = (blockId) => {
        setFormData(prev => {
            const block = prev.contentBlocks.find(b => b.id === blockId);
            return {
                ...prev,
                contentBlocks: prev.contentBlocks.map(b => b.id === blockId ? { ...b, value: [...block.value, { term: '', details: '' }] } : b)
            };
        });
    };

    const removeDescItem = (blockId, itemIndex) => {
        setFormData(prev => {
            const block = prev.contentBlocks.find(b => b.id === blockId);
            if (block.value.length <= 1) return prev;
            const newItems = block.value.filter((_, i) => i !== itemIndex);
            return {
                ...prev,
                contentBlocks: prev.contentBlocks.map(b => b.id === blockId ? { ...b, value: newItems } : b)
            };
        });
    };


    // Action: Save Blog
    const handleSave = async () => {
        if (!formData.title || !formData.description) {
            showToast("Title and Description are required", "error");
            return;
        }

        try {
            const blogData = {
                title: formData.title,
                description: formData.description,
                category: formData.category || 'Wellness',
                image: formData.image,
                altText: formData.altText,
                contentBlocks: formData.contentBlocks,
                date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
                updatedAt: new Date().toISOString(),
                author: currentUser?.displayName || currentUser?.name || 'Admin',
                status: 'Published' // Default for now
            };

            if (isEditing && formData.id) {
                // UPDATE
                await update(ref(database, `blogs/${formData.id}`), blogData);
                showToast("Blog post updated successfully", "success");
            } else {
                // CREATE
                await push(ref(database, 'blogs'), {
                    ...blogData,
                    createdAt: new Date().toISOString(),
                    views: 0
                });
                showToast("New blog post created", "success");
            }

            // Reset
            setFormData(initialFormState);
            setIsEditing(false);
        } catch (error) {
            console.error("Error saving blog:", error);
            showToast("Failed to save blog post", "error");
        }
    };

    // Action: Edit Blog
    const handleEdit = (blog) => {
        setFormData({
            ...blog,
            contentBlocks: blog.contentBlocks || []
        });
        setIsEditing(true);
        scrollToForm();
    };

    // Action: Delete Blog
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this blog post?")) {
            try {
                await remove(ref(database, `blogs/${id}`));
                showToast("Blog post deleted", "success");
            } catch (error) {
                console.error("Error deleting blog:", error);
                showToast("Failed to delete blog", "error");
            }
        }
    };

    return (
        <div className="space-y-12 animate-fade-in-down pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <div>
                    <TitleComponent type="h2" className="!text-3xl font-bold text-black2">Manage Blogs</TitleComponent>
                    <p className="text-textColor mt-2 font-medium">Create and manage your professional articles and wellness guides.</p>
                </div>
                {!isEditing && (
                    <ThemeButton variant="primary" onClick={() => scrollToForm()} className="flex items-center gap-2 !px-6">
                        <Plus size={20} weight="bold" /> Create New Post
                    </ThemeButton>
                )}
            </div>

            {/* Dynamic Blog Editor Form */}
            <div ref={formRef} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:p-8">
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        {isEditing ? <PencilSimple size={20} className="text-primary" /> : <Plus size={20} className="text-primary" />}
                        {isEditing ? 'Edit Blog Post' : 'Create New Post'}
                    </h3>
                    {isEditing && (
                        <button
                            onClick={() => { setIsEditing(false); setFormData(initialFormState); }}
                            className="text-gray-500 hover:text-red-500 text-sm font-medium"
                        >
                            Cancel Editing
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Sidebar: Main Image */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Featured Image</label>

                            <label className="block w-full aspect-video rounded-xl border-2 border-dashed border-gray-300 hover:border-primary hover:bg-primaryLight/10 transition-colors cursor-pointer overflow-hidden relative group">
                                {formData.image ? (
                                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                                        <ImageIcon size={32} className="mb-2" />
                                        <span className="text-xs font-semibold">Click to upload image</span>
                                    </div>
                                )}
                                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'image')} />

                                {formData.image && (
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="text-white text-sm font-bold">Change Image</span>
                                    </div>
                                )}
                            </label>

                            {formData.image && (
                                <button
                                    onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                                    className="text-xs text-red-500 hover:underline flex items-center gap-1"
                                >
                                    <Trash size={12} /> Remove Image
                                </button>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase">Image Alt Text</label>
                            <input
                                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary"
                                placeholder="Describe the image..."
                                value={formData.altText}
                                onChange={e => setFormData({ ...formData, altText: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Right Content Area */}
                    <div className="lg:col-span-8 space-y-6">
                        {/* Title, Category & Description */}
                        <div className="space-y-4">
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1">
                                    <input
                                        className="w-full p-0 text-3xl font-Merriwheather font-bold text-gray-900 placeholder-gray-300 border-none focus:ring-0"
                                        placeholder="Enter Blog Title..."
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    />
                                </div>
                                <div className="md:w-48">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Category</label>
                                    <select
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm font-semibold text-gray-700 focus:outline-none focus:border-primary cursor-pointer hover:bg-white transition-colors"
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        {CATEGORIES.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <textarea
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary resize-none h-24 font-sans leading-relaxed"
                                    placeholder="Write a short description or summary..."
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                        </div>

                        <hr className="border-gray-100" />

                        {/* Blocks Builder */}
                        <div className="space-y-4">
                            <label className="text-sm font-bold text-gray-700 uppercase tracking-wider block">Content Builder</label>

                            {/* Toolbar */}
                            <div className="flex flex-wrap gap-2 p-3 bg-gray-100 rounded-lg">
                                {blockTypes.map(b => (
                                    <button
                                        key={b.type}
                                        onClick={() => addBlock(b.type)}
                                        className="flex items-center gap-2 px-3 py-1.5 bg-white text-gray-700 text-xs font-bold rounded shadow-sm hover:text-primary hover:shadow-md transition-all border border-gray-200"
                                        title={`Add ${b.label}`}
                                    >
                                        <b.icon size={16} weight="bold" /> {b.label}
                                    </button>
                                ))}
                            </div>

                            {/* Blocks List */}
                            <div className="space-y-3 min-h-[100px]">
                                {formData.contentBlocks.length === 0 && (
                                    <div className="text-center py-8 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                                        <p className="text-sm">Click the buttons above to add content blocks</p>
                                    </div>
                                )}

                                {formData.contentBlocks.map((block, index) => (
                                    <div key={block.id} className="group relative p-4 bg-white border border-gray-200 rounded-xl hover:border-primary/30 transition-shadow shadow-sm">
                                        <div className="absolute -left-3 top-4 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                            <button onClick={() => removeBlock(block.id)} className="p-1.5 bg-red-100 text-red-500 rounded-full hover:bg-red-200 shadow-sm" title="Remove Block">
                                                <X size={12} weight="bold" />
                                            </button>
                                        </div>
                                        <div className="absolute top-2 right-2 opacity-50 text-xs font-mono uppercase bg-gray-100 px-2 rounded text-gray-500">{block.type}</div>

                                        {/* Block Inputs based on Type */}
                                        {block.type.startsWith('h') && (
                                            <input
                                                className={clsx(
                                                    "w-full border-none p-0 focus:ring-0 font-Merriwheather placeholder-gray-300",
                                                    block.type === 'h1' ? "text-2xl font-bold" :
                                                        block.type === 'h2' ? "text-xl font-bold" : "text-lg font-bold"
                                                )}
                                                placeholder={`Heading ${block.type.toUpperCase()}`}
                                                value={block.value}
                                                onChange={e => updateBlock(block.id, e.target.value)}
                                            />
                                        )}

                                        {block.type === 'p' && (
                                            <textarea
                                                className="w-full border-none p-0 focus:ring-0 text-base text-gray-600 leading-relaxed resize-none h-auto overflow-hidden bg-transparent placeholder-gray-300"
                                                placeholder="Type your paragraph here..."
                                                value={block.value}
                                                onChange={e => updateBlock(block.id, e.target.value)}
                                                rows={3}
                                            />
                                        )}

                                        {block.type === 'list' && (
                                            <div className="space-y-2">
                                                {Array.isArray(block.value) && block.value.map((item, i) => (
                                                    <div key={i} className="flex items-center gap-2">
                                                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full flex-shrink-0 mt-2 self-start"></div>
                                                        <textarea
                                                            rows={1}
                                                            className="flex-1 bg-gray-50 p-2 rounded-lg text-sm border-none focus:ring-1 focus:ring-primary resize-none"
                                                            placeholder="List item..."
                                                            value={item}
                                                            onChange={(e) => updateListItem(block.id, i, e.target.value)}
                                                        />
                                                        <button onClick={() => removeListItem(block.id, i)} className="text-gray-300 hover:text-red-500"><X size={16} /></button>
                                                    </div>
                                                ))}
                                                <button onClick={() => addListItem(block.id)} className="text-xs text-primary font-bold flex items-center gap-1 hover:underline mt-2">
                                                    <Plus size={14} /> Add Item
                                                </button>
                                            </div>
                                        )}

                                        {block.type === 'descList' && (
                                            <div className="space-y-3">
                                                {Array.isArray(block.value) && block.value.map((item, i) => (
                                                    <div key={i} className="flex flex-col md:flex-row gap-2 items-start bg-gray-50 p-3 rounded-lg relative group/item">
                                                        <input
                                                            className="w-full md:w-1/3 bg-white p-2 border border-gray-200 rounded text-sm font-bold"
                                                            placeholder="Term (e.g. Duration)"
                                                            value={item.term}
                                                            onChange={(e) => updateDescItem(block.id, i, 'term', e.target.value)}
                                                        />
                                                        <textarea
                                                            rows={1}
                                                            className="flex-1 w-full bg-white p-2 border border-gray-200 rounded text-sm resize-none"
                                                            placeholder="Detail description..."
                                                            value={item.details}
                                                            onChange={(e) => updateDescItem(block.id, i, 'details', e.target.value)}
                                                        />
                                                        <button onClick={() => removeDescItem(block.id, i)} className="absolute top-1 right-1 md:static md:mt-2 text-gray-300 hover:text-red-500"><X size={16} /></button>
                                                    </div>
                                                ))}
                                                <button onClick={() => addDescItem(block.id)} className="text-xs text-primary font-bold flex items-center gap-1 hover:underline">
                                                    <Plus size={14} /> Add Term/Detail Pair
                                                </button>
                                            </div>
                                        )}

                                        {block.type === 'image' && (
                                            <div className="flex gap-4 items-start">
                                                <div className="w-24 h-24 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden border">
                                                    {block.value ? (
                                                        <img src={block.value} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                            <ImageIcon size={20} />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 space-y-2">
                                                    <input
                                                        type="file"
                                                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primaryLight file:text-primary hover:file:bg-primaryLight/80"
                                                        accept="image/*"
                                                        onChange={(e) => handleImageUpload(e, null, block.id)}
                                                    />
                                                    <input
                                                        className="w-full p-2 text-sm border border-gray-200 rounded"
                                                        placeholder="Image caption / alt text..."
                                                        value={block.alt}
                                                        onChange={e => updateBlock(block.id, e.target.value, 'alt')}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-end pt-4 border-t border-gray-100">
                            <ThemeButton variant="primary" onClick={handleSave} className="!px-8">
                                {isEditing ? 'Update Post' : 'Publish Post'}
                            </ThemeButton>
                        </div>
                    </div>
                </div>
            </div>

            {/* Existing Blogs Grid */}
            <div className="space-y-8">
                <div className="flex items-center gap-4">
                    <div className="h-0.5 flex-1 bg-gray-100"></div>
                    <TitleComponent type="h3" className="text-black2 !text-2xl font-bold px-4">Published Posts</TitleComponent>
                    <div className="h-0.5 flex-1 bg-gray-100"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {blogs.length > 0 ? blogs.map(blog => (
                        <div key={blog.id} className="group flex flex-col bg-white rounded-[2rem] overflow-hidden hover:shadow-2xl transition-all duration-500 border border-gray-100 relative h-full">

                            {/* Image Part */}
                            <div className="h-64 relative overflow-hidden">
                                {blog.image ? (
                                    <img src={blog.image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-primaryLight text-primary/30">
                                        <FileText size={48} weight="duotone" />
                                    </div>
                                )}

                                {/* Badges */}
                                <div className="absolute top-5 left-5 right-5 flex justify-between items-start">
                                    <span className="px-4 py-1.5 bg-white/90 backdrop-blur-md text-primary font-bold text-[10px] uppercase tracking-widest rounded-full shadow-sm border border-primary/10">
                                        {blog.category || 'Uncategorized'}
                                    </span>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEdit(blog)}
                                            className="w-10 h-10 bg-white/90 backdrop-blur-md text-primary rounded-full flex items-center justify-center shadow-lg hover:bg-primary hover:text-white transition-all duration-300"
                                            title="Edit Post"
                                        >
                                            <PencilSimple size={20} weight="bold" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(blog.id)}
                                            className="w-10 h-10 bg-white/90 backdrop-blur-md text-red-500 rounded-full flex items-center justify-center shadow-lg hover:bg-red-500 hover:text-white transition-all duration-300"
                                            title="Delete Post"
                                        >
                                            <Trash size={20} weight="bold" />
                                        </button>
                                    </div>
                                </div>

                                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/60 to-transparent"></div>
                                <div className="absolute bottom-4 left-6 flex items-center gap-3 text-white">
                                    <CalendarCheck size={18} weight="bold" className="text-primary" />
                                    <span className="text-xs font-bold tracking-wider">{blog.date}</span>
                                </div>
                            </div>

                            {/* Content Part */}
                            <div className="p-8 flex flex-col flex-1">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-8 h-8 rounded-full bg-primaryLight flex items-center justify-center text-primary">
                                        <User size={16} weight="bold" />
                                    </div>
                                    <span className="text-xs font-bold text-textColor uppercase tracking-wider">By {blog.author}</span>
                                </div>

                                <TitleComponent type="h4" className="!leading-tight mb-4 group-hover:text-primary transition-colors line-clamp-2 min-h-[3rem]">
                                    {blog.title}
                                </TitleComponent>

                                <p className="text-textColor text-sm leading-relaxed line-clamp-3 mb-8 flex-1">
                                    {blog.description}
                                </p>

                                <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{blog.status}</span>
                                    </div>

                                    <button
                                        onClick={() => handleEdit(blog)}
                                        className="text-xs font-bold text-primary flex items-center gap-2 hover:translate-x-1 transition-transform"
                                    >
                                        Manage Content <ArrowRight size={14} weight="bold" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="col-span-full py-32 text-center bg-white rounded-[2rem] border border-dashed border-gray-200 shadow-sm">
                            <div className="w-24 h-24 bg-primaryLight rounded-full flex items-center justify-center mx-auto mb-6">
                                <FileText size={48} className="text-primary" weight="duotone" />
                            </div>
                            <TitleComponent type="h3" className="!text-2xl font-bold text-black2 mb-2">No Blog Posts Yet</TitleComponent>
                            <p className="text-textColor max-w-sm mx-auto">Get started by creating your first professional wellness article above. Your audience is waiting!</p>
                            <ThemeButton variant="primary" onClick={() => scrollToForm()} className="mt-8 !px-8">
                                Create Your First Post
                            </ThemeButton>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ContentManager;
