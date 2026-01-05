import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { database } from '../firebase';
import { ref, onValue, push, remove, update } from 'firebase/database';
import { useAuth } from '../context/auth-context';
import {
    User,
    CalendarCheck,
    ArrowLeft,
    ArrowRight,
    Share,
    FacebookLogo,
    TwitterLogo,
    InstagramLogo,
    ChatCircleDots,
    PencilSimple,
    Trash,
    X,
    Check,
    Tag
} from 'phosphor-react';
import HeroSec2 from '../components/heroSec/heroSec2';
import TitleComponent from '../components/titleComponent/titleComponent';
import ThemeButton from '../components/themeButton/themeButton';
import SidebarBlogCard from '../components/blogSec/SidebarBlogCard';

const BlogDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    const [blog, setBlog] = useState(null);
    const [allBlogs, setAllBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [comments, setComments] = useState([]);
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editCommentText, setEditCommentText] = useState('');

    const [formData, setFormData] = useState({
        comment: ''
    });
    const [formErrors, setFormErrors] = useState({});
    const [showSuccess, setShowSuccess] = useState(false);
    const [commentToDelete, setCommentToDelete] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    // Fetch single blog and all blogs for related/navigation
    useEffect(() => {
        setLoading(true);
        const blogsRef = ref(database, 'blogs');

        const unsubscribe = onValue(blogsRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const blogsArray = Object.keys(data).map(key => ({
                    id: key,
                    ...data[key]
                }));

                setAllBlogs(blogsArray);

                // Find the current blog
                const currentBlog = blogsArray.find(b => b.id === id);
                if (currentBlog) {
                    setBlog(currentBlog);

                    // Fetch comments (stored as an object in Firebase)
                    if (currentBlog.comments) {
                        const commentsArray = Object.keys(currentBlog.comments).map(key => ({
                            id: key,
                            ...currentBlog.comments[key]
                        })).sort((a, b) => b.timestamp - a.timestamp); // Sort by timestamp, newest first
                        setComments(commentsArray);
                    } else {
                        setComments([]);
                    }
                } else {
                    setBlog(null);
                }
            } else {
                setAllBlogs([]);
                setBlog(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [id]);

    // Navigation and Related Blogs Logic
    const blogIndex = allBlogs.findIndex(b => b.id === id);
    const relatedBlogs = [];
    let prevBlogId = null;
    let nextBlogId = null;

    if (blogIndex !== -1 && allBlogs.length > 0) {
        // Related blogs (next 3)
        for (let i = 1; i <= 3; i++) {
            if (allBlogs.length > 1) {
                const rIndex = (blogIndex + i) % allBlogs.length;
                if (rIndex !== blogIndex) {
                    relatedBlogs.push(allBlogs[rIndex]);
                }
            }
        }

        // Prev/Next IDs
        const pIndex = blogIndex > 0 ? blogIndex - 1 : allBlogs.length - 1;
        const nIndex = blogIndex < allBlogs.length - 1 ? blogIndex + 1 : 0;

        if (allBlogs.length > 1) {
            prevBlogId = allBlogs[pIndex].id;
            nextBlogId = allBlogs[nIndex].id;
        }
    }

    // Form handling functions
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (formErrors[name]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.comment.trim()) {
            errors.comment = 'Comment is required';
        }
        return errors;
    };

    const handleSubmitComment = async (e) => {
        e.preventDefault();
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        const newComment = {
            userId: currentUser.uid,
            name: currentUser.displayName || currentUser.name,
            photoURL: currentUser.photoURL || '',
            comment: formData.comment,
            timestamp: Date.now(),
            date: new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        };

        try {
            await push(ref(database, `blogs/${id}/comments`), newComment);
            setFormData({ comment: '' });
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);

            document.getElementById('comments-section')?.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        } catch (error) {
            console.error("Error posting comment:", error);
            alert("Failed to post comment. Please try again.");
        }
    };

    const handleDeleteComment = async () => {
        if (!commentToDelete) return;

        setActionLoading(true);
        try {
            await remove(ref(database, `blogs/${id}/comments/${commentToDelete}`));
            setCommentToDelete(null);
        } catch (error) {
            console.error("Error deleting comment:", error);
            alert("Failed to delete comment.");
        } finally {
            setActionLoading(false);
        }
    };

    const handleStartEdit = (comment) => {
        setEditingCommentId(comment.id);
        setEditCommentText(comment.comment);
    };

    const handleUpdateComment = async (commentId) => {
        if (!editCommentText.trim()) return;

        setActionLoading(true);
        try {
            await update(ref(database, `blogs/${id}/comments/${commentId}`), {
                comment: editCommentText,
                edited: true,
                updatedAt: Date.now()
            });
            setEditingCommentId(null);
            setEditCommentText('');
        } catch (error) {
            console.error("Error updating comment:", error);
            alert("Failed to update comment.");
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!blog) {
        return (
            <>
                <HeroSec2
                    heading="Blog Not Found"
                    desc="The blog post you're looking for doesn't exist"
                    Link="/blog"
                    pageText="Blog"
                />
                <section className="py-20">
                    <div className="container text-center">
                        <TitleComponent type="h3" className="mb-6">Blog post not found</TitleComponent>
                        <ThemeButton variant="primary" onClick={() => navigate('/blog')}>
                            Back to Blog
                        </ThemeButton>
                    </div>
                </section>
            </>
        );
    }

    const renderContentBlock = (block) => {
        switch (block.type) {
            case 'h1':
                return <TitleComponent key={block.id} type="h1" className="!text-3xl font-bold mt-8 mb-4">{block.value}</TitleComponent>;
            case 'h2':
                return <TitleComponent key={block.id} type="h2" className="!text-2xl font-bold mt-8 mb-4">{block.value}</TitleComponent>;
            case 'h3':
                return <TitleComponent key={block.id} type="h3" className="!text-xl font-bold mt-10 mb-4 text-black">{block.value}</TitleComponent>;
            case 'p':
                return <p key={block.id} className="text-textColor leading-relaxed mb-6 text-lg">{block.value}</p>;
            case 'list':
                return (
                    <ul key={block.id} className="my-8 space-y-4">
                        {Array.isArray(block.value) && block.value.map((item, i) => (
                            <li key={i} className="flex items-start gap-4 text-textColor text-lg leading-relaxed">
                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primaryLight flex items-center justify-center mt-0.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                                </span>
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                );
            case 'descList':
                return (
                    <div key={block.id} className="bg-white border-l-4 border-primary p-8 rounded-r-2xl shadow-sm my-10 ring-1 ring-gray-100">
                        <dl className="space-y-6">
                            {Array.isArray(block.value) && block.value.map((item, i) => (
                                <div key={i} className="group">
                                    <dt className="font-bold text-black text-xl mb-2 flex items-center gap-3">
                                        <span className="text-primary text-2xl">0{i + 1}.</span>
                                        {item.term}
                                    </dt>
                                    <dd className="text-textColor text-lg pl-10 leading-relaxed">{item.details}</dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                );
            case 'image':
                return (
                    <figure key={block.id} className="my-12 text-center">
                        <div className="rounded-2xl overflow-hidden shadow-xl ring-8 ring-gray-50 mb-4 transition-transform duration-500 hover:scale-[1.01]">
                            <img src={block.value} alt={block.alt || 'Content image'} className="w-full h-auto object-cover" />
                        </div>
                        {block.alt && (
                            <figcaption className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full text-sm font-medium text-gray-500 border border-gray-100">
                                <div className="w-1 h-1 rounded-full bg-primary"></div>
                                {block.alt}
                            </figcaption>
                        )}
                    </figure>
                );
            default:
                return null;
        }
    };

    return (
        <>
            <HeroSec2
                heading={blog.title || blog.heading}
                desc=""
                Link="/blog"
                pageText="Blog Detail"
                className="max-w-[900px]"
            />

            <section className="lg:py-24 md:py-20 py-16">
                <div className="container">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Main Content Area */}
                        <div className="lg:col-span-8">
                            {/* Blog Meta Info */}
                            <div className="flex flex-wrap items-center gap-6 mb-8 pb-8 border-b border-gray-200">
                                <div className="flex items-center gap-2">
                                    <div className="flex justify-center items-center">
                                        <User className='text-primary' size={20} weight='bold' />
                                    </div>
                                    <span className="text-textColor text-sm font-medium">By {blog.author || 'Admin'}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="flex justify-center items-center">
                                        <CalendarCheck className='text-primary' size={20} weight='bold' />
                                    </div>
                                    <span className="text-textColor text-sm font-medium">{blog.date || blog.datePosted}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="flex justify-center items-center">
                                        <Tag className='text-primary' size={20} weight='bold' />
                                    </div>
                                    <span className="text-textColor text-sm font-medium">{blog.category || 'Wellness'}</span>
                                </div>
                                <div className="ml-auto hidden sm:flex items-center gap-3">
                                    <span className="text-sm font-semibold text-textColor">Share:</span>
                                    <div className="flex items-center gap-2">
                                        <a href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-primaryLight flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all duration-300">
                                            <FacebookLogo size={18} weight="fill" />
                                        </a>
                                        <a href={`https://twitter.com/intent/tweet?url=${window.location.href}&text=${blog.title || blog.heading}`} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-primaryLight flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all duration-300">
                                            <TwitterLogo size={18} weight="fill" />
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Featured Image */}
                            {blog.image && (
                                <div className="mb-10 rounded-2xl overflow-hidden shadow-lg">
                                    <img src={blog.image} alt={blog.title || blog.heading} className="w-full h-auto aspect-[16/9] object-cover" />
                                </div>
                            )}

                            {/* Blog Content */}
                            <div className="prose prose-lg max-w-none">
                                <TitleComponent type="p" size="large" className="text-textColor leading-relaxed mb-6 font-semibold italic">
                                    {blog.description}
                                </TitleComponent>

                                <div className="space-y-6 text-textColor leading-relaxed">
                                    {blog.contentBlocks && blog.contentBlocks.length > 0 ? (
                                        blog.contentBlocks.map(block => renderContentBlock(block))
                                    ) : (
                                        <p>No content blocks found for this post.</p>
                                    )}
                                </div>
                            </div>

                            {/* Tags */}
                            <div className="mt-12 pt-8 border-t border-gray-200">
                                <div className="flex flex-wrap items-center gap-3">
                                    <span className="text-sm font-semibold text-black">Tags:</span>
                                    <div className="flex flex-wrap gap-2">
                                        {['Wellness', 'Spa', 'Beauty', 'Relaxation', 'Self-care'].map((tag, index) => (
                                            <span key={index} className="px-4 py-1.5 bg-primaryLight text-primary text-sm font-medium rounded-full hover:bg-primary hover:text-white transition-all duration-300 cursor-pointer">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Post Navigation */}
                            <div className="mt-12 pt-8 border-t border-gray-200">
                                <div className="flex flex-col sm:flex-row justify-between gap-4">
                                    {prevBlogId && (
                                        <Link to={`/blog/${prevBlogId}`} className="group flex items-center gap-3 px-6 py-4 bg-white hover:bg-primaryLight border border-gray-200 rounded-xl transition-all duration-300 flex-1">
                                            <ArrowLeft size={24} className="text-primary" weight="bold" />
                                            <div className="text-left">
                                                <span className="text-xs text-textColor block mb-1">Previous Post</span>
                                                <span className="text-sm font-semibold text-black group-hover:text-primary transition-colors line-clamp-1">
                                                    {allBlogs.find(b => b.id === prevBlogId)?.title || allBlogs.find(b => b.id === prevBlogId)?.heading}
                                                </span>
                                            </div>
                                        </Link>
                                    )}

                                    {nextBlogId && (
                                        <Link to={`/blog/${nextBlogId}`} className="group flex items-center gap-3 px-6 py-4 bg-white hover:bg-primaryLight border border-gray-200 rounded-xl transition-all duration-300 flex-1">
                                            <div className="text-right flex-1">
                                                <span className="text-xs text-textColor block mb-1">Next Post</span>
                                                <span className="text-sm font-semibold text-black group-hover:text-primary transition-colors line-clamp-1">
                                                    {allBlogs.find(b => b.id === nextBlogId)?.title || allBlogs.find(b => b.id === nextBlogId)?.heading}
                                                </span>
                                            </div>
                                            <ArrowRight size={24} className="text-primary" weight="bold" />
                                        </Link>
                                    )}
                                </div>
                            </div>

                            {/* Comments Section */}
                            <div id="comments-section" className="mt-12 pt-8 border-t border-gray-200">
                                <div className="flex items-center gap-3 mb-8">
                                    <ChatCircleDots size={32} className="text-primary" weight="bold" />
                                    <TitleComponent type="h3" className="!text-2xl !font-bold">
                                        Comments ({comments.length})
                                    </TitleComponent>
                                </div>

                                {showSuccess && (
                                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 animate-fade-in">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        <p className="text-green-700 font-medium">Your comment has been posted successfully!</p>
                                    </div>
                                )}

                                {currentUser ? (
                                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8 mb-10">
                                        <div className="flex items-center justify-between mb-6">
                                            <TitleComponent type="h4" className="!text-xl !font-bold">
                                                Leave a Comment
                                            </TitleComponent>
                                            <div className="text-sm text-textColor">
                                                Posting as <span className="font-bold text-black">{currentUser.displayName || currentUser.name}</span>
                                            </div>
                                        </div>

                                        <form onSubmit={handleSubmitComment} className="space-y-5">
                                            <div>
                                                <label htmlFor="comment" className="block text-sm font-semibold text-black mb-2">
                                                    Comment <span className="text-red-500">*</span>
                                                </label>
                                                <textarea id="comment" name="comment" value={formData.comment} onChange={handleInputChange} rows="5" className={`w-full px-4 py-3 border ${formErrors.comment ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 resize-none`} placeholder="Share your thoughts..."></textarea>
                                                {formErrors.comment && <p className="mt-1 text-sm text-red-500">{formErrors.comment}</p>}
                                            </div>
                                            <ThemeButton variant="primary" type="submit" className="px-8">Post Comment</ThemeButton>
                                        </form>
                                    </div>
                                ) : (
                                    <div className="bg-primaryLight rounded-2xl p-8 mb-10 text-center border border-primary/20">
                                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-primary">
                                            <User size={32} weight="bold" />
                                        </div>
                                        <TitleComponent type="h4" className="!text-xl !font-bold mb-2">Want to join the discussion?</TitleComponent>
                                        <p className="text-textColor mb-6 max-w-md mx-auto">Please log in to share your thoughts and connect with our community.</p>
                                        <ThemeButton variant="primary" onClick={() => navigate('/signin')} className="px-10">Login to Comment</ThemeButton>
                                    </div>
                                )}

                                <div className="space-y-6">
                                    {comments.length === 0 ? (
                                        <div className="text-center py-12 bg-gray-50 rounded-2xl border border-gray-100">
                                            <ChatCircleDots size={48} className="text-gray-300 mx-auto mb-4" weight="light" />
                                            <TitleComponent type="h4" className="!text-lg text-gray-400 mb-2">No comments yet</TitleComponent>
                                            <p className="text-textColor text-sm">Be the first to share your thoughts!</p>
                                        </div>
                                    ) : (
                                        comments.map((comment) => (
                                            <div key={comment.id} className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-all duration-300">
                                                <div className="flex items-start gap-4">
                                                    <div className="flex-shrink-0">
                                                        <div className="w-12 h-12 rounded-full overflow-hidden bg-primaryLight flex items-center justify-center">
                                                            {comment.photoURL ? (
                                                                <img src={comment.photoURL} alt={comment.name} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <User size={24} className="text-primary" weight="bold" />
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                                                            <div className="flex items-center gap-3">
                                                                <h5 className="font-bold text-black text-lg">{comment.name}</h5>
                                                                <span className="text-xs text-textColor">•</span>
                                                                <span className="text-sm text-textColor">{comment.date} {comment.edited && <span className="italic opacity-70">(edited)</span>}</span>
                                                            </div>

                                                            {/* Comment Actions */}
                                                            {currentUser && currentUser.uid === comment.userId && (
                                                                <div className="flex items-center gap-2">
                                                                    {editingCommentId === comment.id ? (
                                                                        <>
                                                                            <button
                                                                                onClick={() => handleUpdateComment(comment.id)}
                                                                                className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors"
                                                                                title="Save"
                                                                            >
                                                                                <Check size={18} weight="bold" />
                                                                            </button>
                                                                            <button
                                                                                onClick={() => setEditingCommentId(null)}
                                                                                className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                                                                title="Cancel"
                                                                            >
                                                                                <X size={18} weight="bold" />
                                                                            </button>
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <button
                                                                                onClick={() => handleStartEdit(comment)}
                                                                                className="p-2 text-primary hover:bg-primaryLight rounded-full transition-colors"
                                                                                title="Edit"
                                                                            >
                                                                                <PencilSimple size={18} weight="bold" />
                                                                            </button>
                                                                            <button
                                                                                onClick={() => setCommentToDelete(comment.id)}
                                                                                className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                                                                title="Delete"
                                                                                disabled={actionLoading}
                                                                            >
                                                                                <Trash size={18} weight="bold" />
                                                                            </button>
                                                                        </>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>

                                                        {editingCommentId === comment.id ? (
                                                            <div className="mt-2">
                                                                <textarea
                                                                    value={editCommentText}
                                                                    onChange={(e) => setEditCommentText(e.target.value)}
                                                                    className="w-full px-4 py-3 border border-primary rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 resize-none disabled:bg-gray-50"
                                                                    rows="3"
                                                                    disabled={actionLoading}
                                                                ></textarea>
                                                            </div>
                                                        ) : (
                                                            <p className="text-textColor leading-relaxed">{comment.comment}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>

                                {/* Delete Confirmation Modal */}
                                {commentToDelete && (
                                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                                        <div className="bg-white rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl animate-scale-up">
                                            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                                <Trash size={32} weight="bold" />
                                            </div>
                                            <h3 className="text-2xl font-bold text-black text-center mb-2">Delete Comment?</h3>
                                            <p className="text-textColor text-center mb-8">
                                                Are you sure you want to delete this comment? This action cannot be undone.
                                            </p>
                                            <div className="flex gap-4">
                                                <button
                                                    onClick={() => setCommentToDelete(null)}
                                                    className="flex-1 px-6 py-3 border border-gray-200 text-black font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                                                    disabled={actionLoading}
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={handleDeleteComment}
                                                    className="flex-1 px-6 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                                                    disabled={actionLoading}
                                                >
                                                    {actionLoading ? (
                                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                    ) : "Delete"}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Sidebar */}
                        <aside className="lg:col-span-4">
                            <div className="lg:sticky lg:top-24 space-y-8">
                                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                                    <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-200">
                                        <div className="w-1 h-6 bg-primary rounded-full"></div>
                                        <TitleComponent type="h3" className="!text-xl !font-bold">Related Articles</TitleComponent>
                                    </div>
                                    <div className="space-y-4">
                                        {relatedBlogs.map((relatedBlog) => (
                                            <SidebarBlogCard key={relatedBlog.id} data={relatedBlog} index={relatedBlog.id} />
                                        ))}
                                    </div>
                                    <div className="mt-6 pt-4 border-t border-gray-100">
                                        <ThemeButton variant="primary" onClick={() => navigate('/blog')} className="w-full">View All Articles</ThemeButton>
                                    </div>
                                </div>

                                <div className="bg-primaryLight rounded-2xl p-6">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-1 h-6 bg-primary rounded-full"></div>
                                        <TitleComponent type="h3" className="!text-lg !font-bold">Categories</TitleComponent>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {['Wellness', 'Spa Treatments', 'Beauty Tips', 'Relaxation', 'Self-Care', 'Health'].map((category, index) => (
                                            <span key={index} className="px-3 py-1.5 bg-white text-primary text-sm font-medium rounded-full hover:bg-primary hover:text-white transition-all duration-300 cursor-pointer">
                                                {category}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </section>
        </>
    );
};

export default BlogDetailPage;
