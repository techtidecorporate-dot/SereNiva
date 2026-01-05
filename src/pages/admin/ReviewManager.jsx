import { useState } from 'react';
import { serviceReviews as initialServiceReviews, blogReviews as initialBlogReviews } from '../../data/admin-data';
import { Star, MagnifyingGlass, ChatCircleDots, Eye, EyeSlash, Trash, CheckCircle, XCircle } from 'phosphor-react';
import clsx from 'clsx';

const ReviewManager = () => {
    const [activeTab, setActiveTab] = useState('services'); // 'services' or 'blogs'
    const [filterStatus, setFilterStatus] = useState('All'); // 'All', 'Pending', 'Approved', 'Hidden'
    const [searchQuery, setSearchQuery] = useState('');
    const [serviceReviews, setServiceReviews] = useState(initialServiceReviews);
    const [blogReviews, setBlogReviews] = useState(initialBlogReviews);
    const [selectedReview, setSelectedReview] = useState(null);
    const [replyText, setReplyText] = useState('');

    // Filter reviews based on status and search
    const getFilteredReviews = (reviews) => {
        let filtered = reviews;

        // Filter by status
        if (filterStatus !== 'All') {
            filtered = filtered.filter(r => r.status === filterStatus);
        }

        // Filter by search query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(r =>
                r.reviewerName.toLowerCase().includes(query) ||
                r.email.toLowerCase().includes(query) ||
                (activeTab === 'services' ? r.service : r.blogTitle).toLowerCase().includes(query) ||
                (activeTab === 'services' ? r.reviewText : r.commentText).toLowerCase().includes(query)
            );
        }

        return filtered;
    };

    const currentReviews = activeTab === 'services' ? serviceReviews : blogReviews;
    const filteredReviews = getFilteredReviews(currentReviews);

    // Handle review actions
    const handleApprove = (id) => {
        if (activeTab === 'services') {
            setServiceReviews(prev => prev.map(r => r.id === id ? { ...r, status: 'Approved' } : r));
        } else {
            setBlogReviews(prev => prev.map(r => r.id === id ? { ...r, status: 'Approved' } : r));
        }
    };

    const handleHide = (id) => {
        if (activeTab === 'services') {
            setServiceReviews(prev => prev.map(r => r.id === id ? { ...r, status: 'Hidden' } : r));
        } else {
            setBlogReviews(prev => prev.map(r => r.id === id ? { ...r, status: 'Hidden' } : r));
        }
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
            if (activeTab === 'services') {
                setServiceReviews(prev => prev.filter(r => r.id !== id));
            } else {
                setBlogReviews(prev => prev.filter(r => r.id !== id));
            }
        }
    };

    const handleReply = (review) => {
        setSelectedReview(review);
        setReplyText(review.reply || '');
    };

    const submitReply = () => {
        if (!replyText.trim()) return;

        if (activeTab === 'services') {
            setServiceReviews(prev => prev.map(r =>
                r.id === selectedReview.id ? { ...r, reply: replyText } : r
            ));
        } else {
            setBlogReviews(prev => prev.map(r =>
                r.id === selectedReview.id ? { ...r, reply: replyText } : r
            ));
        }

        setSelectedReview(null);
        setReplyText('');
    };

    // Star rating display component
    const StarRating = ({ rating }) => (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    size={16}
                    weight={star <= rating ? "fill" : "regular"}
                    className={star <= rating ? "text-yellow-500" : "text-gray-300"}
                />
            ))}
        </div>
    );

    return (
        <div className="space-y-6 animate-fade-in-down">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Reviews Management</h2>
                    <p className="text-gray-500 text-sm">Manage service reviews and blog comments</p>
                </div>

                {/* Tab Switcher */}
                <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-gray-100 shadow-sm">
                    <button
                        onClick={() => setActiveTab('services')}
                        className={clsx(
                            "px-4 py-2 text-sm font-medium rounded-md transition-colors",
                            activeTab === 'services'
                                ? "bg-primary text-white"
                                : "text-gray-600 hover:bg-gray-50"
                        )}
                    >
                        Services Reviews
                    </button>
                    <button
                        onClick={() => setActiveTab('blogs')}
                        className={clsx(
                            "px-4 py-2 text-sm font-medium rounded-md transition-colors",
                            activeTab === 'blogs'
                                ? "bg-primary text-white"
                                : "text-gray-600 hover:bg-gray-50"
                        )}
                    >
                        Blog Reviews
                    </button>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Status Filter */}
                    <div className="flex gap-2">
                        {['All', 'Pending', 'Approved', 'Hidden'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={clsx(
                                    "px-3 py-1.5 text-xs font-medium rounded-lg transition-colors",
                                    filterStatus === status
                                        ? "bg-gray-900 text-white"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                )}
                            >
                                {status}
                            </button>
                        ))}
                    </div>

                    {/* Search */}
                    <div className="flex-1 relative">
                        <MagnifyingGlass size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search reviews by name, email, or content..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary"
                        />
                    </div>
                </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
                {filteredReviews.length === 0 ? (
                    <div className="bg-white rounded-xl p-12 text-center border border-gray-100">
                        <ChatCircleDots size={48} className="mx-auto mb-4 text-gray-300" />
                        <p className="text-gray-500">No reviews found</p>
                    </div>
                ) : (
                    filteredReviews.map((review) => (
                        <div key={review.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                            <div className="p-6">
                                <div className="flex items-start justify-between gap-4">
                                    {/* Reviewer Info */}
                                    <div className="flex items-start gap-4 flex-1">
                                        <img
                                            src={review.avatar}
                                            alt={review.reviewerName}
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-semibold text-gray-900">{review.reviewerName}</h3>
                                                {activeTab === 'services' && <StarRating rating={review.rating} />}
                                            </div>
                                            <p className="text-sm text-gray-500 mb-1">{review.email}</p>
                                            <p className="text-xs text-gray-400">
                                                {activeTab === 'services' ? `Service: ${review.service}` : `Blog: ${review.blogTitle}`} • {review.date}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Status Badge */}
                                    <span className={clsx(
                                        "px-3 py-1 rounded-full text-xs font-medium",
                                        review.status === 'Approved' && "bg-green-50 text-green-700 border border-green-100",
                                        review.status === 'Pending' && "bg-yellow-50 text-yellow-700 border border-yellow-100",
                                        review.status === 'Hidden' && "bg-red-50 text-red-700 border border-red-100"
                                    )}>
                                        {review.status}
                                    </span>
                                </div>

                                {/* Review Text */}
                                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                                    <p className="text-gray-700 text-sm leading-relaxed">
                                        {activeTab === 'services' ? review.reviewText : review.commentText}
                                    </p>
                                </div>

                                {/* Admin Reply */}
                                {review.reply && (
                                    <div className="mt-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                                        <p className="text-xs font-medium text-blue-900 mb-1">Admin Reply:</p>
                                        <p className="text-sm text-blue-800">{review.reply}</p>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="mt-4 flex items-center gap-2 pt-4 border-t border-gray-100">
                                    <button
                                        onClick={() => handleReply(review)}
                                        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    >
                                        <ChatCircleDots size={18} />
                                        {review.reply ? 'Edit Reply' : 'Reply'}
                                    </button>

                                    {review.status !== 'Approved' && (
                                        <button
                                            onClick={() => handleApprove(review.id)}
                                            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                        >
                                            <CheckCircle size={18} />
                                            Approve
                                        </button>
                                    )}

                                    {review.status !== 'Hidden' && (
                                        <button
                                            onClick={() => handleHide(review.id)}
                                            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                                        >
                                            <EyeSlash size={18} />
                                            Hide
                                        </button>
                                    )}

                                    <button
                                        onClick={() => handleDelete(review.id)}
                                        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-auto"
                                    >
                                        <Trash size={18} />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Reply Modal */}
            {selectedReview && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-2xl w-full p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">
                            Reply to {selectedReview.reviewerName}
                        </h3>

                        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-600">
                                {activeTab === 'services' ? selectedReview.reviewText : selectedReview.commentText}
                            </p>
                        </div>

                        <textarea
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Type your reply here..."
                            className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary resize-none h-32"
                        />

                        <div className="flex items-center gap-3 mt-4">
                            <button
                                onClick={submitReply}
                                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primaryDark transition-colors font-medium text-sm"
                            >
                                Submit Reply
                            </button>
                            <button
                                onClick={() => {
                                    setSelectedReview(null);
                                    setReplyText('');
                                }}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium text-sm"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReviewManager;
