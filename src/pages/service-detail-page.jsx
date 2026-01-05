import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { database } from '../firebase';
import { ref, onValue } from 'firebase/database';
import { Clock, CurrencyDollar, CheckCircle, Star, UserCircle, Tag, CalendarCheck } from 'phosphor-react';
import TitleComponent from '../components/titleComponent/titleComponent';
import ThemeButton from '../components/themeButton/themeButton';

const ServiceDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [service, setService] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = () => {
            // 1. Fetch Service Details
            const serviceRef = ref(database, `services/${id}`);
            const unsubscribeService = onValue(serviceRef, (snapshot) => {
                if (snapshot.exists()) {
                    setService({ id, ...snapshot.val() });
                } else {
                    setService(null);
                }
            });

            // 2. Fetch Reviews
            const reviewsRef = ref(database, 'reviews');
            const unsubscribeReviews = onValue(reviewsRef, (snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    const reviewsList = Object.keys(data).map(key => ({
                        id: key,
                        ...data[key]
                    })).filter(r => r.serviceId === id);
                    setReviews(reviewsList);
                } else {
                    setReviews([]);
                }
                setLoading(false);
            });

            return () => {
                unsubscribeService();
                unsubscribeReviews();
            };
        };

        fetchData();
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!service) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center space-y-4 bg-gray-50">
                <h2 className="text-3xl font-Merriwheather font-bold text-gray-800">Service Not Found</h2>
                <p className="text-gray-500">The service you're looking for doesn't exist or has been removed.</p>
                <ThemeButton onClick={() => navigate('/services')} variant="primary" className="mt-4">
                    Back to Services
                </ThemeButton>
            </div>
        );
    }

    const averageRating = reviews.length > 0
        ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1)
        : 0;

    return (
        <div className="animate-fade-in pb-20 bg-white">
            {/* Custom Immersive Hero Section */}
            <div className="relative h-[45vh] min-h-[350px] flex items-center justify-center overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <img
                        src={service.image}
                        alt={service.name}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-textColor/20" />
                </div>

                {/* Hero Content */}
                <div className="relative z-10 container mx-auto px-4 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/30 bg-white/10 backdrop-blur-md text-white text-xs font-bold uppercase tracking-widest mb-6 animate-fade-in-down">
                        <Tag size={14} weight="bold" /> {service.category}
                    </div>
                    <TitleComponent type="h1" className="text-4xl md:text-5xl lg:text-6xl text-white mb-6 drop-shadow-2xl animate-fade-in-up">
                        {service.name}
                    </TitleComponent>

                    <div className="flex flex-wrap justify-center gap-6 md:gap-12 text-white/90 font-medium text-lg animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                        <div className="flex items-center gap-3">
                            <Clock size={24} className="text-white" weight="fill" />
                            <span>{service.duration}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <CurrencyDollar size={24} className="text-white" weight="fill" />
                            <span>${service.price}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Star weight="fill" size={24} className="text-white" />
                            <span>{averageRating}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className='px-4 md:px-8 py-20 lg:py-24'>
                <div className="container">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-20">

                        {/* Left Column: Description & Details */}
                        <div className="lg:col-span-7 space-y-16">
                            {/* Description */}
                            <div>
                                <span className="text-primary font-bold tracking-widest uppercase text-sm mb-4 block">{service.category}</span>
                                <h2 className="text-3xl md:text-4xl font-Merriwheather text-black2 mb-6 leading-tight">
                                    {service.detailPageHeading || "Indulge in a premium spa experience designed to relax your body and calm your mind."}
                                </h2>
                                <p className="text-lg text-textColor leading-loose whitespace-pre-line">
                                    {service.fullDescription || service.description}
                                </p>
                            </div>

                            {/* Benefits Grid */}
                            {service.benefits && service.benefits.length > 0 && (
                                <div className="bg-primaryLight/30 p-8 rounded-3xl">
                                    <h3 className="text-2xl font-Merriwheather text-black2 mb-6">Treatment Benefits</h3>
                                    <div className="grid sm:grid-cols-2 gap-y-4 gap-x-8">
                                        {service.benefits.map((benefit, i) => (
                                            <div key={i} className="flex items-center gap-4">
                                                <div className="p-1 rounded-full bg-primary/10 text-primary mt-1">
                                                    <CheckCircle size={20} weight="fill" />
                                                </div>
                                                <span className="text-gray-700 font-medium">{benefit}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* What's Included */}
                            {service.included && service.included.length > 0 && (
                                <div>
                                    <h3 className="text-2xl font-Merriwheather text-black2 mb-6">What's Included</h3>
                                    <div className="flex flex-wrap gap-3">
                                        {service.included.map((item, i) => (
                                            <span key={i} className="px-6 py-3 bg-gray-50 border border-gray-100 rounded-xl text-gray-700 font-medium">
                                                {item}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Reviews */}
                            <div id="reviews" className="pt-10 border-t border-gray-100">
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="text-2xl font-Merriwheather text-black2">Client Reviews</h3>
                                </div>

                                <div className="space-y-8">
                                    {reviews.length > 0 ? reviews.map(review => (
                                        <div key={review.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                            <div className="flex items-center gap-4 mb-4">
                                                <div className="w-12 h-12 rounded-full bg-gray-100 overflow-hidden">
                                                    {review.avatar ? (
                                                        <img src={review.avatar} alt="User" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                            <UserCircle size={32} />
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-gray-900">{review.reviewerName || "Guest"}</h4>
                                                    <div className="flex text-yellow-400 text-xs mt-1">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star key={i} weight={i < review.rating ? "fill" : "regular"} size={14} />
                                                        ))}
                                                    </div>
                                                </div>
                                                <span className="ml-auto text-xs text-gray-400">{review.date}</span>
                                            </div>
                                            <p className="text-gray-600 italic">"{review.reviewText}"</p>
                                        </div>
                                    )) : (
                                        <p className="text-gray-500 italic">No reviews yet. Be the first to review!</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Sticky Booking Card */}
                        <div className="lg:col-span-5 relative">
                            <div className="sticky top-28 space-y-8">
                                <div className="bg-white p-8 rounded-[2rem] shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden relative">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-primaryLight/50 rounded-bl-[100%] z-0" />

                                    <div className="relative z-10">
                                        <div className="text-center mb-8">
                                            <p className="text-gray-500 text-sm font-bold uppercase tracking-widest mb-2">Price Per Session</p>
                                            <div className="flex items-center justify-center gap-1 text-black2">
                                                <span className="text-2xl font-Merriwheather">$</span>
                                                <span className="text-6xl font-Merriwheather font-bold">{service.price}</span>
                                            </div>
                                        </div>

                                        <div className="space-y-4 mb-8">
                                            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                                                <span className="text-gray-600 font-medium flex items-center gap-2">
                                                    <Clock size={20} className="text-primary" /> Duration
                                                </span>
                                                <span className="font-bold text-gray-900">{service.duration}</span>
                                            </div>
                                            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                                                <span className="text-gray-600 font-medium flex items-center gap-2">
                                                    <Tag size={20} className="text-primary" /> Category
                                                </span>
                                                <span className="font-bold text-gray-900">{service.category}</span>
                                            </div>
                                        </div>

                                        <ThemeButton
                                            variant="primary"
                                            className="w-full !text-lg !py-4 shadow-xl shadow-primary/20 hover:shadow-primary/40 flex items-center justify-center gap-2"
                                            onClick={() => navigate('/appointment')}
                                        >
                                            <CalendarCheck size={24} weight="bold" />
                                            <span>Book Appointment</span>
                                        </ThemeButton>

                                        <p className="text-xs text-center text-gray-400 mt-4">
                                            No payment required to book. Pay at the venue.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServiceDetailPage;
