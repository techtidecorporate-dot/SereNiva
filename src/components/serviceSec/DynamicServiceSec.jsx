import { useState, useEffect } from 'react';
import { database } from '../../firebase';
import { ref, onValue } from 'firebase/database';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import SkinCareProduct from '../skinCareProductsSec/skinCareProduct';
import SectionTitle from '../sectionTitle/sectionTitle';

const DynamicServiceSec = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const servicesRef = ref(database, 'services'); // Fetching active services from backend
        const unsubscribe = onValue(servicesRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const servicesArray = Object.keys(data).map(key => ({
                    id: key,
                    ...data[key]
                })).filter(s => s.status === 'Active');
                setServices(servicesArray);
            } else {
                setServices([]);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (loading) {
        return (
            <div className="min-h-[50vh] flex justify-center items-center">
                <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <section className="skin_product_sec py-20 bg-white">
            {/* Section Title Integration */}
            <SectionTitle
                subtitle="Discover Our Menu"
                title="Curated Wellness"
                highlightedText="Experiences"
                sectionStyle="text-center mb-16"
                headingLevel="h2"
            >
                <p className="text-textColor leading-relaxed max-w-2xl mx-auto mt-4">
                    Explore our selection of premium treatments designed to restore balance and rejuvenate your spirit.
                </p>
            </SectionTitle>

            {/* Using Swiper exactly like SkinProductSec */}
            <Swiper
                spaceBetween={0}
                loop={services.length > 3}
                autoplay={services.length > 0}
                modules={[Autoplay]}
                breakpoints={{
                    0: {
                        slidesPerView: 1
                    },
                    640: {
                        slidesPerView: 2
                    },
                    1024: {
                        slidesPerView: 3
                    },
                }}
            >
                {services.map((service, index) => (
                    <SwiperSlide key={service.id || index}>
                        {/* Reusing SkinCareProduct exact component */}
                        <SkinCareProduct props={service} />
                    </SwiperSlide>
                ))}
            </Swiper>

            {services.length === 0 && (
                <div className="text-center py-20 text-gray-500">
                    <p>No services currently available.</p>
                </div>
            )}
        </section>
    );
};

export default DynamicServiceSec;
