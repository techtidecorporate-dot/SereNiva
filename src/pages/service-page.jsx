import HeroSec2 from '../components/heroSec/heroSec2';
import NewsletterSec from '../components/newsletterSec/newsletterSec';
import SkinProductSec from '../components/skinCareProductsSec/skinProductSec';
import ProductBenefitsSec from '../components/productBenefitsSec/productBenefitsSec';
import TestimonialSec from '../components/testimonialSec/testimonialSec';

const ServicePage = () => {
    return (
        <>
            <HeroSec2
                heading="Our Services"
                Link="/services"
                pageText="Services"
            />
            {/* Moved DynamicServiceSec to the top as requested, now replaced with SkinProductSec */}
            <SkinProductSec />
            <ProductBenefitsSec />
            <TestimonialSec />
            <NewsletterSec />
        </>
    )
}

export default ServicePage;
