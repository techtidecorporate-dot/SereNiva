import SectionTitle from '../sectionTitle/sectionTitle';
import TitleComponent from '../titleComponent/titleComponent';
import ThemeInput from '../themeInput/themeInput';

const NewsletterSec = () => {
    return (
        <section className='newsletter_sec bg-[#F7B668]/20 lg:py-32 md:py-24 py-14'>
            <div className="container">
                <SectionTitle
                    subtitle="Special Offer" subtitleClass="newsletter_subtitle"
                    title="Get" titleClass="newsletter_title"
                    headingLevel='h1' highlightedText="20% off" remainingTitle="your first order"
                    sectionStyle="text-center"
                >
                    <TitleComponent size='base' className='newsletter_desc my-5 text-black'>Join our email list for exclusive offers and the latest news</TitleComponent>
                    <ThemeInput
                        type="email"
                        name="email"
                        id="email"
                        placeholder="Email"
                        required={true}
                        buttonText='Subscribe'
                        className='newsletter_input flex sm:flex-row flex-col sm:gap-0 gap-2 items-center mx-auto w-[700px] max-w-full'
                    />
                </SectionTitle>
            </div>
        </section>
    )
}

export default NewsletterSec;
