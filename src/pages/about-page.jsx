import HeroSec2 from '../components/heroSec/heroSec2';
import AboutSec2 from '../components/aboutSec/aboutSec2';
import ServiceSec from '../components/serviceSec/serviceSec';
import EmpowerSkinSec from '../components/empowerSkinSec/empowerSkinSec';
import SkinProductSec from '../components/skinCareProductsSec/skinProductSec';
import TestimonialSec from '../components/testimonialSec/testimonialSec';
import TeamSec from '../components/teamSec/teamSec';
import NewsletterSec from '../components/newsletterSec/newsletterSec';

const AboutPage = () => {
    return (
        <>
            <HeroSec2
                heading="About Us"
                Link="/about"
                pageText="About Us"
            />
            <AboutSec2 />
            <ServiceSec />
            <EmpowerSkinSec />
            <SkinProductSec />
            <TestimonialSec />
            <TeamSec />
            <NewsletterSec />
        </>
    )
}

export default AboutPage
