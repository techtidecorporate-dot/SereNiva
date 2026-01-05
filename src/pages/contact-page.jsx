import HeroSec2 from '../components/heroSec/heroSec2';
import ContactSec from '../components/contactSec/contactSec';

const ContactPage = () => {
    return (
        <>
            <HeroSec2
                heading="Contact Us"
                Link="/contact"
                pageText="Contact Us"
            />
            <ContactSec />
        </>
    )
}

export default ContactPage
