import { useState, useEffect } from 'react';
import { Star } from 'phosphor-react';
import Modal from './Modal';
import ThemeButton from '../themeButton/themeButton';
import clsx from 'clsx';

const ReviewModal = ({ isOpen, onClose, appointment, onSubmit, mode = 'add' }) => {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen && appointment?.review && (mode === 'edit' || mode === 'view')) {
            setRating(appointment.review.rating);
            setReviewText(appointment.review.reviewText);
        } else if (isOpen && mode === 'add') {
            setRating(0);
            setReviewText('');
            setError('');
        }
    }, [isOpen, appointment, mode]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (mode === 'view') return;

        if (rating === 0) {
            setError('Please select a rating');
            return;
        }
        if (reviewText.trim().length < 10) {
            setError('Please write at least 10 characters for your review');
            return;
        }

        onSubmit({
            rating,
            reviewText,
            service: appointment.service,
            date: mode === 'edit' ? appointment.review.date : new Date().toLocaleDateString(),
            appointmentId: appointment.id
        });

        onClose();
    };

    const footer = (
        <>
            <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900"
            >
                {mode === 'view' ? "Close" : "Cancel"}
            </button>
            {mode !== 'view' && (
                <ThemeButton
                    onClick={handleSubmit}
                    variant="primary"
                >
                    {mode === 'edit' ? "Save Changes" : "Submit Review"}
                </ThemeButton>
            )}
        </>
    );

    const title = mode === 'view' ? "Your Review" : mode === 'edit' ? "Edit Your Review" : "Leave a Review";

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            footer={footer}
            size="md"
        >
            <div className="space-y-6">
                <div className="text-center">
                    <h4 className="text-lg font-bold text-gray-900">{appointment?.service}</h4>
                    <p className="text-sm text-gray-500">
                        {mode === 'view' ? `Reviewed on ${appointment?.review?.date}` : `How was your experience on ${appointment?.date}?`}
                    </p>
                </div>

                {/* Star Rating */}
                <div className="flex flex-col items-center gap-2">
                    <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                disabled={mode === 'view'}
                                className={clsx(
                                    "transition-transform focus:outline-none",
                                    mode !== 'view' && "hover:scale-110"
                                )}
                                onMouseEnter={() => mode !== 'view' && setHoverRating(star)}
                                onMouseLeave={() => mode !== 'view' && setHoverRating(0)}
                                onClick={() => {
                                    setRating(star);
                                    setError('');
                                }}
                            >
                                <Star
                                    size={40}
                                    weight={(hoverRating || rating) >= star ? "fill" : "regular"}
                                    className={clsx(
                                        (hoverRating || rating) >= star ? "text-yellow-400" : "text-gray-300",
                                        mode === 'view' && "cursor-default"
                                    )}
                                />
                            </button>
                        ))}
                    </div>
                    <p className="text-sm font-medium text-gray-600">
                        {rating > 0 ? (
                            rating === 5 ? "Excellent!" :
                                rating === 4 ? "Very Good" :
                                    rating === 3 ? "Good" :
                                        rating === 2 ? "Fair" : "Poor"
                        ) : "Select a rating"}
                    </p>
                </div>

                {/* Review Text */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Your Feedback</label>
                    <textarea
                        value={reviewText}
                        disabled={mode === 'view'}
                        onChange={(e) => {
                            setReviewText(e.target.value);
                            if (e.target.value.length >= 10) setError('');
                        }}
                        placeholder="Tell us about your experience..."
                        className={clsx(
                            "w-full p-4 bg-gray-50 border rounded-xl text-sm text-gray-900 focus:bg-white focus:outline-none h-32 resize-none transition-all",
                            mode === 'view' && "cursor-default",
                            error && error.includes('characters') ? "border-red-300 focus:border-red-500" : "border-transparent focus:border-primary"
                        )}
                    />
                    {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
                </div>

                {mode !== 'view' && (
                    <div className="bg-primary/5 p-4 rounded-lg">
                        <p className="text-xs text-primary/70 italic text-center leading-relaxed">
                            Your review will help us improve our services and help other customers make better choices.
                        </p>
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default ReviewModal;
